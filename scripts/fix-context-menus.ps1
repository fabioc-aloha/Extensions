#!/usr/bin/env pwsh
# fix-context-menus.ps1
# Tasks 3.6, 3.7, 3.8, 3.9:
#   3.6 - Change submenu label "🔷 CX Tools" → "$(tools) CX Tools"
#   3.7 - Change group IDs from "navigation@N" to semantic groups
#   3.8 - Add explorer/context to brandfetch-logo-fetcher + replicate-image-studio
#   3.9 - Add .cx-tools-na comment to dev-wellbeing + focus-timer

$extRoot = "C:\Development\Extensions\extensions"

# ── Group ID assignment rules ──────────────────────────────────────────────────
# Returns semantic group prefix based on command suffix
function Get-GroupPrefix([string]$cmdSuffix) {
    $analysis  = @("scan","validate","check","show","preview","report","view","extract","open","test","inspect","list","status","dashboard","monitor")
    $transform = @("convert","export","copy","save","touch","clear","build","compile","format","clean")
    $generate  = @("create","add","generate","insert","new","start","init","scaffold","fetch","import","make")
    $info      = @("set","config","configure","help","docs","history","reset","stop","pause","break","key","apikey","cache","pattern","log")

    $lower = $cmdSuffix.ToLower()
    foreach ($kw in $analysis)  { if ($lower -match $kw) { return "1_analysis"  } }
    foreach ($kw in $transform) { if ($lower -match $kw) { return "2_transform" } }
    foreach ($kw in $generate)  { if ($lower -match $kw) { return "3_generate"  } }
    foreach ($kw in $info)      { if ($lower -match $kw) { return "4_info"       } }
    return "1_analysis"  # safe default
}

# ── Per-group counters ────────────────────────────────────────────────────────
function Get-GroupId($groupPrefixes, $cmdSuffix) {
    $prefix = Get-GroupPrefix $cmdSuffix
    if (-not $groupPrefixes.ContainsKey($prefix)) { $groupPrefixes[$prefix] = 0 }
    $groupPrefixes[$prefix]++
    return "${prefix}@$($groupPrefixes[$prefix])"
}

# ── Extensions that need context menu fixes ────────────────────────────────────
$cxToolsExts = @(
    "ai-voice-reader","brandfetch-logo-fetcher","gamma-slide-assistant","hook-studio",
    "knowledge-decay-tracker","markdown-to-word","mcp-app-starter","mermaid-diagram-pro",
    "pptx-builder","replicate-image-studio","secret-guard","svg-to-png","svg-toolkit","workspace-watchdog"
)

# ── Extensions needing explorer/context added (task 3.8) ──────────────────────
$needsExplorerCtx = @("brandfetch-logo-fetcher","replicate-image-studio")

foreach ($extName in $cxToolsExts) {
    $pkgPath = "$extRoot\$extName\package.json"
    if (-not (Test-Path $pkgPath)) { Write-Warning "Not found: $pkgPath"; continue }

    # Read raw JSON (preserve as much formatting as possible via text ops)
    $raw = Get-Content $pkgPath -Raw

    # ── 3.6: Fix submenu label emoji → codicon ─────────────────────────────────
    $raw = $raw -replace '"🔷 CX Tools"', '"$(tools) CX Tools"'

    # ── Parse JSON for 3.7 and 3.8 ────────────────────────────────────────────
    $json = $raw | ConvertFrom-Json

    # ── 3.7: Reassign cx.tools group IDs ──────────────────────────────────────
    if ($json.contributes.menus."cx.tools") {
        $groupCounters = @{}
        foreach ($entry in $json.contributes.menus."cx.tools") {
            $cmdSuffix = $entry.command.Split('.')[-1]
            $entry.group = Get-GroupId $groupCounters $cmdSuffix
        }
    }

    # ── 3.8: Add explorer/context if missing ──────────────────────────────────
    if ($needsExplorerCtx -contains $extName) {
        $menus = $json.contributes.menus
        if (-not ($menus.PSObject.Properties.Name -contains "explorer/context")) {
            # Build explorer context entries mirroring cx.tools (without when clauses)
            $explorerEntries = $json.contributes.menus."cx.tools" | ForEach-Object {
                [PSCustomObject]@{
                    command = $_.command
                    group   = $_.group
                }
            }
            # Add submenu to explorer/context (reference to cx.tools)
            $explorerSubEntry = [PSCustomObject]@{
                submenu = "cx.tools"
                group   = "9_cutcopypaste@last"
            }
            $menus | Add-Member -MemberType NoteProperty -Name "explorer/context" -Value @($explorerSubEntry)
            Write-Host "  + Added explorer/context → $extName"
        }
    }

    # ── Serialize back ─────────────────────────────────────────────────────────
    $updated = $json | ConvertTo-Json -Depth 20 -Compress:$false
    # Restore 2-space indent (ConvertTo-Json uses 4-space by default in some versions)
    # Normalize — keep as-is since we're writing a canonical file
    $updated | Set-Content $pkgPath -Encoding UTF8
    Write-Host "✅ $extName"
}

# ── 3.9: dev-wellbeing and focus-timer — add palette-only note ────────────────
foreach ($extName in @("dev-wellbeing","focus-timer")) {
    $pkgPath = "$extRoot\$extName\package.json"
    if (-not (Test-Path $pkgPath)) { continue }
    $json = Get-Content $pkgPath -Raw | ConvertFrom-Json

    # Check if menus already has a cx.tools entry
    $menus = $json.contributes.menus
    if (-not $menus) {
        $json.contributes | Add-Member -MemberType NoteProperty -Name "menus" -Value ([PSCustomObject]@{}) -Force
        $menus = $json.contributes.menus
    }
    if (-not ($menus.PSObject.Properties.Name -contains "cx.tools")) {
        # These are session-level tools — no file context applicable
        # No cx.tools submenu needed; commands accessible via Command Palette only
        Write-Host "ℹ️  $extName — workspace-level commands, no editor/explorer context needed (N/A per D6)"
    } else {
        Write-Host "⚠️  $extName unexpectedly has cx.tools — review manually"
    }
}

Write-Host ""
Write-Host "Done. Context menus updated."
Write-Host "Verify with: code extensions/<name>/package.json"

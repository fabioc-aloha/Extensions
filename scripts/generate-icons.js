/**
 * Icon Generator — Extensions Monorepo
 *
 * Generates 2 icon options per extension using Ideogram v2 via Replicate API.
 * Output: assets/icon-options/<extension-name>/option-a.png + option-b.png
 *
 * Usage:
 *   $env:REPLICATE_API_TOKEN = "r8_xxx"
 *   node scripts/generate-icons.js
 *   node scripts/generate-icons.js --extension focus-timer
 *   node scripts/generate-icons.js --extension focus-timer --option a
 *
 * Requirements:
 *   npm install node-fetch   (if Node < 18; Node 18+ has native fetch)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const MODEL = 'ideogram-ai/ideogram-v2'; // stable, high-quality
const BASE_OUT = path.join(__dirname, '..', 'assets', 'icon-options');

// Shared icon style parameters
const SHARED_STYLE = `VS Code extension app icon. Square format. Dark navy background (#1a1a2e). 
Bold, simple, instantly recognizable at 128x128px. 3D render + graphic design hybrid style. 
Centered composition. Premium feel. No text, no letters, no words.`;

// ---------------------------------------------------------------------------
// Icon Prompts — 2 options per extension
// ---------------------------------------------------------------------------

const ICONS = {
  'ai-voice-reader': {
    a: `${SHARED_STYLE} A glowing violet-purple (#a78bfa) 3D microphone with soft sound wave rings radiating outward. The mic capsule has a subtle metallic sheen. Background: dark navy (#1a1a2e) with faint purple particle glow. Accent color: #a78bfa.`,
    b: `${SHARED_STYLE} Abstract 3D soundwave visualization: a vertical waveform bar chart in violet-purple (#a78bfa) with bars of varying heights, glowing neon edges. The tallest bar at center. Background: deep navy to dark purple gradient. Accent: #a78bfa.`
  },
  'brandfetch-logo-fetcher': {
    a: `${SHARED_STYLE} A glowing orange 3D star/asterisk shape with 6 sharp rays, photorealistic metallic finish, suggesting brand identity and creativity. A subtle small download arrow below it. Background: dark navy. Accent: #fb923c warm orange.`,
    b: `${SHARED_STYLE} Three overlapping abstract brand logo shields in orange (#fb923c), each slightly offset and glowing. Suggests logo fetching and brand assets. Clean geometric design. Background: dark navy. Accent: #fb923c.`
  },
  'dev-wellbeing': {
    a: `${SHARED_STYLE} A glowing green (#34d399) heart shape with subtle code bracket symbols (<, >) softly embedded inside. 3D glass or crystal heart. Suggests developer health and code love. Background: dark navy. Accent: #34d399 emerald green.`,
    b: `${SHARED_STYLE} An EKG / heartbeat line in bright green (#34d399) that ends in an upward spike, forming the silhouette of a small heart at the peak. Clean neon style on dark navy. Suggests vital signs and developer wellbeing. Accent: #34d399.`
  },
  'focus-timer': {
    a: `${SHARED_STYLE} A glowing amber (#fbbf24) 3D tomato (Pomodoro) with a short green stem, smooth photorealistic surface, softly radiating a golden halo. Classic Pomodoro timer metaphor. Background: dark navy. Accent: #fbbf24 amber gold.`,
    b: `${SHARED_STYLE} A minimal 3D timer/hourglass in glowing amber (#fbbf24) — the top half almost empty, suggesting a focus countdown. Metallic finish with golden sand particles. Background: dark navy. Accent: #fbbf24.`
  },
  'gamma-slide-assistant': {
    a: `${SHARED_STYLE} Three presentation slides stacked in perspective, glowing purple (#c084fc), the front slide has a clean gradient bar as if showing a chart. Suggests slide generation. Background: dark navy. Accent: #c084fc purple.`,
    b: `${SHARED_STYLE} The Greek letter gamma (γ) rendered as a large bold 3D neon purple symbol, softly glowing, with small slide icons orbiting around it. Background: dark navy gradient. Accent: #c084fc violet.`
  },
  'hook-studio': {
    a: `${SHARED_STYLE} A single bold J-shaped fishing hook rendered in 3D metallic sky blue (#38bdf8), photorealistic chrome finish, glowing blue halo. Centered. Clean and iconic. Background: dark navy. Accent: #38bdf8 sky blue.`,
    b: `${SHARED_STYLE} Two curly brackets { } in glowing sky blue (#38bdf8) with a stylized hook curl between them, suggesting code hooks and VS Code hooks.json. Neon line art style on dark navy. Accent: #38bdf8.`
  },
  'knowledge-decay-tracker': {
    a: `${SHARED_STYLE} A stack of 3 glowing red (#f87171) book/document pages, the top one cracking or crumbling slightly at the corner suggesting knowledge decay. Small clock overlay at top-right. Background: dark navy. Accent: #f87171 red coral.`,
    b: `${SHARED_STYLE} A 3D line chart going downward from top-left to bottom-right in glowing red (#f87171), the bars fading in opacity as they approach the right — decay visualization. Background: dark navy. Accent: #f87171.`
  },
  'markdown-to-word': {
    a: `${SHARED_STYLE} Two document icons side by side: left is an MD file (dark, with # symbol inside in blue #60a5fa), right is a Word-style document (solid blue #60a5fa with W). A glowing right-pointing arrow between them. Background: dark navy. Accent: #60a5fa.`,
    b: `${SHARED_STYLE} The letters "MD" on the left transitioning into a bold "W" on the right via a glowing blue (#60a5fa) transformation arrow, all in 3D floating block letters. Suggests markdown to Word conversion. Background: dark navy.`
  },
  'mcp-app-starter': {
    a: `${SHARED_STYLE} A 3D electrical plug connector in glowing violet (#a78bfa), photorealistic with metallic prongs, plugging into a floating socket — suggesting MCP connection and app bootstrapping. Background: dark navy. Accent: #a78bfa violet.`,
    b: `${SHARED_STYLE} The letters "MCP" as glowing 3D block letters in violet-purple (#a78bfa) with small circuit trace lines running between them, suggesting protocol scaffolding. Clean tech aesthetic. Background: dark navy. Accent: #a78bfa.`
  },
  'mermaid-diagram-pro': {
    a: `${SHARED_STYLE} A glowing cyan (#22d3ee) flowchart: 3 connected nodes with arrows, the nodes being rounded rectangles. Clean and geometric, suggesting diagramming. Neon glow on dark navy. Accent: #22d3ee aqua cyan.`,
    b: `${SHARED_STYLE} A stylized mermaid tail silhouette in glowing cyan (#22d3ee) that transforms into a diagram/network graph at the tip, merging the mascot with the functionality. Background: dark navy. Accent: #22d3ee.`
  },
  'pptx-builder': {
    a: `${SHARED_STYLE} Three 3D presentation slide thumbnails arranged in a fanned/cascading stack, the front one showing orange (#fb923c) header bar. Suggests PowerPoint building. Background: dark navy. Accent: #fb923c warm orange.`,
    b: `${SHARED_STYLE} The letter "P" as a bold 3D orange (#fb923c) block letter with a small presentation slide outline incorporated into the negative space, styled like the PowerPoint P logo but abstract and original. Background: dark navy.`
  },
  'replicate-image-studio': {
    a: `${SHARED_STYLE} A glowing pink (#f472b6) 3D magic wand or paintbrush with sparkle particles emanating from the tip, suggesting AI image generation and creation. Background: dark navy. Accent: #f472b6 hot pink.`,
    b: `${SHARED_STYLE} Abstract 3D image frame in pink (#f472b6) with stars/sparkles inside the frame suggesting AI-generated images, a subtle infinity-like symbol overlay. Background: dark navy. Accent: #f472b6 pink.`
  },
  'secret-guard': {
    a: `${SHARED_STYLE} A 3D shield with a bold golden padlock centered on it. The shield has a metallic yellow (#facc15) gradient. Suggests security and secret protection. Photorealistic render. Background: dark navy. Accent: #facc15 gold.`,
    b: `${SHARED_STYLE} A golden (#facc15) eye icon inside a security badge/shield shape, suggesting watchful secret detection. Neon glow style. The eye has a keyhole pupil. Background: dark navy. Accent: #facc15.`
  },
  'svg-to-png': {
    a: `${SHARED_STYLE} Two overlapping geometric shapes: left is an emerald (#10b981) vector pentagon outline (SVG), right is a solid filled circle (PNG), with a right-pointing glow arrow between them suggesting file conversion. Background: dark navy. Accent: #10b981.`,
    b: `${SHARED_STYLE} The text "SVG" morphing into "PNG" via a gradient warp effect going from emerald green (#10b981) vector style to solid filled style. 3D block letters, clean tech aesthetic. Background: dark navy. Accent: #10b981.`
  },
  'svg-toolkit': {
    a: `${SHARED_STYLE} A 3D vector bezier curve with control handles shown as small glowing teal (#2dd4bf) circles at the anchor points, suggesting SVG path editing. Clean geometric beauty. Background: dark navy. Accent: #2dd4bf teal.`,
    b: `${SHARED_STYLE} Abstract geometric SVG star shape that appears to be assembled from glowing teal (#2dd4bf) vector paths — some paths complete, others floating nearby. Suggests SVG tooling and manipulation. Background: dark navy.`
  },
  'workspace-watchdog': {
    a: `${SHARED_STYLE} A 3D orange (#f97316) dog silhouette (simple, abstract bulldog or terrier) in a guarding pose, glowing, with small file/code icons around it suggesting file watching. Background: dark navy. Accent: #f97316 vibrant orange.`,
    b: `${SHARED_STYLE} A glowing orange (#f97316) eye with a magnifying glass overlay, suggesting watchful monitoring and observation of workspace files. Clean neon style. Background: dark navy. Accent: #f97316 orange.`
  }
};

// ---------------------------------------------------------------------------
// Replicate API Helpers
// ---------------------------------------------------------------------------

function replicateRequest(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://api.replicate.com/v1${urlPath}`);
    const payload = body ? JSON.stringify(body) : null;

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait',           // Wait for result inline (up to 60s)
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`Replicate HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
          } else {
            resolve(parsed);
          }
        } catch {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function generateIcon(prompt) {
  const result = await replicateRequest('POST', `/models/${MODEL}/predictions`, {
    input: {
      prompt,
      aspect_ratio: '1:1',
      style_type: 'Design',
      magic_prompt_option: 'Off',    // Use exact prompt, no AI rephrasing
      output_format: 'png',
      num_outputs: 1,
    }
  });

  // Poll if not immediately done
  let prediction = result;
  while (prediction.status !== 'succeeded' && prediction.status !== 'failed' && prediction.status !== 'canceled') {
    await sleep(2000);
    prediction = await replicateRequest('GET', `/predictions/${prediction.id}`);
  }

  if (prediction.status !== 'succeeded') {
    throw new Error(`Generation failed: ${prediction.error}`);
  }

  const output = prediction.output;
  const url = Array.isArray(output) ? output[0] : output;
  if (!url) throw new Error('No output URL returned');
  return typeof url === 'function' ? url().toString() : url.toString();
}

async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const protocol = url.startsWith('https') ? require('https') : require('http');
    protocol.get(url, res => {
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', err => { fs.unlink(destPath, () => {}); reject(err); });
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!REPLICATE_API_TOKEN) {
    console.error('❌ Missing REPLICATE_API_TOKEN environment variable.\n   Set it with: $env:REPLICATE_API_TOKEN = "r8_xxx"');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const extArg  = args.includes('--extension') ? args[args.indexOf('--extension') + 1] : null;
  const optArg  = args.includes('--option')    ? args[args.indexOf('--option') + 1]    : null; // 'a' or 'b'

  const extensions = extArg ? [extArg] : Object.keys(ICONS);
  const options     = optArg ? [optArg] : ['a', 'b'];

  console.log(`\n🎨 Generating icons for ${extensions.length} extension(s), ${options.length} option(s) each...\n`);

  let done = 0, failed = 0;

  for (const ext of extensions) {
    if (!ICONS[ext]) {
      console.warn(`⚠️  Unknown extension: ${ext} — skipping`);
      continue;
    }

    const outDir = path.join(BASE_OUT, ext);
    fs.mkdirSync(outDir, { recursive: true });

    for (const opt of options) {
      const prompt = ICONS[ext][opt];
      const outPath = path.join(outDir, `option-${opt}.png`);

      process.stdout.write(`  ⏳ ${ext}/option-${opt}...`);
      try {
        const url = await generateIcon(prompt);
        await downloadFile(url, outPath);
        process.stdout.write(` ✅\n`);
        done++;
      } catch (err) {
        process.stdout.write(` ❌ ${err.message}\n`);
        failed++;
      }
    }
  }

  console.log(`\n📦 Done. ${done} generated, ${failed} failed.`);
  console.log(`📁 Output: assets/icon-options/`);
  console.log(`\nNext steps:`);
  console.log(`  1. Review options in assets/icon-options/`);
  console.log(`  2. Copy chosen icon to extensions/<name>/assets/icon.png`);
  console.log(`  3. Add "icon": "assets/icon.png" to each package.json`);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});

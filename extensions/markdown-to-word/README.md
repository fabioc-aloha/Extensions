# Markdown to Word

**Convert Markdown + Mermaid diagrams to professional Word (.docx) via Pandoc**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)

Right-click any `.md` file → **Convert to Word**. Outputs a `.docx` alongside your Markdown file. Supports custom reference docs for house styles.

## Requirements

- [Pandoc](https://pandoc.org/installing.html) must be installed

## Commands

| Command | Description |
|---|---|
| `Markdown to Word: Convert Current File` | Convert active .md to .docx |
| `Markdown to Word: Convert With Options` | Choose output path |
| `Markdown to Word: Check Pandoc Installation` | Verify pandoc is available |

## Settings

| Setting | Default | Description |
|---|---|---|
| `markdownToWord.pandocPath` | `pandoc` | Path to pandoc |
| `markdownToWord.referenceDoc` | `` | Custom .docx style template |

## Source

Extracted from Alex md-to-word skill. License: MIT

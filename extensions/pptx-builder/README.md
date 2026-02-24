# PPTX Builder

![PPTX Builder Banner](assets/banner.png)

**Convert Markdown to PowerPoint — each `##` heading becomes a slide**

[![VS Code](https://img.shields.io/badge/VS%20Code-1.109%2B-blue)](https://code.visualstudio.com/)

Powered by [pptxgenjs](https://gitbrent.github.io/PptxGenJS/). Write your presentation as Markdown, export as `.pptx`. Speaker notes supported via `<!--notes: ... -->` comments.

## Slide Format

```markdown
## Slide Title

Your content here. Bullet lists, paragraphs, all supported.

<!--notes: These become speaker notes -->
```

## Commands

| Command | Description |
|---|---|
| `PPTX Builder: Create Presentation from Markdown` | Convert active .md to .pptx |
| `PPTX Builder: New Presentation Template` | Create a starter presentation.md |
| `PPTX Builder: Preview Slide Structure` | List all slides in output channel |
| `PPTX Builder: Open pptxgenjs Docs` | Open documentation |

## Requirements

`pptxgenjs` npm package (installed automatically as extension dependency).

## License

MIT

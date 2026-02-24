# Changelog — Knowledge Decay Tracker

## [0.1.0] — 2026-02-24

### Added
- Initial release
- `Knowledge Decay: Show Dashboard` — view all tracked topics and their decay status
- `Knowledge Decay: Track New Topic` — register a topic with a review interval
- `Knowledge Decay: Mark as Reviewed` — reset the decay clock for a topic
- `Knowledge Decay: Set Reminder` — schedule a VS Code notification for a topic
- Decay scoring algorithm (exponential decay based on last-review date)
- Status bar indicator showing count of overdue topics
- Topics persisted in workspace storage across sessions

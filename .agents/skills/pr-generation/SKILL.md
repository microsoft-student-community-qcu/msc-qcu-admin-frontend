---
name: pr-generation
description: Use this skill to generate a detailed Pull Request (PR) summary and write it to the .pr/ directory when a task is completed.
---

# Pull Request (PR) Generation Workflow

When you complete a task or a set of changes that are ready to be reviewed by the user for a PR, you MUST follow this workflow:

1. Always generate a full, detailed summary of the changes you made.
2. Write this summary to a local file (e.g., `docs/pr/pr_changes.md`). Create the `docs/pr/` directory if it does not exist.
3. This file will be used by the human developer to copy-paste into their GitHub Pull Request comment, so format it nicely with markdown lists, bold text for file names, and a brief explanation of *why* the changes were made.

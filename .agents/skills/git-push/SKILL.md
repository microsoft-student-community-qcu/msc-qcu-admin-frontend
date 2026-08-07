---
name: git-push
description: Use this skill to automatically stage, commit, and push all code changes to the repository with a highly detailed, conventional commit message.
---

# Git Push Workflow

This skill is designed to handle committing and pushing code to the remote repository. 
**DO NOT trigger this automatically.** You must only run this skill when the user explicitly calls for it (e.g., "run the git-push workflow", "push the code", or "@git-push").

## Workflow Steps

1. **Analyze Changes**:
   - Run `git status` and `git diff` (if necessary) to analyze exactly what has been modified, added, or deleted across the workspace.
2. **Stage Files**:
   - Run `git add .` to stage all changes.
3. **Generate Commit Message**:
   - Generate a highly detailed commit message following the Conventional Commits format (`feat:`, `fix:`, `docs:`, `refactor:`, etc.).
   - The body of the commit message MUST include a detailed bulleted list of the specific changes made. 
   - *Example:* "Fixed skeleton loader flash on uncached tabs by extracting isFetching from TanStack Query."
4. **Commit**:
   - Run `git commit -m "<message>"` (ensure the message is properly escaped for the command line, or write it to a temporary file and use `git commit -F <file>`).
5. **Push**:
   - Run `git push`.
6. **Report**:
   - Confirm to the user that the code has been successfully pushed and display the exact commit message that was used.

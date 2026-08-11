---
name: backend-issue
description: Use when a bug fix or feature request cannot be completed in the frontend alone and requires changes to the backend API or database
---

# Backend Issue Generation Workflow

If a fix or a new feature requires backend changes (e.g., adding a new field to a database, creating a new endpoint, modifying an existing API response), you must NOT attempt to fix it in this frontend repository. Instead, follow this workflow:

1. Create a detailed Markdown file (`.md`) inside the `issues/` directory in the root of the frontend project (create the directory if it doesn't exist).
2. Name the file descriptively (e.g., `issues/backend-update-applicant-schema.md`).
3. The file MUST contain the following detailed sections:
   - **What to Fix / Implement:** A clear description of the backend requirement.
   - **Reasoning:** Why the frontend needs this change.
   - **Expected Behavior / Output:** Exactly how the API should behave (e.g., status codes, validation rules).
   - **Expected API Response Schema:** A JSON code block showing the exact payload the frontend expects to receive.

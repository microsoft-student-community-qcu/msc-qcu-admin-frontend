---
name: document-codebase
description: Use when asked to document the codebase, a feature, or architecture for future developers
---

# Codebase Documentation Workflow

Use this skill when requested to document the codebase, a specific feature, or the overall architecture. 

## Workflow Steps

1. **Analyze the Target Area**:
   - Run directory analysis to understand the file structure.
   - Review key files (components, hooks, state stores, services) to grasp the business logic, state management, and API integrations.

2. **Determine the Document Location**:
   - **Architecture & Infrastructure**: Place in `docs/architecture/` (e.g., state-management, routing, file-structure).
   - **Features & Vertical Slices**: Place in `docs/features/` (e.g., hr-pipeline, members-directory).
   - **UI & Component Guidelines**: Place in `docs/components/`.
   - **API & Data Fetching**: Place in `docs/api-integration/`.
   - **Global Overview**: Update or create `docs/README.md`.

3. **Format the Documentation**:
   - Use strict Markdown formatting with clear hierarchy (H1, H2, H3).
   - Use **Mermaid diagrams** (if possible) to visualize component trees, state flows, or complex data pipelines.
   - Explain *why* certain patterns are used (e.g., why Zustand is used for a specific state, how TanStack Query handles caching).
   - Include brief code snippets to demonstrate usage patterns for other developers.

4. **Verify Detail Level**:
   - The documentation MUST be detailed enough that a new developer joining the project can read it and immediately understand how to contribute to that specific area without needing to reverse-engineer the code.

5. **Generate**:
   - Write the final markdown file to the designated `docs/` subfolder.

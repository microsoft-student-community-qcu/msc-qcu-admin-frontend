---
name: backend-docs
description: Use when integrating APIs, fetching data, or modifying frontend data schemas that interact with the server
---

# Backend Documentation Workflow

Whenever you are integrating APIs, creating new frontend services, or modifying data schemas that interact with the server, you MUST consult the backend documentation first.

1. **Locate the Docs:** The detailed, versioned API documentation is located in the companion backend repository: `e:\Github\qcu-msc-central-portal-backend\docs\api\`.
2. **Review Before Coding:** Always read the corresponding `.md` file for the endpoint you are working on to understand the exact payload structures, authorization requirements, and status codes.
3. **Align Types:** Ensure the Zod validation schemas and TypeScript interfaces you create in the frontend perfectly match the data models described in the backend docs.

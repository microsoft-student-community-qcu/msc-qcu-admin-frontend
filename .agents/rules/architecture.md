# Architectural Guard Rule

This rule prevents feature-specific code from polluting global directories.

- **The Hard Gate:** You are strictly forbidden from placing any feature-specific API calls, custom hooks, business logic, or type interfaces into global directories (`src/services`, `src/types`, `src/hooks`, `src/utils`) unless they are genuinely used by multiple distinct domains.
- **Skill Requirement:** Before creating a new file, you MUST invoke and read the `feature-architect` skill (`.agents/skills/feature-architect/SKILL.md`) to determine its correct routing.
- If a feature only belongs to the `hr` domain, all of its shared components, services, and types MUST live entirely within `src/features/hr/...`.

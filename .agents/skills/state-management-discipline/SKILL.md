---
name: state-management-discipline
description: Use when adding state to a component, mutating data, handling forms, or deciding between Zustand, React Query, and local state
---

# State Management Discipline

Admin portals are highly data-driven. The most common source of bugs and technical debt in this codebase is confusing **Server State** (data from the API) with **Client State** (UI state). This skill enforces strict boundaries between them.

## The Prime Directive

**Never duplicate Server State into Client State.**

If data comes from the backend, it belongs to TanStack Query. If it's a UI toggle (like a sidebar) that exists only in the browser, it belongs to `useState` or `Zustand`.

## Core Patterns

### ❌ The Anti-Pattern (Syncing State)

Never use `useEffect` to copy API data into local state.

```tsx
const { data } = useQuery(...);
const [applicants, setApplicants] = useState([]);

// 🚩 RED FLAG: Duplicating state!
useEffect(() => {
  if (data) setApplicants(data);
}, [data]);
```

### ✅ The Correct Pattern (Derived State & Mutations)

Rely on the TanStack Query cache. For forms, pass the initial data directly to the form default values. For updates, use Mutations with Cache Invalidation.

```tsx
const { data } = useSuspenseQuery(...);
const mutation = useMutation({
  mutationFn: updateApplicant,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['applicants'] });
  }
});
```

## Where does state go? Decision Tree

1. **Does this data live on the server? (e.g., Applicants, Users, Events)**
   - 👉 Use **TanStack Query** (`useSuspenseQuery`, `useMutation`).
2. **Is this state URL-driven? (e.g., search queries, pagination, data-table filters)**
   - 👉 Use **TanStack Router Search Params**. (Never use `useState` for filters!).
3. **Is this state strictly for a controlled form input before submission?**
   - 👉 Use local `useState` or a form library (e.g., React Hook Form).
4. **Is this state UI-only AND needs to be accessed globally? (e.g., Sidebar Toggle)**
   - 👉 Use **Zustand** (`src/store/`).

## Common Rationalizations & Reality

| Excuse                                                                   | Reality                                                                                           |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| "I need to edit the data before saving, so I must put it in useState."   | Initialize a form with the cache data as default values. Don't sync the whole API array to state. |
| "I'll put the applicants list in Zustand so I don't have to prop-drill." | TanStack Query acts as a global cache. Just call `useSuspenseQuery` again in the child component. |
| "I need to filter the table, I'll use useState for the search query."    | Admin portal filters must be shareable and persistent via URL. Use TanStack Router.               |

## Red Flags - STOP and Refactor

- `useEffect` containing `setState` based on query `data`.
- A Zustand store containing arrays of business entities (e.g., `applicants: []` or `events: []`).
- Passing API data down 4 levels of props when the child could just call `useSuspenseQuery`.
- Using `useState` for pagination numbers or search inputs on a data table.

**All of these mean: Stop. Delete the state and use the correct tool.**

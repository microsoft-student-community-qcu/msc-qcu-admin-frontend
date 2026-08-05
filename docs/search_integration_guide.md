# Search Integration Guide: Frontend Behavior & Backend Action Items

This document describes how the frontend search parameters are now structured and outlines the exact changes the backend team needs to implement to make the search database-wide and performant.

---

## 1. Current Frontend Behavior

The frontend has been updated to treat the search string as an active API filter. This is backward-compatible but currently runs on a client-side fallback until the backend changes are completed.

### A. Debounced Requests
To prevent hitting the server on every keystroke, the frontend debounces search inputs by `300ms`. When a user types, the API request is delayed until they pause.

### B. Outgoing API Requests
When a search query is active, the frontend appends a `search` query parameter to the `GET /api/v1/applicants` request:
```http
GET /api/v1/applicants?status=APPROVED&limit=50&offset=0&search=john
```
*   If the search bar is empty, the `search` parameter is omitted from the URL.

### C. The Current Cascade Workaround (And why we must fix it)
Because the backend currently ignores the `search` parameter, it returns the unfiltered first 50 results. The frontend then filters these 50 items client-side.
If no matches are found in those 50 items, the infinite scroll observer sees that the list is empty (and thus the bottom sentinel is visible), which automatically triggers another request for Page 2, Page 3, and so on.

While this cascade successfully loads and searches the entire database for small test environments, **it will crash the browser and overload the database under production scale**.

---

## 2. Backend Action Items (Required Changes)

To optimize this, the backend needs to read the incoming `search` parameter and apply it directly inside the database query.

### File to Modify
*   `src/controllers/applicant.controller.ts` (in the `listApplicants` handler)

### Steps to Implement

1.  **Extract the `search` query parameter** from `req.query`:
    ```typescript
    const {
      status,
      campus,
      gender,
      manual_application,
      limit = "50",
      offset = "0",
      search, // <-- Add this
    } = req.query as Record<string, string>;
    ```

2.  **Add a case-insensitive Prisma filter** to the `where` block:
    ```typescript
    const where: any = {};

    if (search) {
      const searchTrimmed = search.trim();
      if (searchTrimmed) {
        where.OR = [
          { firstName: { contains: searchTrimmed, mode: "insensitive" } },
          { lastName: { contains: searchTrimmed, mode: "insensitive" } },
          { email: { contains: searchTrimmed, mode: "insensitive" } },
          { studentId: { contains: searchTrimmed, mode: "insensitive" } },
        ];
      }
    }
    ```

3.  **Ensure total count matches the search**:
    The backend uses `Promise.all` to fetch the count and rows. Ensure the updated `where` block is used in both:
    ```typescript
    const [total, applicants] = await Promise.all([
      prisma.applicant.count({ where }), // Returns total count matching search
      prisma.applicant.findMany({
        where, // Returns paginated slice matching search
        skip: parseInt(offset, 10),
        take: parseInt(limit, 10),
        orderBy: { createdAt: "desc" },
      }),
    ]);
    ```

---

## 3. Results of the Integration

Once the backend implements the steps above:
*   When a search is active, the backend will return only the matching records.
*   The matching records will immediately render on the screen.
*   Because the results fit on the screen, the infinite scroll sentinel will not be exposed, preventing any unnecessary network requests or database load.
*   The search will be instant, fully database-wide, and scale-proof.

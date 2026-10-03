---
name: Feedback gallery cache revalidation
description: Why the public feedback list must bypass browser revalidation when using the shared generated fetch client.
---

The browser can revalidate `GET /api/public/feedback` to a `304 Not Modified`. The shared `customFetch` wrapper checks `response.ok` and rejects a bare 304, leaving the gallery in its loading/retry state instead of consuming the updated list.

**Why:** The gallery remained on skeleton cards after new feedback entries were saved. Setting the generated query's request cache mode to `no-store` changed the browser request to a `200` with the current list.

**How to apply:** Keep `request: { cache: "no-store" }` on the generated public feedback query. Do not assume this client transparently restores a cached response body after a 304.
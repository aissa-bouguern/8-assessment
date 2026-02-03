# iTunes Search Application - Development Notes

## Preview URL

[https://8-assessment.vercel.app](https://8-assessment.vercel.app/?q=%D9%81%D9%86%D8%AC%D8%A7%D9%86)

## Tech Stack

| Layer           | Technology                             |
| --------------- | -------------------------------------- |
| Framework       | Next.js 16.1.6 (App Router, Turbopack) |
| Language        | TypeScript 5.9                         |
| Database        | PostgreSQL (Supabase)                  |
| ORM             | Prisma 5.22                            |
| Styling         | Tailwind CSS 4.1                       |
| Package Manager | pnpm                                   |

---

## Why Next.js API Routes Instead of a Separate Backend?

For this project, we chose **Next.js API Routes** over a separate backend framework like Nest.js. Here's the rationale:

### 1. Simplified Architecture

| Aspect       | Next.js API Routes        | Separate Backend (Nest.js)   |
| ------------ | ------------------------- | ---------------------------- |
| Deployment   | Single deployment         | Two deployments              |
| Repository   | Monorepo                  | Mono or multi-repo           |
| Shared types | Native TypeScript sharing | Requires package/duplication |
| CORS         | Not needed (same origin)  | Configuration required       |

### 2. Project Scope Alignment

This is a **search application** with straightforward requirements:

- One API endpoint (`/api/search`)
- Simple CRUD operations (upsert media items)
- No complex business logic or microservices

A full backend framework would be **over-engineering** for this scope.

### 3. Performance Benefits

```
Traditional Setup:
Browser → Next.js (SSR) → Nest.js API → Database
         ↑_______________↓
           Network hop

Next.js API Routes:
Browser → Next.js (SSR + API) → Database
           No extra hop
```

- **Reduced latency**: No additional network hop between frontend and backend
- **Shared connection pool**: Prisma client reused across SSR and API
- **Edge-ready**: Can deploy API routes to edge functions if needed

### 4. Developer Experience

- **Single `pnpm dev`** starts everything
- **Hot reload** for both frontend and API
- **Unified error handling** and logging
- **Type safety** across the entire stack without extra tooling

---

## Architecture Overview

```
src/
├── app/
│   ├── api/search/route.ts   # Search API endpoint
│   ├── page.tsx              # Main page with Suspense boundary
│   └── layout.tsx            # Root layout
├── components/               # UI components
├── lib/
│   ├── itunes.ts             # iTunes API client & normalization
│   ├── prisma.ts             # Prisma client singleton
│   └── utils.ts              # Utility functions
└── types/                    # TypeScript definitions
```

---

## Key Implementation Details

### 1. Search API Flow

```
User Search → Check Cache → [HIT] → Return cached results
                    ↓
                  [MISS]
                    ↓
            Fetch iTunes API
                    ↓
            Normalize results
                    ↓
            Batch upsert to DB (raw SQL)
                    ↓
            Cache results → Return response
```

### 2. Database Schema

```prisma
model MediaItem {
  id               Int       @id @default(autoincrement())
  trackId          Int       @unique
  trackName        String
  artistName       String
  artworkUrl       String?
  collectionName   String?
  kind             String
  trackPrice       Float?
  currency         String?
  primaryGenreName String?
  trackViewUrl     String?
  previewUrl       String?
  releaseDate      DateTime?
  searchTerm       String
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  @@index([searchTerm])
  @@index([trackName])
  @@index([kind])
}
```

---

## Challenges & Solutions

### Challenge 1: N+1 Database Queries

**Problem**: Initial implementation used individual `prisma.mediaItem.upsert()` calls for each result (50 items = 50 queries).

**Attempted Solutions**:

| Approach                                     | Result                                     |
| -------------------------------------------- | ------------------------------------------ |
| `Promise.all()` with parallel upserts        | Connection pool exhaustion                 |
| `prisma.$transaction()` with batched upserts | Still slow (sequential within transaction) |
| Batched transactions (chunks of 5)           | Better, but still too slow                 |
| **Raw SQL with `UNNEST`**                    | ✅ Optimal (2 queries total)               |

**Final Solution**:

```typescript
await prisma.$executeRaw`
  INSERT INTO "MediaItem" (...)
  SELECT * FROM UNNEST(
    ${trackIds}::int[],
    ${trackNames}::text[],
    ...
  )
  ON CONFLICT ("trackId") DO UPDATE SET
    "trackName" = EXCLUDED."trackName",
    ...
`;
```

- `UNNEST`: Converts arrays into rows for bulk insert
- `ON CONFLICT ... DO UPDATE`: Upsert semantics (insert or update)

---

### Challenge 2: Connection Pool Exhaustion

**Problem**:

```
Timed out fetching a new connection from the connection pool.
(connection limit: 5)
```

**Cause**: Firing 50 parallel database queries exceeded the pool limit.

**Solution**: Raw SQL batch insert uses only 1 connection for all rows.

---

### Challenge 3: Next.js Caching Exploration

**Explored Options**:

| Method                              | Status                                                 |
| ----------------------------------- | ------------------------------------------------------ |
| Custom in-memory cache              | ✅ Implemented                                         |
| `unstable_cache`                    | Tested, works but verbose                              |
| `use cache` directive               | Requires `dynamicIO` flag, incompatible with DB writes |
| `fetch` with `next: { revalidate }` | Already used for iTunes API                            |

**Final Choice**: Simple in-memory `Map` with TTL (60 seconds).

```typescript
const cache = new Map<string, CacheEntry>();

function getCachedResults(term: string): MediaItem[] | null {
  const entry = cache.get(term.toLowerCase());
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(term.toLowerCase());
    return null;
  }
  return entry.data;
}
```

---

### Challenge 4: Loading Spinner Flash

**Problem**: Spinner appeared briefly even for fast cached responses, causing UI flicker.

**Solution**: Added configurable delay before showing spinner:

```tsx
export function LoadingSpinner({ delay = 300 }: LoadingSpinnerProps) {
  const [show, setShow] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) return;
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;
  // ... render spinner
}
```

---

## Performance Summary

| Metric                | Before    | After   |
| --------------------- | --------- | ------- |
| DB queries per search | 50+       | 2       |
| Cached response time  | N/A       | ~5ms    |
| Fresh search time     | ~2-3s     | ~500ms  |
| Connection pool usage | Exhausted | Minimal |

---

## Key Learnings

1. **Prisma limitations**: Native batch upsert not supported; raw SQL is necessary for optimal bulk operations
2. **PostgreSQL `UNNEST`**: Powerful for converting arrays to rows in a single query
3. **Next.js caching**: Multiple options exist (`unstable_cache`, `use cache`, fetch options), but simple in-memory cache works well for single-instance deployments
4. **Suspense boundaries**: Required for client components using `useSearchParams()` in Next.js App Router
5. **UX polish**: Delayed loading indicators prevent UI flicker for fast operations

# Cloudflare Workers Full-Stack Chat Demo

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ty8686/connectivity-canvas-network-transformation-visualizer)

A production-ready, full-stack chat application demonstrating Cloudflare Workers, Durable Objects for stateful storage, Hono routing, and a modern React frontend with shadcn/ui. Features users, chat boards, and real-time messaging with indexed listing, all powered by a single Durable Object class for multi-entity storage.

## ✨ Key Features

- **Serverless Backend**: Hono-based API routes with automatic hot-reloading of user-defined routes (`worker/user-routes.ts`).
- **Durable Objects Storage**: Efficient, multi-tenant storage using one DO class (`GlobalDurableObject`) for Users, ChatBoards, and indexes.
- **Indexed Entities**: Automatic listing, pagination, seeding, and batched CRUD operations for scalable data management.
- **Type-Safe Full-Stack**: Shared types (`shared/types.ts`), Tanstack Query integration, and strict TypeScript.
- **Modern UI**: shadcn/ui components, Tailwind CSS, dark mode, sidebar layout, and responsive design.
- **Real-World Chat**: Create users/chats, send messages, list with cursors/limits, delete operations.
- **Production-Ready**: Error handling, CORS, logging, client error reporting, and Cloudflare observability.

## 🛠️ Tech Stack

- **Backend**: Cloudflare Workers, Hono, Durable Objects, TypeScript
- **Frontend**: React 18, Vite, Tanstack Query, React Router, shadcn/ui, Tailwind CSS, Lucide Icons
- **State/UI**: Zustand, Framer Motion, Sonner (toasts), Headless UI
- **Utilities**: Immer, Zod, clsx, Tailwind Merge, Bun (package manager)
- **DevOps**: Wrangler, Cloudflare Vite Plugin, ESLint, TypeScript 5

## 🚀 Quick Start

1. **Install Dependencies** (requires Bun):
   ```bash
   bun install
   ```

2. **Run Development Server**:
   ```bash
   bun dev
   ```
   - Frontend: http://localhost:3000 (or `${PORT:-3000}`)
   - Backend API: http://localhost:8787/api/*

3. **Type Generation** (for Workers bindings):
   ```bash
   bun run cf-typegen
   ```

## 💻 Local Development

- **Frontend Changes**: Edit `src/` files; hot-reload via Vite.
- **Backend Routes**: Add/edit `worker/user-routes.ts`; auto-reloads on save (with fallback/retry logic).
- **Entities**: Extend `worker/entities.ts` using `IndexedEntity` base class from `worker/core-utils.ts`.
- **Shared Types**: Update `shared/types.ts` and `shared/mock-data.ts` for seeding.
- **Linting**:
  ```bash
  bun lint
  ```
- **Build for Preview**:
  ```bash
  bun build
  bun preview
  ```

### API Usage Examples

All endpoints under `/api/` return `{ success: boolean, data?: T, error?: string }`.

```bash
# List users (with pagination)
curl "http://localhost:8787/api/users?limit=10&cursor=abc"

# Create user
curl -X POST http://localhost:8787/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe"}'

# Create chat
curl -X POST http://localhost:8787/api/chats \
  -H "Content-Type: application/json" \
  -d '{"title": "My Chat"}'

# Send message
curl -X POST "http://localhost:8787/api/chats/c1/messages" \
  -H "Content-Type: application/json" \
  -d '{"userId": "u1", "text": "Hello!"}'
```

Frontend integrates via `api-client.ts` with Tanstack Query.

## ☁️ Deployment

Deploy to Cloudflare Workers/Pages with one command:

```bash
bun run deploy
```

Or manually:

1. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

2. **Deploy**:
   ```bash
   wrangler deploy
   ```

- Config: `wrangler.jsonc` (assets SPA handling, DO bindings/migrations).
- Custom Domain: Update `wrangler.jsonc` or use `wrangler deploy --name your-name`.
- Preview: `wrangler deploy --name preview-your-name`.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ty8686/connectivity-canvas-network-transformation-visualizer)

## 🤝 Contributing

1. Fork and clone the repo.
2. Install with Bun: `bun install`.
3. Make changes in `src/` (UI), `worker/user-routes.ts` (API), or `worker/entities.ts` (data models).
4. Test locally: `bun dev`.
5. PR with clear description.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Durable Objects Guide](https://developers.cloudflare.com/durable-objects/)
- File issues or questions in this repo.

Built with ❤️ by Cloudflare Templates.
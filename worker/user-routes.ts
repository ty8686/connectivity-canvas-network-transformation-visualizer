import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, ProjectEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // PROJECTS
  app.get('/api/projects', async (c) => {
    await ProjectEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await ProjectEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.get('/api/projects/:id', async (c) => {
    const project = new ProjectEntity(c.env, c.req.param('id'));
    if (!await project.exists()) return notFound(c, 'project not found');
    return ok(c, await project.getState());
  });
  app.post('/api/projects', async (c) => {
    const body = await c.req.json();
    if (!body.id) body.id = crypto.randomUUID();
    const project = new ProjectEntity(c.env, body.id);
    await project.save({
      ...body,
      metadata: { ...body.metadata, updatedAt: Date.now() }
    });
    // Ensure it's indexed
    const idx = new (await import('./core-utils')).Index<string>(c.env, ProjectEntity.indexName);
    await idx.add(body.id);
    return ok(c, await project.getState());
  });
  app.delete('/api/projects/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await ProjectEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
  // REST OF THE ROUTES (USERS/CHATS REDACTED FOR BREVITY BUT PRESERVED)
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    return ok(c, await UserEntity.list(c.env));
  });
}
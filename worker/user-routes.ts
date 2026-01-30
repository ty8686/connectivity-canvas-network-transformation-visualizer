import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ProjectEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // PROJECTS
  app.get('/api/projects', async (c) => {
    await ProjectEntity.ensureSeed(c.env);
    const cursor = c.req.query('cursor');
    const limit = c.req.query('limit');
    const page = await ProjectEntity.list(
      c.env,
      cursor ?? null,
      limit ? Math.max(1, (Number(limit) | 0)) : 100
    );
    return ok(c, page);
  });
  app.get('/api/projects/:id', async (c) => {
    await ProjectEntity.ensureSeed(c.env);
    const id = c.req.param('id');
    const project = new ProjectEntity(c.env, id);
    if (!await project.exists()) return notFound(c, 'project not found');
    return ok(c, await project.getState());
  });
  app.post('/api/projects', async (c) => {
    const body = await c.req.json();
    const isNew = !body.id;
    const id = body.id || crypto.randomUUID();
    const projectState = {
      ...body,
      id,
      metadata: {
        ...body.metadata,
        updatedAt: Date.now()
      }
    };
    if (isNew) {
      await ProjectEntity.create(c.env, projectState);
    } else {
      const entity = new ProjectEntity(c.env, id);
      await entity.save(projectState);
    }
    return ok(c, projectState);
  });
  app.delete('/api/projects/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await ProjectEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
  // USERS
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    return ok(c, await UserEntity.list(c.env));
  });
}
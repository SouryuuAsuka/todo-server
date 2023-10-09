import { Pool } from 'pg';

export default class PrizeRepository {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async get(): Promise<any[]> {
    const queryString = `
      SELECT 
      project_id AS "projectId"
      , owner
      , name
      , created
      , emoji
      FROM todo_projects
      ORDER BY created DESC`
    const { rows } = await this.pool.query(queryString, []);
    return rows;
  }
  async getById(project_id: number): Promise<any[]> {
    console.log("project_id - " + project_id);
    const queryString = `
      SELECT 
      p.project_id AS project_id
      , p.owner
      , p.name
      , p.created
      , p.emoji
      , json_agg( 
        json_build_object(
          'task_id', t.task_id, 
          'name', t.name, 
          'about',  t.about, 
          'priority',  t.priority, 
          'status', t.status, 
          'project_id', t.project_id, 
          'created', t.created, 
          'finished', t.finished, 
          'files', t.files, 
          'subtasks', t.subtasks, 
          'creator', t.creator,
          'comments', (
            SELECT 
            json_agg( 
              json_build_object(
                  c.comment_id
                , c.text
                , c.user_id
                , u.username
                , u.avatar
                , c.root_comment
                , c.created
              )
            )
            FROM todo_comments AS c
            JOIN todo_users AS u
            ON c.user_id = u.user_id
            WHERE c.task_id = t.task_id
            ORDER BY c.created DESC
          )
        )
      ) AS tasks
      FROM todo_projects AS p
      LEFT JOIN todo_tasks AS t
      ON p.project_id = t.project_id
      WHERE p.project_id = $1
      GROUP BY p.project_id, p.owner, p.name, p.created, p.emoji`
    const { rows } = await this.pool.query(queryString, [project_id]);
    return rows;
  }
  async create(user_id: number, name: string, emoji: string): Promise<any[]> {
    const queryString = `
      INSERT INTO todo_projects (owner, name, emoji, created)
      VALUES ($1, $2, $3, $4)
      RETURNING 
      project_id AS "project_id"
      , owner
      , name
      , emoji
      , created`;
    const { rows } = await this.pool.query(queryString, [user_id, name, emoji, "NOW()"]);
    return rows;
  }
  async edit(project_id: number, name: string, emoji: string): Promise<any[]> {
    const queryString = `
      UPDATE todo_projects 
      SET 
      name = $1
      , emoji = $2
      , last_modified = $3
      WHERE project_id = $4
      RETURNING 
      project_id
      , owner
      , name
      , emoji
      , created
      , last_modified`;
    const { rows } = await this.pool.query(queryString, [name, emoji, "NOW()", project_id]);
    return rows;
  }
}
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
          'creator_id', t.creator,
          'creator_name', u.username,
          'creator_avatar', u.avatar,
          'last_update', t.last_update,
          'comments', (
            SELECT 
            json_agg( 
              json_build_object(
                'comment_id', c.comment_id
                , 'text, c.text
                , 'user_id, c.user_id
                , 'username', us.username
                , 'user_id', us.user_id
                , 'avatar', us.avatar
                , 'root_comment', c.root_comment
                , 'created', c.created
              )
            )
            FROM todo_comments AS c
            JOIN todo_users AS us
            ON c.user_id = us.user_id
            WHERE c.task_id = t.task_id
          )
        )
      ) AS tasks
      FROM todo_projects AS p
      LEFT JOIN todo_tasks AS t
      ON p.project_id = t.project_id
      LEFT JOIN todo_users AS u
      ON t.creator = u.user_id
      WHERE p.project_id = $1
      GROUP BY p.project_id, p.owner, p.name, p.created, p.emoji`
    const { rows } = await this.pool.query(queryString, [project_id]);
    console.log("project_id 2 - " + project_id);
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
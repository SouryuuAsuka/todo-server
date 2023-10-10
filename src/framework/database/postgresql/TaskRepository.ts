import { Task } from '@domain/interfaces';
import { Pool } from 'pg';

export default class TaskRepository {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }
  async get( taskId: number) {
    const queryString = `
    SELECT
    t.task_id
    , t.name
    , t.about
    , t.priority
    , t.status
    , t.project_id
    , t.created
    , t.finished
    , t.files
    , t.subtasks
    , t.creator AS creator_id
    , u.username AS creator_name
    , u.avatar AS creator_avatar
    , t.last_update
    , ( 
      SELECT json_agg( 
      json_build_object(
        'comment_id', c.comment_id
        , 'text', c.text
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
    ) AS comments
    FROM todo_tasks AS t
    LEFT JOIN todo_users AS u
    ON t.creator = u.user_id
    WHERE t.task_id = $1`;
    const { rows } = await this.pool.query(queryString, [taskId]);
    return rows;
  }
  async create(projectId: number, userId: number, task: Task): Promise<boolean> {
    const queryString = `
      INSERT INTO todo_tasks
      (name, about, priority, project_id, created, creator)
      VALUES ($1, $2, $3, $4, $5, $6)`;
    const { rowCount } = await this.pool.query(queryString,
      [task.name, task.about, task.priority, projectId, 'NOW()', userId]);
    if (rowCount == 0) throw new Error("Ошибка при сохранении результата");
    return true;
  }

  async edit(taskId: number, projectId: number, task: Task): Promise<boolean> {
    const queryString = `
      UPDATE todo_tasks
      SET name = $1
      , about = $2
      , priority = $3
      , status = $4
      , project_id = $5
      , finished = $6
      , files = $7
      , subtasks = $8
      , last_update = $9
      WHERE task_id = $10`;
    const { rowCount } = await this.pool.query(queryString,
      [task.name, task.about, task.priority, task.status, projectId, task.finished, task.files, task.subtasks, "NOW()", taskId]);
    if (rowCount == 0) throw new Error("Ошибка при обновлении задачи");
    return true;
  }
}
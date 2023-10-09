import { Task } from '@domain/interfaces';
import { Pool } from 'pg';

export default class TaskRepository {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
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

  async edit(taskId: number, projectId: number, task: Task): Promise<any[]> {
    const queryString = `
      UPDATE todo_tasks
      SET
      name = $1
      , about = $2
      , priority = $3
      , status = $4
      , project_id = $5
      , finished = $6
      , files = $7
      , subtasks = $8
      WHERE task_id = $9
      ORDER BY created DESC `;
    const { rows } = await this.pool.query(queryString,
      [task.name, task.about, task.priority, task.status, projectId, task.files, task.subtasks, taskId]);
    return rows;
  }
}
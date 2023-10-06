import { Pool } from 'pg';

export default class CommentRepository {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }
  async create(taskId: number, userId: number, text: string, rootComment:number|null): Promise<boolean> {
    const queryString = `
      INSERT INTO todo_comments
      (text, user_id, task_id, root_comment, created)
      VALUES ($1, $2, $3, $4, $5)`;
    const { rowCount } = await this.pool.query(queryString,
      [text, userId, taskId, rootComment, 'NOW()']);
    if (rowCount == 0) throw new Error("Ошибка при сохранении результата");
    return true;
  }

  async get(taskId: number): Promise<any[]> {
    const queryString = `
      SELECT *
      FROM todo_comments
      WHERE task_id = $1
      ORDER BY created DESC`;
    const { rows } = await this.pool.query(queryString, [taskId]);
    return rows;
  }
}
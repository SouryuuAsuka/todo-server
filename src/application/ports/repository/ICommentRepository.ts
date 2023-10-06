
export interface ICommentRepository {
  create(taskId: number, userId: number, text: string, rootComment:number|null): Promise<boolean>;
  get(taskId: number): Promise<any[]>;
}
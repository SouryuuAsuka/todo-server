import { Task } from "@domain/interfaces";

export interface ITaskRepository {
  get( taskId: number):Promise<any[]>
  create(projectId: number, userId: number, task: Task): Promise<boolean>;
  edit(taskId: number, projectId: number, task: Task): Promise<boolean>;
}
import { Task } from "@domain/interfaces";

export interface ITaskRepository {
  create(projectId: number, userId: number, task: Task): Promise<boolean>;
  edit(taskId: number, projectId: number, task: Task): Promise<any[]>;
}
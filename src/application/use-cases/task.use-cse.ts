import { ITaskRepository } from "@application/ports/repository";
import { Task } from "@domain/interfaces";

const taskUseCase = (taskRepository: ITaskRepository) => {

  const createTask = async (projectId: number, userId: number, task: Task) => {
    const tasks = await taskRepository.create(projectId, userId, task);
    return true
  }
  const editTask = async (taskId: number, projectId: number, task: Task) => {
    const tasks = await taskRepository.edit(taskId, projectId, task);
    return { task: tasks[0] }
  }
  const getTask = async (taskId: number) => {
    const tasks = await taskRepository.get(taskId);
    return { task: tasks[0] }
  }
  return {
    createTask,
    editTask,
    getTask
  }
}

export default taskUseCase;
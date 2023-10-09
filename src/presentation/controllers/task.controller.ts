import { IDependency } from '@application/ports/IDependency';
import taskUseCase from '@application/use-cases/task.use-cse';
import { Task } from '@domain/interfaces';
const taskControllerCreate = (dependencies: IDependency) => {
  const { taskRepository, projectRepository, userRepository } = dependencies.DatabaseService;
  const {
    createTask,
    editTask,
  } = taskUseCase(taskRepository);
  const createController = async (req: any, res: any, next: any) => {
    try {
      const task: Task = req.body?.task;
      const userId = Number(res.locals?.userId);
      const projectId = Number(req.params?.projectId);
      if (!task) throw new Error('Task is undefined');
      await createTask(projectId, userId, task);
      return res.status(200).json({
        status: 'success',
        data:{}
      })
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message ?? "Server error"
      })
    }
  }
  const editController = async (req: any, res: any, next: any) => {
    try {
      const task: Task = req.body?.task;
      const projectId = Number(req.params?.projectId);
      const taskId = Number(req.params?.taskId);
      if (!task) throw new Error('Task is undefined');
      const data = await editTask(taskId, projectId, task);
      return res.status(200).json({
        status: 'success',
        data,
      })
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message ?? "Server error"
      })
    }
  }
  return {
    createController,
    editController,
  }
}

export default taskControllerCreate;
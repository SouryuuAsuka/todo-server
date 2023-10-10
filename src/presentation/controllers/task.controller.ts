import { IDependency } from '@application/ports/IDependency';
import taskUseCase from '@application/use-cases/task.use-cse';
import { Task } from '@domain/interfaces';
const taskControllerCreate = (dependencies: IDependency) => {
  const { taskRepository, projectRepository, userRepository } = dependencies.DatabaseService;
  const {
    getTask,
    createTask,
    editTask,
  } = taskUseCase(taskRepository);
    const getByIdController = async (req: any, res: any, next: any) => {
    try {
      const taskId = req.params.taskId;
      const task = await getTask(taskId);
      return res.status(200).json({
        status: 'success',
        data: {
          task
        },
      })
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message ?? "Server error"
      })
    }
  }
  const createController = async (req: any, res: any, next: any) => {
    try {
      if (!res.locals.isAuth) {
        throw new Error('Пользователь не найден')
      }
      const task: Task = req.body?.task;
      const userId = Number(res.locals.userId);
      const projectId = Number(req.params.projectId);
      console.log( "userId = " + res.locals?.userId + " ; projectId = "+ req.params?.projectId)
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
    getByIdController
  }
}

export default taskControllerCreate;
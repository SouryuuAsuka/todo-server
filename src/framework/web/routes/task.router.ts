import { Router } from 'express';
import appInit from '@framework/web/middlewares/appInit.middleware';
import { IDependency } from '@application/ports/IDependency'; 
import taskControllerCreate from '@presentation/controllers/task.controller';
const router = Router();

export const taskRouter = (dependencies:IDependency) => {
  const taskController = taskControllerCreate(dependencies);

  router.use(appInit);

  router.post('/:projectId/tasks', taskController.createController);
  router.get('/:projectId/tasks/:taskId', taskController.getByIdController);
  router.patch('/:projectId/tasks/:taskId', taskController.editController);
  return router;
}

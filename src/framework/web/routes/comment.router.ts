import { Router } from 'express';
import appInit from '@framework/web/middlewares/appInit.middleware';
import { IDependency } from '@application/ports/IDependency'; 
import commentControllerCreate from '@presentation/controllers/comment.controller';
const router = Router();

export const commentRouter = (dependencies:IDependency) => {
  const commentController = commentControllerCreate(dependencies);

  router.use(appInit);

  router.get('/:projectId/tasks/:taskId/comments', commentController.getController);
  router.post('/:projectId/tasks/:taskId/comments', commentController.createController);
  return router;
}

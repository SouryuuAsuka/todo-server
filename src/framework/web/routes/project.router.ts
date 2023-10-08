import { Router } from 'express';
import appInit from '@framework/web/middlewares/appInit.middleware';
import { IDependency } from '@application/ports/IDependency'; 
import projectControllerCreate from '@presentation/controllers/project.controller';
const router = Router();

export const projectRouter = (dependencies:IDependency) => {
  const projectController = projectControllerCreate(dependencies);

  router.use(appInit);

  router.get('/', projectController.getController);
  router.post('/', projectController.createController);
  router.put('/', projectController.editController);
  router.get('/:projectId', projectController.getByIdController);
  return router;
}

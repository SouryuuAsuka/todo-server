import { IDependency } from '@application/ports/IDependency';
import projectUseCase from '@application/use-cases/project.use-case';
const projectControllerCreate = (dependencies: IDependency) => {
  const { projectRepository } = dependencies.DatabaseService;
  const {
    getProject,
    createProject,
    getByIdProject,
    editProject,
  } = projectUseCase(projectRepository);
  const getController = async (req: any, res: any, next: any) => {
    try {
      const projects = await getProject();
      return res.status(200).json({
        status: 'success',
        data: {
          projects
        },
      })
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message ?? "Server error"
      })
    }
  }
  const getByIdController = async (req: any, res: any, next: any) => {
    try {
      const projectId = req.params.projectId;
      const project = await getByIdProject(projectId);
      return res.status(200).json({
        status: 'success',
        data: {
          project
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
      const { name, emoji } = req.body;
      const projects = await createProject(res.locals.userId, name, emoji);
      return res.status(200).json({
        status: 'success',
        data: {
          projects
        },
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
      const projectId = req.params?.projectId;
      const { name, emoji } = req.body;
      const projects = await editProject(projectId, name, emoji);
      return res.status(200).json({
        status: 'success',
        data: {
          projects
        },
      })
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message ?? "Server error"
      })
    }
  }
  return {
    getController,
    createController,
    getByIdController,
    editController,
  }
}

export default projectControllerCreate;
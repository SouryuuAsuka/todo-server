import { IDependency } from '@application/ports/IDependency';
import projectUseCase from '@application/use-cases/project.use-case';
import * as fs from 'fs';

const projectControllerCreate = (dependencies: IDependency) => {
  const { projectRepository } = dependencies.DatabaseService;
  const {
    getProject,
    createProject,
    getByIdProject,
    editProject,
  } = projectUseCase(projectRepository);

  const filesController = async (req: any, res: any, next: any) => {
    try {
      console.log(JSON.stringify(req.file));
      fs.readFile(req.file.path, function (err, data) {
        if (err) throw err;
        fs.writeFile(__dirname+"/../../../dist/" + req.body.filename, data, function (err) {
          if (err) {
            return console.log(err);
          }
          console.log("The file was saved!");
        });
        console.log(data);
      });
      return res.status(200).json({
        status: 'success',
        data: {},
      })
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message ?? "Server error"
      })
    }
  }

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
      const project = await createProject(res.locals.userId, name, emoji);
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
    filesController,
  }
}

export default projectControllerCreate;
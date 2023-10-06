import { IProjectRepository } from "@application/ports/repository";

const projectUseCase = (projectRepository: IProjectRepository) => {
  const getProject = async () => {
    const projects = await projectRepository.get();
    return projects;
  }
  const getByIdProject = async (project_id: number) => {
    const projects = await projectRepository.getById(project_id);
    return projects;
  }
  const createProject = async (user_id: number, name: string, emoji: string) => {
    const projects = await projectRepository.create(user_id, name, emoji);
    return projects[0];
  }
  const editProject = async (project_id: number, name: string, emoji: string) => {
    const projects = await projectRepository.edit(project_id, name, emoji);
    return projects[0];
  }
  return {
    getProject,
    createProject,
    editProject,
    getByIdProject,
  }
}

export default projectUseCase;
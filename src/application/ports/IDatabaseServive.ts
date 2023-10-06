import { IUserRepository, ITaskRepository, IProjectRepository, ICommentRepository } from './repository';

export interface IDatabaseServive {
  userRepository: IUserRepository;
  taskRepository: ITaskRepository;
  projectRepository: IProjectRepository;
  commentRepository: ICommentRepository;
}
import { Pool } from 'pg';
import UserRepository from './UserRepository';
import ProjectsRepository from './ProjectsRepository';
import TaskRepository from './TaskRepository';
import CommentRepository from './CommentRepository';
import { IUserRepository, IProjectRepository, ITaskRepository, ICommentRepository } from '@application/ports/repository';

export default class PostgresqlDatabaseService {
  pool: Pool;
  userRepository: IUserRepository;
  projectRepository: IProjectRepository;
  taskRepository: ITaskRepository;
  commentRepository: ICommentRepository;
  
  constructor() {
    this.pool = new Pool({
      user: process.env.POSTGRESQL_USER,
      database: process.env.POSTGRESQL_DATABASE,
      password: process.env.POSTGRESQL_PASSWORD,
      port: 5432,
      host: '172.17.0.1',
    });
    this.userRepository = new UserRepository(this.pool);
    this.projectRepository = new ProjectsRepository(this.pool);
    this.taskRepository = new TaskRepository(this.pool);
    this.commentRepository = new CommentRepository(this.pool);
  }
}

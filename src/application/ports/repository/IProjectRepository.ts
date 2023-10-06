
export interface IProjectRepository {
  get(): Promise<any[]>;
  create(user_id: number, name: string, emoji: string): Promise<any[]>;
  edit(project_id: number, name: string, emoji: string): Promise<any[]>;
  getById(project_id: number): Promise<any[]>;
}
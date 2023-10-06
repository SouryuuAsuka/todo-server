export interface Task{
  task_id:number;
  name:string;
  about:string;
  priority:number;
  status:number;
  project_id?:number;
  created?:string;
  finished?:string;
  files?:string[];
  subtasks?:any[];
  creator?:number;
}
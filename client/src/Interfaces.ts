export interface ITodo {
  id: string;
  title: string;
  description: string;
  complete: boolean;
  subtasks: string[];
}
export interface Todo {
  id: string;
  title: string;
  description: string;
}

export interface TodoArgs {
  id: string;
}

export interface AddTodoArgs {
  title: string;
  description: string;
}

export interface UpdateTodoArgs {
  id: string;
  title: string;
  description: string;
}

export interface RemoveTodoArgs {
  id: string;
}

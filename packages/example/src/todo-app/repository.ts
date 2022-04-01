import { Repository } from '@one-for-all/render-engine';

import TodoList from './components/todo-list';
import TodoInput from './components/todo-input';
import TodoFilter from './components/todo-filter';

const todoAppRepository: Repository = {
  'todo-app@whatever': {
    TodoList: TodoList,
    TodoInput: TodoInput,
    TodoFilter: TodoFilter,
  },
};

export default todoAppRepository;

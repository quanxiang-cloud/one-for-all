import { rest } from 'msw';

interface Todo {
  id: number;
  title: string;
  status: 'working' | 'done';
  create_date: string;
}

const tasks: Todo[] = [
  {
    id: 23,
    title: 'this is first todo task',
    status: 'working',
    create_date: '2017-12-24T00:00:00.000Z',
  },
  {
    id: 22,
    title: 'kk',
    status: 'done',
    create_date: '2017-12-24T00:00:00.000Z',
  },
];

const handle_GET_todos = rest.get('/todos', (req, res, ctx) => {
  if (req.url.searchParams.get('status') === 'working') {
    return res(ctx.json(tasks.filter(({ status }) => status === 'working')));
  }

  if (req.url.searchParams.get('status') === 'done') {
    return res(ctx.json(tasks.filter(({ status }) => status === 'done')));
  }

  return res(ctx.json(tasks));
});

const handle_GET_todoStatus = rest.get('/todo_status', (req, res, ctx) => {
  return res(
    ctx.json({
      all: tasks.length,
      working: tasks.filter(({ status }) => status === 'working').length,
      done: tasks.filter(({ status }) => status === 'done').length,
    }),
  );
});

const handle_POST_todo = rest.post<Todo>('/todos', (req, res, ctx) => {
  if (!req.body.title) {
    return res(ctx.status(400), ctx.json({ message: 'title required' }));
  }

  const newTask: Todo = {
    id: Date.now(),
    title: req.body.title,
    status: 'working',
    create_date: new Date().toISOString(),
  };

  tasks.unshift(newTask);

  return res(ctx.status(201));
});

const handle_DELETE_todo = rest.delete<undefined, { todoId: string }>('/todos/:todoId', (req, res, ctx) => {
  const todoID = parseInt(req.params.todoId);
  const index = tasks.findIndex(({ id }) => id === todoID);

  if (index === -1) {
    return res(ctx.status(404));
  }

  tasks.splice(index, 1);
  return res(ctx.status(204));
});

const handle_PUT_todo = rest.put<Todo, { todoId: string }>('/todos/:todoId', (req, res, ctx) => {
  const todoID = parseInt(req.params.todoId);
  const index = tasks.findIndex(({ id }) => id === todoID);

  if (index === -1) {
    return res(ctx.status(404));
  }

  tasks.forEach((task, index) => {
    if (task.id === todoID) {
      tasks.splice(index, 1, { ...task, status: task.status === 'done' ? 'working' : 'done' });
    }
  });

  return res(ctx.status(200));
});

const handle_GET_status = rest.get('todo_status', (req, res, ctx) => {
  return res(
    ctx.json({
      all: tasks.length,
      working: tasks.filter(({ status }) => status === 'working').length,
      done: tasks.filter(({ status }) => status === 'done').length,
    }),
  );
});

export const handlers = [
  handle_GET_todos,
  handle_GET_todoStatus,
  handle_POST_todo,
  handle_PUT_todo,
  handle_DELETE_todo,
  handle_GET_status,
];

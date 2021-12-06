import express, { Request, Response } from 'express';
import { Todo } from '../models/todo';
const router = express.Router();

router.get('/api/todos', async (req: Request, res: Response) => {
  const todos = await Todo.find({});
  return res.status(200).send(todos);
});

router.post('/api/todos', async (req: Request, res: Response) => {
  const { id, title, description , subtasks } = req.body;
  const complete: boolean = false;

  const todo = Todo.build({ id, title, description, subtasks, complete })
  await todo.save();
  console.log(`Created todo: ${todo.title}!`)
  return res.status(201).send(todo);
});

router.get('/api/todo/:id', async (req: Request, res: Response) => {
  const id : string = req.params.id;
  const todo = await Todo.find({ _id: id });
  return res.status(200).send(todo);
});

router.delete('/api/todo/:id', async (req: Request, res: Response) => {
  const id : string = req.params.id;
  const todoToDelete = await Todo.find({ id: id });
  await Todo.findOneAndRemove({ id: todoToDelete[0].id }).exec();
  console.log(`Deleted todo: ${todoToDelete[0].title}!`)
  return res.status(204).send(todoToDelete)
});

export { router as todoRouter };
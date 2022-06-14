import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from 'express';
import path from 'path';
import * as socketio from "socket.io";
import mongoose from 'mongoose';
import { Todo } from './models/todo';

const app = express();
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'client/build')));

const PORT: string | number = process.env.PORT || 4000;

const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE"]
  }
});

io.on("connection", (socket: socketio.Socket) => {
  console.log(`connected to Socket, id: ${socket.id}.`);
  socket.on("update-to-server", (message: string) => {
    console.log(`received at server! Client message: ${message}`)
    socket.broadcast.emit("update-to-client")
  });
});

io.on("disconnect", (socket: socketio.Socket) => {
  console.log(`disconnected from Socket ${socket.id}.`);
});

app.get('/api/todos', async (req: Request, res: Response) => {
  const todos = await Todo.find({});
  return res.status(200).send(todos);
});

app.post('/api/todos', async (req: Request, res: Response) => {
  const { id, title, description , subtasks } = req.body;
  const complete: boolean = false;
  const todo = Todo.build({ id, title, description, subtasks, complete })
  await todo.save();
  console.log(`Created todo: ${todo.title}!`)
  return res.status(201).send(todo);
});

app.get('/api/todo/:id', async (req: Request, res: Response) => {
  const id : string = req.params.id;
  const todo = await Todo.find({ id });
  return res.status(200).send(todo);
});

app.put('/api/todo/:id', async (req: Request, res: Response) => {
  const id : string = req.params.id;
  const { subtask, method } = req.body;
  if (method === "add") {
    const updatedTodo = await Todo.findOneAndUpdate({ id }, {$push: { subtasks: subtask }}, {new: true});
    // console.log(`Updated todo: ${updatedTodo.title}: added subtask ${subtask}.`)
  }
  if (method === "remove") {
    const updatedTodo = await Todo.findOneAndUpdate({ id }, {$pull: { subtasks: subtask }}, {new: true});
    // console.log(`Updated todo: ${updatedTodo.title}: removed subtask ${subtask}.`)
  }
  if (method === "check") {
    const updatedTodo = await Todo.findOneAndUpdate({ id }, { complete: true }, {new: true});
    // console.log(`Updated todo: ${updatedTodo.title}: removed subtask ${subtask}.`)
  }
  if (method === "uncheck") {
    const updatedTodo = await Todo.findOneAndUpdate({ id }, { complete: false }, {new: true});
    // console.log(`Updated todo: ${updatedTodo.title}: removed subtask ${subtask}.`)
  }
  // return res.status(201).send(updatedTodo);
  return res.status(201).end();
});

app.delete('/api/todo/:id', async (req: Request, res: Response) => {
  const id : string = req.params.id;
  const todoToDelete = await Todo.find({ id });
  await Todo.findOneAndRemove({ id: todoToDelete[0].id }).exec();
  console.log(`Deleted todo: ${todoToDelete[0].title}!`)
  return res.status(204).send(todoToDelete)
});


mongoose.connect(
`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.lplqc.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, 
() => console.log('connected to database'));

http.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

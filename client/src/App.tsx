import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { io, Socket } from "socket.io-client";
import Header from './components/Header';
import TodoList from './components/TodoList';
import {ITodo} from "./Interfaces";
import './App.css';

const App = () => {
  const [todoList, setTodoList] = useState<ITodo[]>([]);
  const [socket, setSocket] = useState<Socket>(io);
  const [listType, setListType] = useState<string>('all');

  useEffect(() => {
    getTodos();
    const socket = io("http://localhost:4000");
    socket.on("update-to-client", (data) => {
      console.log("received at client!")
      getTodos()
    })
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, [listType]);

  const settingTodosList = (type: string) => {
    setListType(type);
  }

  const getTodos = async (): Promise<void> => {
    try {
      const response = await fetch('/api/todos').then(res => res.json());
      setTodoList(response);
    } catch (err) {
      console.error(err);
    }
  }

  const addTodo = async (title : string, description: string): Promise<void> => {
    const id: string = uuid();
    const subtasks: string[] = [];
    const complete: boolean = false;
    const newTodo: ITodo = { id, title, description, subtasks, complete };

    await fetch('/api/todos', { 
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo)
    });

    getTodos();
    socket.emit("update-to-server", "Adding todo.");
  }

  const deleteTodo = async (id: string): Promise<void> => {
    await fetch(`/api/todo/${id}`, { method: 'DELETE' });
    getTodos();
    socket.emit("update-to-server", "Deleting todo.");
  }

  const checkTodo = async (id: string, method: string): Promise<void> => {
    await fetch(`/api/todo/${id}`, { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({method})
    });
    getTodos();
    socket.emit("update-to-server", "Checking/unchecking todo.");
  }

  const updateTodo = async (id: string, subtask: string, method: string): Promise<void> => {
    await fetch(`/api/todo/${id}`, { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({subtask, method})
    });
    getTodos();
    socket.emit("update-to-server", "Updated todo.");
  }

  return (
    <div className="App">
      <Header addTodo={addTodo} settingTodosList={settingTodosList} listType={listType}/>
      <TodoList socket={socket} todoList={todoList} listType={listType} deleteTodo={deleteTodo} updateTodo={updateTodo} checkTodo={checkTodo}/>
    </div>
  );
}

export default App;

import { ChangeEvent, useState, useEffect } from 'react';
import { ITodo } from "../Interfaces";
import { Socket } from "socket.io-client";

interface Props {
  todo: ITodo;
  listType: string
  deleteTodo(id: string): Promise<void>;
  updateTodo(id: string, subtask: string, method: string): Promise<void>;
  checkTodo(id: string, method: string): Promise<void>;
  socket: Socket;
}

const Todo = ({ todo, listType, deleteTodo, updateTodo, checkTodo, socket }: Props) => {
  const [checkedTodo, setCheckedTodo] = useState<boolean>(false);
  const [addSubtask, setAddsubtask] = useState<boolean>(false);
  const [subtask, setSubtask] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => setSubtask(event.target.value);

  const handlingSubtasks = (subtask: string, method: string) => {
    if (method === "add") updateTodo(todo.id, subtask, "add");
    // if (method === "check") updateTodo(todo.id, subtask, "check");
    else updateTodo(todo.id, subtask, "remove");
    setSubtask('');
  }

  const handleChecking = (id: string, method: string): void => {
    setCheckedTodo(!checkedTodo);
    checkTodo(id, method)
  }

  const getTodo = async (id: string): Promise<void> => {
    try {
      const todo = await fetch(`/api/todo/${id}`).then(res => res.json());
      setCheckedTodo(todo[0].complete);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getTodo(todo.id); // to get todo's complete status
    socket.on("update-to-client", (data) => {
      console.log("received at client!")
      getTodo(todo.id)
    })
  }, [listType]); // so that it re-renders on list type change with the right styling for "checked"

  return (
    <div className="todo-container">

      <div className='todo'>
        <div className={`todo-content todo-checked--${checkedTodo}`}>
          <h2 className="todo-title">{todo.title}</h2>
          <h3 className="todo-description">{todo.description}</h3>

          <div className="todo-subtasks">
            {todo.subtasks.length > 0 && todo.subtasks.map((subtask, key) =>
              <div key={key} className="todo-subtask-container">
                <span className="todo-subtask">{subtask}</span>
                <div className="subtask-buttons">
                <button className="button-check-subtask">✓</button>
                <button className="button-remove-subtask" onClick={() => handlingSubtasks(subtask, "remove")}>X</button>
                </div>
              </div>
            )}
          </div>
          
          <button className="button-add-subtasks" onClick={() => setAddsubtask(true)}>Add subtasks</button>

          {addSubtask && <div className='todo-subtasks-input'>
            <input type="text" placeholder="subtask" name="subtask" value={subtask} onChange={handleChange}/>
            <button onClick={() => handlingSubtasks(subtask, "add")}>ADD</button>
            <button onClick={() => setAddsubtask(false)}>Close</button>
            </div>
          }

          <div className='todo-buttons'>
            {checkedTodo === false 
            ? <button className="button-check-todo" onClick={(e) => handleChecking(todo.id, "check")}>CHECK</button>
            : <button className="button-check-todo" onClick={(e) => handleChecking(todo.id, "uncheck")}>UNCHECK</button>
            }
            <button className="button-remove-todo" onClick={() => deleteTodo(todo.id)}>X</button>
          </div>

        </div>
      </div>
  </div>
  )
}

export default Todo;
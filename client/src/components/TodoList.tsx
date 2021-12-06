import Todo from './Todo';
import { ITodo } from "../Interfaces";
import { Socket } from "socket.io-client";

interface Props {
    listType: string;
    todoList: ITodo[];
    deleteTodo(id: string): Promise<void>;
    updateTodo(id: string, subtask: string, method: string): Promise<void>;
    checkTodo(id: string, method: string): Promise<void>;
    socket: Socket;
}

const TodoList = ({ todoList, listType, deleteTodo, updateTodo, checkTodo, socket }: Props) => {
    
    return (
        <div className="todoList">
            {listType === "completed" 
            ? todoList.filter(todo => todo.complete === true).map((todo: ITodo, key: number) => <Todo key={key} todo={todo} socket={socket} deleteTodo={deleteTodo} updateTodo={updateTodo} checkTodo={checkTodo} listType={listType}/>)
            : todoList.map((todo: ITodo, key: number) => <Todo key={key} todo={todo} socket={socket} deleteTodo={deleteTodo} updateTodo={updateTodo} checkTodo={checkTodo} listType={listType}/>)
            }
        </div>
    )
}

export default TodoList;
import { ChangeEvent, useState } from 'react';

interface Props {
    addTodo(title: string, description : string) : Promise<void>;
    settingTodosList(type: string) : void;
    listType: string;
}

const Header = ({ addTodo, settingTodosList, listType }: Props) => {
    const [todoTitle, setTodoTitle] = useState<string>('');
    const [todoDescription, setTodoDescription] = useState<string>('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        if (event.target.name === "todo") setTodoTitle(event.target.value);
        if (event.target.name === "description") setTodoDescription(event.target.value);
    };

    const addTodoHandler = () => {
        addTodo(todoTitle, todoDescription)
        setTodoTitle('');
        setTodoDescription('')
    }

    return (
        <div className="header">
            <h1 className="app-title">Reminder App</h1>
            <div className="inputContainer">
            <div className="inputFields">
                <input type="text" 
                placeholder="title"
                name="todo"
                value={todoTitle}
                onChange={handleChange}/>

                <input type="text" 
                placeholder="description"
                name="description"
                value={todoDescription}
                onChange={handleChange}/>
            </div>

            <button className="button-add-todo" onClick={addTodoHandler}>Add Todo</button>
        </div>

        {listType === "all" 
            ? <button className="button-show-complete-todos" onClick={() => settingTodosList("completed")}>Show only completed todos</button>
            : <button className="button-show-complete-todos" onClick={() => settingTodosList("all")}>Show all todos</button>
            }
    </div>
    )
}

export default Header;
import mongoose from 'mongoose'

interface ITodo {
  id: string;
  title: string;
  description: string;
  subtasks: string[];
  complete: boolean;
}

interface TodoDoc extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  subtasks: string[];
  complete: boolean;
}

interface todoModelInterface extends mongoose.Model<TodoDoc> {
  build(attr: ITodo): TodoDoc
}

const todoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String, 
    required: true
  },
  subtasks: {
    type: Array,
    required: false
  },
  complete: {
    type: Boolean,
    required: true
  }
})

todoSchema.statics.build = (attr: ITodo) => {
  return new Todo(attr)
}

const Todo = mongoose.model<TodoDoc, todoModelInterface>('Todo', todoSchema)

export { Todo }
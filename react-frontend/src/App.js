import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [todos, setTodos] = useState();
  const [todo, setTodo] = useState();

  useEffect(()=> {
    const formData = new FormData()
    formData.append('action', 'todos')
    fetch(`${process.env.REACT_APP_ENDPOINT}`, {
      method: 'POST',
      body: formData
    }).then(res => res.json()).then(data => setTodos(data))
  },[])

  const addTodo = () =>{
    if (!todo) {
      alert('Todo can not be empty!!!')
      return
    }
    const formData = new FormData()
    formData.append('todo', todo)
    formData.append('action', 'add-todo')
    fetch(`${process.env.REACT_APP_ENDPOINT}`, {
      method: 'POST',
      body: formData
    }).then(res => res.json()).then(data => {if(data.error){
      alert(data.error)
    }else {
      setTodos([{id:data,todo:todo,done:0},...todos])
      setTodo('')
    }
  })

  }

  const deleteTodo = todoId => {
    const formData = new FormData()
    formData.append('id', todoId)
    formData.append('action', 'delete-todo')
    fetch(`${process.env.REACT_APP_ENDPOINT}`, {
      method: 'POST',
      body: formData
    }).then(res => res.json()).then(data => {if(data.error){
      alert(data.error)
    }else {
      setTodos(todos.filter(todo => todo.id !== todoId))
      setTodo('')
    }})

  }
  const doneTodo = (todoId, done) => {
    const formData = new FormData()
    formData.append('id', todoId)
    formData.append('done', done === 1 ? 0 : 1)
    formData.append('action', 'done-todo')
    fetch(`${process.env.REACT_APP_ENDPOINT}`, {
      method: 'POST',
      body: formData
    }).then(res => res.json()).then(data => {
      const  newTodos = todos.map(todo => {
        if(todo.id === todoId) {
          todo.done = todo.done === 1 ? 0 : 1;
        }
        return todo
      })
      setTodos(newTodos)
    })

  }

  return (
    <div className='todo'>
      <h1>To Do App</h1>

      <div>
        <input type='text' value={todo} onChange={(e) => setTodo(e.target.value)} placeholder='Write todo' />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      {todos && (
        <ul>
          {
            todos.map(todo => (
              <li key={todo.id} className={todo.done === 1 ? 'done' : ''}>
                {todo.todo}
                <button onClick={() => doneTodo(todo.id, todo.done)} className='done-button'>✓</button>
                <button onClick={() =>deleteTodo(todo.id)} className='delete'>Delete</button>
              </li>
            ))
          }
        </ul>
      )}
    </div>
  );
}

export default App;

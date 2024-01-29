import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchThunk, setFilter, selectTodos, selectStatus } from "./features/todos"
import TodoItem from './components/TodoItem'
import './App.css'

const App = () => {
  const [value, setValue] = useState('')
  const [titulo, setTitulo] = useState('Lista de tareas:')
  const dispatch = useDispatch()
  const todos = useSelector(selectTodos)
  const status = useSelector(selectStatus)

  const changeTitle = (newTitle) => {
    setTitulo(newTitle)
  }

  const submit = (e) => {
    e.preventDefault()
    if(!value.trim()){
      return
    }
    const id = Math.random().toString(36)
    const todo = { title: value, completed: false, id }
    dispatch({ type: 'todo/add', payload: todo  })
    setValue('')
  }

  if(status.loading === 'pending') {
    return <p> Cargando... </p>
  }
  if(status.loading === 'rejected'){
    <p>{status.error}</p>
  }

  return (
    <div className="App">
      <form onSubmit={submit} className="form">
        <label className="form-label">Inserte una tarea: </label>
        <input className="form-input" value={value} onChange={e => setValue(e.target.value)}/> 
      </form>
      <button 
        type="button" 
        className="btn btn-info" 
        onClick={() => dispatch(setFilter('all', changeTitle('Lista de tareas: ')))}> 
          Mostrar todos 
      </button>
      <button 
        type="button" 
        className="btn btn-success" 
        onClick={() => dispatch(setFilter('complete', changeTitle('Tareas completadas: ')))}> 
          Completados 
      </button>
      <button 
        type="button" 
        className="btn btn-danger" 
        onClick={() => dispatch(setFilter('incomplete', changeTitle('Tareas incompletas: ')))}> 
          Incompletos 
      </button>
      <button 
        type="button" 
        className="btn btn-link" 
        onClick={() => dispatch(fetchThunk())}> 
          Fetch 
      </button>
      <h2> {titulo} </h2>
      <ul className="list-group list-group-flush">
        {todos.map(todo => 
          <TodoItem 
            key={todo.id}
            todo={todo}
          />  
        )}
      </ul>
    </div>
  )
}

export default App
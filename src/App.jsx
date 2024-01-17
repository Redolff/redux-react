import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { combineReducers } from "redux"
import { fetchThunk, setFilter } from "./features/todos"
import TodoItem from "./components/todoItem"

export const asyncMiddleware = (store) => (next) => (action) => {
  if(typeof action === 'function'){
    return action(store.dispatch, store.getState)
  }
  return next(action)
}

export const filterReducer = (state = 'all', action) => { //Actualizar filter
  switch(action.type){
    case 'filter/set': {
      return action.payload
    }
    default: {
      return state
    }
  }
}

export const todosReducer = (state = [], action) => { //Actualizar todos
  switch(action.type){
    case 'todos/fullfiled': {
      return action.payload
    }
    case 'todo/add': {
      return state.concat({ ...action.payload })
    }
    case 'todo/complete': {
      const newTodos = state.map(todo => {
        if(todo.id === action.payload.id){
          return { ...todo, completed: !state.completed }
        }
        return todo
      })
      return newTodos
    }
    default: {
      return state
    }
  }
}

const initialFetching = {loading: 'idle', error: null}
export const fetchingReducer = (state = initialFetching, action) => {
  switch(action.type){
    case 'todos/pending': {
      return {...state, loading: 'pending'}
    }
    case 'todos/fullfiled': {
      return {...state, loading: 'succesed'}
    }
    case 'todos/error': {
      return { error: action.error, loading: 'rejected'}
    }
    default: {
      return state
    }
  }
}

export const reducer = combineReducers({
  todos: combineReducers({
    entities: todosReducer,
    status: fetchingReducer,
  }),
  filter: filterReducer,
}) 

const selectStatus = (state) => state.todos.status

const selectTodos = state => {
  const { todos: { entities }, filter } = state
  if(filter === 'complete'){
    return entities.filter(x => x.completed)
  }
  if(filter === 'incomplete'){
    return entities.filter(x => !x.completed)
  }
  return entities
}

const App = () => {
  const [value, setValue] = useState('')
  const dispatch = useDispatch()
  const todos = useSelector(selectTodos)
  const status = useSelector(selectStatus)

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
    <div>
      <form onSubmit={submit}>
        <input value={value} onChange={e => setValue(e.target.value)}/> 
      </form>
      <button onClick={() => dispatch(setFilter('all'))}> Mostrar todos </button>
      <button onClick={() => dispatch(setFilter('complete'))}> Completados</button>
      <button onClick={() => dispatch(setFilter('incomplete'))}> Incompletos</button>
      <button onClick={() => dispatch(fetchThunk())}> Fetch </button>
      <ul>
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
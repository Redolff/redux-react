import { combineReducers } from "redux"
import { makeFetchingReducer, makeSetReducer, reduceReducers, makeCrudReducer, mac } from "./utils"

export const fetchThunk = () => async dispatch => {
    dispatch(setPending())
    try{
        const response = await fetch('https://jsonplaceholder.typicode.com/todos')
        const data = await response.json()
        const todos = data.slice(0, 10)
        dispatch(setFullfiled(todos))
    } catch(e) {
        dispatch(setError(e))
    }
}

const setPending = mac('todos/pending')
const setFullfiled = mac('todos/fullfiled', 'payload')
const setError = mac('todos/error', 'error')
export const setFilter = mac('filter/set', 'payload')
export const setComplete = mac('todos/complete', 'payload')

// -- REDUCERS -- //

export const filterReducer = makeSetReducer([
    'filter/set',
])

export const fetchingReducer = makeFetchingReducer([
    'todos/pending',
    'todos/fullfiled',
    'todos/rejected'
])

const fullfiledReducer = makeSetReducer([
    'todos/fullfiled'
])

const crudReducer = makeCrudReducer([    
    'todo/add',
    'todo/complete'
])

export const todosReducer = reduceReducers(crudReducer, fullfiledReducer)

export const reducer = combineReducers({
    todos: combineReducers({
      entities: todosReducer,
      status: fetchingReducer,
    }),
    filter: filterReducer,
})

// -- SELECTORES -- //

export const selectTodos = state => {
    const { todos: { entities }, filter } = state
    if(filter === 'complete'){
      return entities.filter(x => x.completed)
    }
    if(filter === 'incomplete'){
      return entities.filter(x => !x.completed)
    }
    return entities
}
  
export const selectStatus = (state) => state.todos.status
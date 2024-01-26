import { combineReducers } from "redux"
import { mat, mac, asyncMac, makeFetchingReducer, makeSetReducer, reduceReducers, makeCrudReducer } from "./utils"

const asyncTodos = mat('todos')

const [setPending, setFullfiled, setError] = asyncMac(asyncTodos)
export const setComplete = mac('todo/complete', 'payload')
export const setFilter = mac('filter/set', 'payload')

export const fetchThunk = () => async dispatch => {
    dispatch(setPending())
    try{
        const response = await fetch('https://jsonplaceholder.typicode.com/todos')
        const data = await response.json()
        const todos = data.slice(0, 10)
        dispatch(setFullfiled(todos))
    } catch(e) {
        dispatch(setError(e.message))
    }
}

// -- REDUCERS -- //

export const filterReducer = makeSetReducer([
    'filter/set',
])

export const fetchingReducer = makeFetchingReducer(asyncTodos)

const fullfiledReducer = makeSetReducer([
    'todos/fullfiled'
])

const crudReducer = makeCrudReducer([    
    'todo/add',
    'todo/complete',
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
      return entities.filter(todo => todo.completed)
    }
    else if(filter === 'incomplete'){
      return entities.filter(todo => !todo.completed)
    }
    return entities
}
  
export const selectStatus = (state) => state.todos.status
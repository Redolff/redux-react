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

const setPending = () => ({ type: 'todos/pending' })
const setFullfiled = payload => ({ type: 'todos/fullfiled', payload })
export const setError = e => ({ type: 'todos/error', error: e.message })
export const setFilter = payload => ({ type: 'filter/set', payload})
export const setComplete = payload => ({ type: 'todos/complete', payload })

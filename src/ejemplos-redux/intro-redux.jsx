import { legacy_createStore } from 'redux'

const store = legacy_createStore((state = 0, action) => { //es un reducer!
  switch(action.type){  //action: {type: 'tipo de accion', payload: any}
    case 'incrementar': {
      return state + 1
    }
    case 'decrementar': {
      return state - 1
    }
    case 'set': {
      return action.payload
    }
    default: {
      return state
    }
  }
})

console.log(store.getState())
store.dispatch({ type: 'incrementar' }) //actualiza estado el dispatch
console.log(store.getState())
store.dispatch({ type: 'decrementar'})
console.log(store.getState())
store.dispatch({ type: 'set', payload: 15 })
console.log(store.getState())
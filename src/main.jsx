import React from 'react'
import ReactDOM from 'react-dom/client'
import { legacy_createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import App from './App.jsx'
import { asyncMiddleware } from './middlewares/async.jsx'
import { reducer } from './features/todos.jsx'

const store = legacy_createStore(reducer, applyMiddleware(asyncMiddleware))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)

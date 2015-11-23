import 'babel-core/polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App'
import configureStore from './store/configureStore'
import 'style!css!sass!css/main.css.scss'
import ipc from 'ipc'
import { FILE_SAVED } from 'constants/ActionTypes'
import Modal from 'react-modal'

const root = document.getElementById('react-root')
Modal.setAppElement(root)

const store = configureStore()

ipc.on('state-saved', (_arg) => {
  store.dispatch({type: FILE_SAVED, dirty: false})
})

render(
  <Provider store={store}>
    <App />
  </Provider>,
  root
)
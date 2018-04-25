import { render } from 'react-dom'

import { store } from './init'
import App from './App'

render(
  <App store={store} />,
  document.getElementById('root')
)

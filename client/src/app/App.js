import { Provider } from 'react-redux'
import Dashboard from 'pages/dashboard'
import { hot } from 'react-hot-loader'

function AppProvider ({ store }) {
  return (
    <Provider store={store}>
      <Dashboard />
    </Provider>
  )
}

export default hot(module)(AppProvider)

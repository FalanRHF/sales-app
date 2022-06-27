import { useRoutes } from 'react-router'
import Home from './pages/Home'
import NewTransaction from './pages/NewTransaction'
import Dialog from './pages/Dialog'
// import CheckoutDialog from './components/CheckoutDialog'
import TransactionRecord from './pages/TransactionRecord'

const Router = () => {

  const contents = useRoutes([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/new',
      element: <NewTransaction />
    },
    {
      path: '/dialog',
      element: <Dialog />
    },
    {
      path: '/record',
      element: <TransactionRecord />
    },

  ])

  return contents
}

export default Router

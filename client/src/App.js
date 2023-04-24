import TextEditor from './TextEditor'
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'
import { v4 } from 'uuid'
import { Navigate } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={`/documents/${v4()}`} />,
    exact: true
  },
  {
    path: '/documents/:id',
    element: <TextEditor />
  }
])

function App() {
  redirect(`/documents/${v4()}`)
  return <RouterProvider router={router} />
}

export default App

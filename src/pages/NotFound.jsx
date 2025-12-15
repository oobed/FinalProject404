import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import useDocumentTitle from '../hooks/useDocumentTitle'

function NotFound() {
  useDocumentTitle('Page Not Found')

  return (
    <div className="text-center mt-5">
      <h1 className="display-1">404</h1>
      <h2>Page Not Found</h2>
      <p className="lead">
        The page you are looking for does not exist.
      </p>
      <Link to="/">
        <Button variant="primary">Go Home</Button>
      </Link>
    </div>
  )
}

export default NotFound

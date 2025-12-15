import { Outlet, NavLink } from 'react-router-dom'
import { Container, Nav, Navbar } from 'react-bootstrap'

function Layout() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">Song Review Hub</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? 'nav-link active-link' : 'nav-link'
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/songs"
                className={({ isActive }) =>
                  isActive ? 'nav-link active-link' : 'nav-link'
                }
              >
                Songs
              </NavLink>
              <NavLink
                to="/albums"
                className={({ isActive }) =>
                  isActive ? 'nav-link active-link' : 'nav-link'
                }
              >
                Albums
              </NavLink>
              <NavLink
                to="/add-review"
                className={({ isActive }) =>
                  isActive ? 'nav-link active-link' : 'nav-link'
                }
              >
                Add Review
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Outlet />
      </Container>
    </>
  )
}

export default Layout

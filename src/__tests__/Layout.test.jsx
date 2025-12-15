import { render, screen } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { test, expect } from 'vitest'
import Layout from '../components/Layout'

test('renders all navigation links', () => {
 
  const { container } = render(
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )

  expect(screen.getByText('Home')).toBeInTheDocument()
  expect(screen.getByText('Songs')).toBeInTheDocument()
  expect(screen.getByText('Albums')).toBeInTheDocument()
  expect(screen.getByText('Add Review')).toBeInTheDocument()
  expect(container.querySelectorAll('.nav-link')).toHaveLength(4)
})

test('home link has active-link class when on home route', () => {

  render(
    <MemoryRouter initialEntries={['/']}>
      <Layout />
    </MemoryRouter>
  )

  const homeLink = screen.getByText('Home')
  expect(homeLink).toBeInTheDocument()
  expect(homeLink).toHaveClass('nav-link')
  expect(homeLink).toHaveClass('active-link')
  expect(screen.getByText('Songs')).not.toHaveClass('active-link')
})

test('only one link has active-link class at a time', () => {
  
  render(
    <MemoryRouter initialEntries={['/songs']}>
      <Layout />
    </MemoryRouter>
  )

  expect(screen.getByText('Home')).not.toHaveClass('active-link')
  expect(screen.getByText('Songs')).toHaveClass('active-link')
  expect(screen.getByText('Albums')).not.toHaveClass('active-link')
  expect(screen.getByText('Add Review')).not.toHaveClass('active-link')
  expect(
    screen.getAllByText((_, element) => element.classList.contains('active-link'))
  ).toHaveLength(1)
})

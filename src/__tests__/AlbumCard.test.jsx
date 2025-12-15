import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { test, expect, vi } from 'vitest'
import AlbumCard from '../components/AlbumCard'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

const mockAlbum = {
  id: 1,
  title: 'Test Album',
  artist: 'Test Artist',
  releaseYear: 2020,
  genre: 'Rock',
  description: 'A great rock album',
}

test('renders album title and artist correctly', () => {
  
  const { container } = render(
    <BrowserRouter>
      <AlbumCard album={mockAlbum} />
    </BrowserRouter>
  )

  expect(screen.getByText('Test Album')).toBeInTheDocument()
  expect(screen.getByText('Test Artist')).toBeInTheDocument()
  expect(container.querySelector('.card-title')).toHaveTextContent('Test Album')
  expect(container.querySelector('.card-subtitle')).toHaveTextContent(
    'Test Artist'
  )
  expect(screen.getByText('A great rock album')).toBeInTheDocument()
})

test('shows both genre and release year badges together', () => {
 

  const { container } = render(
    <BrowserRouter>
      <AlbumCard album={mockAlbum} />
    </BrowserRouter>
  )

  expect(screen.getByText('Rock')).toBeInTheDocument()
  expect(screen.getByText('2020')).toBeInTheDocument()
  expect(screen.getByText('Rock')).toHaveClass('bg-primary')
  expect(screen.getByText('2020')).toHaveClass('bg-secondary')
  expect(container.querySelectorAll('.badge')).toHaveLength(2)
})

test('navigates to album detail page when clicked', () => {
  
  const mockNavigate = vi.fn()
  useNavigate.mockReturnValue(mockNavigate)

  const { container } = render(
    <BrowserRouter>
      <AlbumCard album={mockAlbum} />
    </BrowserRouter>
  )

  const card = container.querySelector('.album-card')
  fireEvent.click(card)

  expect(mockNavigate).toHaveBeenCalledTimes(1)
  expect(mockNavigate).toHaveBeenCalledWith('/albums/1')
  expect(card).toHaveStyle({ cursor: 'pointer' })
  expect(screen.getByText('Test Album')).toBeInTheDocument()
})

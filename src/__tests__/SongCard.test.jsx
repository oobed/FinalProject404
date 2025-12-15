import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { test, expect, vi } from 'vitest'
import SongCard from '../components/SongCard'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

const mockSong = {
  id: 1,
  title: 'Test Song',
  artist: 'Test Artist',
  duration: '3:45',
  trackNumber: 5,
  albumId: 1,
}

test('renders song title and artist correctly', () => {
  
  const { container } = render(
    <BrowserRouter>
      <SongCard song={mockSong} />
    </BrowserRouter>
  )

  expect(screen.getByText('Test Song')).toBeInTheDocument()
  expect(screen.getByText('Test Artist')).toBeInTheDocument()
  expect(container.querySelector('.card-title')).toHaveTextContent('Test Song')
  expect(container.querySelector('.card-subtitle')).toHaveTextContent(
    'Test Artist'
  )
  expect(screen.getByText(/Duration: 3:45/)).toBeInTheDocument()
})

test('shows track number badge when showAlbum is true and albumId exists', () => {
  
  const { container } = render(
    <BrowserRouter>
      <SongCard song={mockSong} showAlbum={true} />
    </BrowserRouter>
  )

  expect(screen.getByText('Track #5')).toBeInTheDocument()
  expect(container.querySelector('.badge')).toBeInTheDocument()
  expect(container.querySelector('.badge')).toHaveClass('bg-secondary')
  expect(screen.getByText('Test Song')).toBeInTheDocument()
  expect(screen.getByText(/Duration: 3:45/)).toBeInTheDocument()
})

test('navigates to song detail page when clicked', () => {
 
  const mockNavigate = vi.fn()
  useNavigate.mockReturnValue(mockNavigate)

  const { container } = render(
    <BrowserRouter>
      <SongCard song={mockSong} />
    </BrowserRouter>
  )

  const card = container.querySelector('.song-card')
  fireEvent.click(card)

  expect(mockNavigate).toHaveBeenCalledTimes(1)
  expect(mockNavigate).toHaveBeenCalledWith('/songs/1')
  expect(card).toHaveStyle({ cursor: 'pointer' })
  expect(screen.getByText('Test Song')).toBeInTheDocument()
})

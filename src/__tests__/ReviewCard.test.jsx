import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { test, expect, vi } from 'vitest'
import ReviewCard from '../components/ReviewCard'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

const mockReview = {
  id: 1,
  title: 'Great Song!',
  body: 'This is a fantastic song with amazing production and lyrics that really resonate with me.',
  rating: 9,
  createdAt: '2024-10-15T14:30:00Z',
}

const mockSong = {
  title: 'Test Song',
  artist: 'Test Artist',
}

const mockUser = {
  username: 'testuser',
}

test('displays rating as stars with correct number of filled and empty stars', () => {
  const { container } = render(
    <BrowserRouter>
      <ReviewCard review={mockReview} />
    </BrowserRouter>
  )
  const stars = container.querySelector('.rating-stars')

  expect(stars).toBeInTheDocument()
  expect(stars.textContent).toContain('★')
  expect(stars.textContent).toContain('☆')
  expect((stars.textContent.match(/★/g) || []).length).toBe(9)
  expect((stars.textContent.match(/☆/g) || []).length).toBe(1)
})

test('shows both song and user badges when both are provided', () => {
  const { container } = render(
    <BrowserRouter>
      <ReviewCard review={mockReview} song={mockSong} user={mockUser} />
    </BrowserRouter>
  )

  expect(screen.getByText(/Test Song - Test Artist/)).toBeInTheDocument()
  expect(screen.getByText('by testuser')).toBeInTheDocument()
  expect(screen.getByText(/Test Song - Test Artist/)).toHaveClass('bg-info')
  expect(screen.getByText('by testuser')).toHaveClass('bg-secondary')
  expect(container.querySelectorAll('.badge')).toHaveLength(2)
  expect(screen.getByText('Great Song!')).toBeInTheDocument()
})

test('navigates to review detail page when clicked', () => {
  
  const mockNavigate = vi.fn()
  useNavigate.mockReturnValue(mockNavigate)

  const { container } = render(
    <BrowserRouter>
      <ReviewCard review={mockReview} />
    </BrowserRouter>
  )

  const card = container.querySelector('.review-card')
  fireEvent.click(card)

  expect(mockNavigate).toHaveBeenCalledTimes(1)
  expect(mockNavigate).toHaveBeenCalledWith('/reviews/1')
  expect(card).toHaveStyle({ cursor: 'pointer' })
  expect(screen.getByText('Great Song!')).toBeInTheDocument()
})

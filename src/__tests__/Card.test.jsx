import { render, screen } from '@testing-library/react'
import { test, expect, vi } from 'vitest'
import Card from '../components/Card'

test('renders all content when all props are provided', () => {
  
  const footer = <div>Test Footer</div>
  const { container } = render(
    <Card
      title="Test Title"
      subtitle="Test Subtitle"
      body="Test body content"
      footer={footer}
      className="custom-class"
    />
  )

  expect(screen.getByText('Test Title')).toBeInTheDocument()
  expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
  expect(screen.getByText('Test body content')).toBeInTheDocument()
  expect(screen.getByText('Test Footer')).toBeInTheDocument()
  expect(container.querySelector('.custom-class')).toBeInTheDocument()
  expect(container.querySelector('.card')).toBeInTheDocument()
})

test('calls onClick handler when card is clicked', () => {
 
  const handleClick = vi.fn()
  const { container } = render(
    <Card title="Clickable Card" onClick={handleClick} />
  )
  const card = container.querySelector('.card')

  expect(handleClick).toHaveBeenCalledTimes(0)
  expect(card).toHaveStyle({ cursor: 'pointer' })
  card.click()
  expect(handleClick).toHaveBeenCalledTimes(1)
  card.click()
  expect(handleClick).toHaveBeenCalledTimes(2)
  expect(screen.getByText('Clickable Card')).toBeInTheDocument()
})

test('renders complex body content with React elements', () => {
  
  const complexBody = (
    <div>
      <strong>Bold text</strong>
      <em>Italic text</em>
    </div>
  )
  render(<Card body={complexBody} />)

  expect(screen.getByText('Bold text')).toBeInTheDocument()
  expect(screen.getByText('Italic text')).toBeInTheDocument()
  expect(screen.getByText('Bold text').tagName).toBe('STRONG')
  expect(screen.getByText('Italic text').tagName).toBe('EM')
})

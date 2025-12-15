import { useNavigate } from 'react-router-dom'
import { Badge } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Card from './Card'

function ReviewCard({ review, song, user }) {
  const navigate = useNavigate()

  const renderStars = rating => {
    return '★'.repeat(rating) + '☆'.repeat(10 - rating)
  }

  const handleClick = () => {
    navigate(`/reviews/${review.id}`)
  }

  const body = (
    <>
      <div className="rating-stars mb-2">{renderStars(review.rating)}</div>
      <p className="mb-2">{review.body.substring(0, 200)}...</p>
      {song && (
        <Badge bg="info" className="me-2">
          {song.title} - {song.artist}
        </Badge>
      )}
      {user && <Badge bg="secondary">by {user.username}</Badge>}
    </>
  )

  const footer = (
    <small className="text-muted">
      {new Date(review.createdAt).toLocaleDateString()}
    </small>
  )

  return (
    <Card
      title={review.title}
      body={body}
      footer={footer}
      onClick={handleClick}
      className="review-card"
    />
  )
}

ReviewCard.propTypes = {
  review: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  song: PropTypes.shape({
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
  }),
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
}

export default ReviewCard

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, Badge, Spinner, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getReview, getSong, getUser, deleteReview } from '../utils/api'
import useDocumentTitle from '../hooks/useDocumentTitle'

function ReviewDetail() {
  const { reviewId } = useParams()
  const navigate = useNavigate()
  const [review, setReview] = useState(null)
  const [song, setSong] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const currentUserId = 1 // Hardcoded for demo

  useDocumentTitle(review ? review.title : 'Review Details')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviewData = await getReview(reviewId)
        setReview(reviewData)

        const [songData, userData] = await Promise.all([
          getSong(reviewData.songId),
          getUser(reviewData.userId),
        ])
        setSong(songData)
        setUser(userData)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load review details')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [reviewId])

  const renderStars = rating => {
    return '★'.repeat(rating) + '☆'.repeat(10 - rating)
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId)
        toast.success('Review deleted successfully!')
        navigate('/')
      } catch (error) {
        console.error('Error deleting review:', error)
        toast.error('Failed to delete review')
      }
    }
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  if (!review || !song || !user) {
    return <div>Review not found</div>
  }

  return (
    <div>
      <Card>
        <Card.Body>
          <Card.Title as="h2">{review.title}</Card.Title>

          <div className="mb-3">
            <Badge bg="info" className="me-2">
              <Link
                to={`/songs/${song.id}`}
                className="text-white text-decoration-none"
              >
                {song.title} - {song.artist}
              </Link>
            </Badge>
            <Badge bg="secondary">by {user.username}</Badge>
          </div>

          <div className="rating-stars mb-3">{renderStars(review.rating)}</div>

          <Card.Text style={{ whiteSpace: 'pre-wrap' }}>{review.body}</Card.Text>

          <div className="mt-3">
            <small className="text-muted">
              Posted: {new Date(review.createdAt).toLocaleString()}
            </small>
            {review.updatedAt !== review.createdAt && (
              <>
                {' | '}
                <small className="text-muted">
                  Last updated: {new Date(review.updatedAt).toLocaleString()}
                </small>
              </>
            )}
          </div>

          {review.userId === currentUserId && (
            <div className="mt-4 d-flex gap-2">
              <Button
                variant="primary"
                onClick={() => navigate(`/reviews/${reviewId}/edit`)}
              >
                Edit Review
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete Review
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default ReviewDetail

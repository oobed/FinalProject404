import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, Badge, Spinner, Button, Form, ListGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'
import {
  getSong,
  getReviewsBySong,
  getCommentsBySong,
  createComment,
  deleteComment,
  getUsers,
} from '../utils/api'
import useDocumentTitle from '../hooks/useDocumentTitle'
import ReviewCard from '../components/ReviewCard'

function SongDetail() {
  const { songId } = useParams()
  const [song, setSong] = useState(null)
  const [reviews, setReviews] = useState([])
  const [comments, setComments] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentBody, setCommentBody] = useState('')
  const [commentError, setCommentError] = useState('')
  const currentUserId = 1 // Hardcoded for demo

  useDocumentTitle(song ? `${song.title} - ${song.artist}` : 'Song Details')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songData, reviewsData, commentsData, usersData] =
          await Promise.all([
            getSong(songId),
            getReviewsBySong(songId),
            getCommentsBySong(songId),
            getUsers(),
          ])

        setSong(songData)
        setReviews(reviewsData)
        // Sort comments by date (newest first)
        const sortedComments = commentsData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        setComments(sortedComments)
        setUsers(usersData)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load song details')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [songId])

  const validateComment = () => {
    if (!commentBody.trim()) {
      setCommentError('Comment cannot be empty')
      return false
    }
    if (commentBody.length < 5) {
      setCommentError('Comment must be at least 5 characters long')
      return false
    }
    setCommentError('')
    return true
  }

  const handleAddComment = async e => {
    e.preventDefault()
    if (!validateComment()) return

    try {
      const newComment = {
        songId: parseInt(songId),
        userId: currentUserId,
        body: commentBody,
        createdAt: new Date().toISOString(),
      }
      const createdComment = await createComment(newComment)
      setComments([createdComment, ...comments])
      setCommentBody('')
      toast.success('Comment added successfully!')
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error('Failed to add comment')
    }
  }

  const handleDeleteComment = async commentId => {
    try {
      await deleteComment(commentId)
      setComments(comments.filter(c => c.id !== commentId))
      toast.success('Comment deleted successfully!')
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast.error('Failed to delete comment')
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

  if (!song) {
    return <div>Song not found</div>
  }

  return (
    <div>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title as="h2">{song.title}</Card.Title>
          <Card.Subtitle className="mb-3 text-muted">
            {song.artist}
          </Card.Subtitle>
          <div>
            <Badge bg="secondary" className="me-2">
              Duration: {song.duration}
            </Badge>
            <Badge bg="info">Track #{song.trackNumber}</Badge>
          </div>
        </Card.Body>
      </Card>

      <h3 className="mb-3">Reviews ({reviews.length})</h3>
      {reviews.length === 0 ? (
        <p className="text-muted">
          No reviews yet. <Link to="/add-review">Be the first to review!</Link>
        </p>
      ) : (
        <div className="mb-4">
          {reviews.map(review => {
            const user = users.find(u => u.id === review.userId)
            return (
              <ReviewCard key={review.id} review={review} user={user} />
            )
          })}
        </div>
      )}

      <div className="comment-section">
        <h3 className="mb-3">Comments ({comments.length})</h3>

        <Form onSubmit={handleAddComment} className="mb-4">
          <Form.Group className="mb-3">
            <Form.Label>Add a Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={commentBody}
              onChange={e => setCommentBody(e.target.value)}
              className={commentError ? 'is-invalid' : ''}
              placeholder="Share your thoughts about this song..."
            />
            {commentError && (
              <div className="error-message">{commentError}</div>
            )}
          </Form.Group>
          <Button type="submit" variant="primary">
            Post Comment
          </Button>
        </Form>

        <ListGroup>
          {comments.map(comment => {
            const user = users.find(u => u.id === comment.userId)
            return (
              <ListGroup.Item key={comment.id} className="comment-item">
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>{user?.username || 'Unknown User'}</strong>
                    <p className="mb-1">{comment.body}</p>
                    <small className="text-muted">
                      {new Date(comment.createdAt).toLocaleString()}
                    </small>
                  </div>
                  {comment.userId === currentUserId && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </ListGroup.Item>
            )
          })}
        </ListGroup>
      </div>
    </div>
  )
}

export default SongDetail

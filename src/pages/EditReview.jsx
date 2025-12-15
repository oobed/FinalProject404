import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Button, Card, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getSongs, getReview, updateReview } from '../utils/api'
import useDocumentTitle from '../hooks/useDocumentTitle'

function EditReview() {
  const { reviewId } = useParams()
  const navigate = useNavigate()
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [originalReview, setOriginalReview] = useState(null)
  const currentUserId = 1 // Hardcoded for demo

  // Form state
  const [formData, setFormData] = useState({
    songId: '',
    title: '',
    body: '',
    rating: '',
    reviewType: 'positive',
    agreeToTerms: false,
  })

  // Error state
  const [errors, setErrors] = useState({
    songId: '',
    title: '',
    body: '',
    rating: '',
    agreeToTerms: '',
  })

  useDocumentTitle('Edit Review')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songsData, reviewData] = await Promise.all([
          getSongs(),
          getReview(reviewId),
        ])

        // Check if user owns this review
        if (reviewData.userId !== currentUserId) {
          toast.error('You can only edit your own reviews')
          navigate('/')
          return
        }

        setSongs(songsData)
        setOriginalReview(reviewData)
        setFormData({
          songId: String(reviewData.songId),
          title: reviewData.title,
          body: reviewData.body,
          rating: String(reviewData.rating),
          reviewType: 'positive',
          agreeToTerms: true,
        })
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load review')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [reviewId, navigate])

  const validateForm = () => {
    const newErrors = {
      songId: '',
      title: '',
      body: '',
      rating: '',
      agreeToTerms: '',
    }
    let isValid = true

    if (!formData.songId) {
      newErrors.songId = 'Please select a song'
      isValid = false
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Review title is required'
      isValid = false
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters long'
      isValid = false
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must not exceed 100 characters'
      isValid = false
    }

    if (!formData.body.trim()) {
      newErrors.body = 'Review body is required'
      isValid = false
    } else if (formData.body.length < 20) {
      newErrors.body = 'Review must be at least 20 characters long'
      isValid = false
    } else if (formData.body.length > 1000) {
      newErrors.body = 'Review must not exceed 1000 characters'
      isValid = false
    }

    if (!formData.rating) {
      newErrors.rating = 'Please select a rating'
      isValid = false
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setErrors(prev => ({
      ...prev,
      [name]: '',
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    try {
      const reviewData = {
        songId: parseInt(formData.songId),
        userId: currentUserId,
        title: formData.title,
        body: formData.body,
        rating: parseInt(formData.rating),
        createdAt: originalReview.createdAt,
        updatedAt: new Date().toISOString(),
      }

      await updateReview(reviewId, reviewData)
      toast.success('Review updated successfully!')
      navigate(`/reviews/${reviewId}`)
    } catch (error) {
      console.error('Error updating review:', error)
      toast.error('Failed to update review')
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

  return (
    <div>
      <h1 className="mb-4">Edit Review</h1>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Select Song <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="songId"
                value={formData.songId}
                onChange={handleChange}
                className={errors.songId ? 'is-invalid' : ''}
              >
                <option value="">Choose a song...</option>
                {songs.map(song => (
                  <option key={song.id} value={song.id}>
                    {song.title} - {song.artist}
                  </option>
                ))}
              </Form.Select>
              {errors.songId && (
                <div className="error-message">{errors.songId}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Review Title <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a catchy title for your review"
                className={errors.title ? 'is-invalid' : ''}
              />
              {errors.title && (
                <div className="error-message">{errors.title}</div>
              )}
              <Form.Text className="text-muted">
                {formData.title.length}/100 characters
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Review <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                name="body"
                value={formData.body}
                onChange={handleChange}
                placeholder="Share your detailed thoughts about the song..."
                className={errors.body ? 'is-invalid' : ''}
              />
              {errors.body && <div className="error-message">{errors.body}</div>}
              <Form.Text className="text-muted">
                {formData.body.length}/1000 characters
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Rating (1-10) <span className="text-danger">*</span>
              </Form.Label>
              <div className={errors.rating ? 'is-invalid' : ''}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <Form.Check
                    inline
                    key={num}
                    type="radio"
                    id={`rating-${num}`}
                    name="rating"
                    label={num}
                    value={num}
                    checked={formData.rating === String(num)}
                    onChange={handleChange}
                  />
                ))}
              </div>
              {errors.rating && (
                <div className="error-message">{errors.rating}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                label="I confirm this review reflects my honest opinion"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className={errors.agreeToTerms ? 'is-invalid' : ''}
              />
              {errors.agreeToTerms && (
                <div className="error-message">{errors.agreeToTerms}</div>
              )}
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit">
                Update Review
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default EditReview

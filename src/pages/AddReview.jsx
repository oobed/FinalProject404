import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Card, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getSongs, createReview } from '../utils/api'
import useDocumentTitle from '../hooks/useDocumentTitle'

function AddReview() {
  useDocumentTitle('Add New Review')
  const navigate = useNavigate()
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await getSongs()
        setSongs(data)
      } catch (error) {
        console.error('Error fetching songs:', error)
        toast.error('Failed to load songs')
      } finally {
        setLoading(false)
      }
    }
    fetchSongs()
  }, [])

  const validateForm = () => {
    const newErrors = {
      songId: '',
      title: '',
      body: '',
      rating: '',
      agreeToTerms: '',
    }
    let isValid = true

    // Validate song selection (select menu)
    if (!formData.songId) {
      newErrors.songId = 'Please select a song'
      isValid = false
    }

    // Validate title (input)
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

    // Validate body (textarea)
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

    // Validate rating (radio buttons)
    if (!formData.rating) {
      newErrors.rating = 'Please select a rating'
      isValid = false
    }

    // Validate terms agreement (checkbox)
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

    // Clear error for this field when user starts typing
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const createdReview = await createReview(reviewData)
      toast.success('Review created successfully!')
      navigate(`/reviews/${createdReview.id}`)
    } catch (error) {
      console.error('Error creating review:', error)
      toast.error('Failed to create review')
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
      <h1 className="mb-4">Add New Review</h1>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Select Menu - Song Selection */}
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

            {/* Input - Review Title */}
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

            {/* Textarea - Review Body */}
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

            {/* Radio Buttons - Rating */}
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

            {/* Radio Buttons - Review Type */}
            <Form.Group className="mb-3">
              <Form.Label>Review Type</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  id="review-type-positive"
                  name="reviewType"
                  label="Positive Review"
                  value="positive"
                  checked={formData.reviewType === 'positive'}
                  onChange={handleChange}
                />
                <Form.Check
                  type="radio"
                  id="review-type-negative"
                  name="reviewType"
                  label="Critical Review"
                  value="negative"
                  checked={formData.reviewType === 'negative'}
                  onChange={handleChange}
                />
                <Form.Check
                  type="radio"
                  id="review-type-mixed"
                  name="reviewType"
                  label="Mixed Review"
                  value="mixed"
                  checked={formData.reviewType === 'mixed'}
                  onChange={handleChange}
                />
              </div>
            </Form.Group>

            {/* Checkbox - Terms Agreement */}
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                label="I agree to the terms and conditions and confirm this review is my honest opinion"
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
                Submit Review
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

export default AddReview

import { useState, useEffect } from 'react'
import { Row, Col, Spinner } from 'react-bootstrap'
import ReviewCard from '../components/ReviewCard'
import { getReviews, getSongs, getUsers } from '../utils/api'
import useDocumentTitle from '../hooks/useDocumentTitle'

function Home() {
  useDocumentTitle('Home - Recent Reviews')
  const [reviews, setReviews] = useState([])
  const [songs, setSongs] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsData, songsData, usersData] = await Promise.all([
          getReviews(),
          getSongs(),
          getUsers(),
        ])
        // Sort reviews by date (newest first)
        const sortedReviews = reviewsData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        setReviews(sortedReviews)
        setSongs(songsData)
        setUsers(usersData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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
      <div className="text-center mb-5">
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Welcome to Song Review Hub
        </h1>
        <p className="lead" style={{ fontSize: '1.3rem', color: '#6c757d' }}>
          Discover, review, and discuss your favorite music with fellow enthusiasts
        </p>
      </div>

      <h2 className="mb-4">Recent Reviews</h2>
      <Row>
        {reviews.map(review => {
          const song = songs.find(s => s.id === review.songId)
          const user = users.find(u => u.id === review.userId)
          return (
            <Col key={review.id} md={6} lg={4}>
              <ReviewCard review={review} song={song} user={user} />
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default Home

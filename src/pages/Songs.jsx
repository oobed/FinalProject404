import { useState, useEffect } from 'react'
import { Row, Col, Spinner } from 'react-bootstrap'
import SongCard from '../components/SongCard'
import { getSongs } from '../utils/api'
import useDocumentTitle from '../hooks/useDocumentTitle'

function Songs() {
  useDocumentTitle('All Songs')
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await getSongs()
        setSongs(data)
      } catch (error) {
        console.error('Error fetching songs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSongs()
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
      <h1 className="mb-4">All Songs</h1>
      <Row>
        {songs.map(song => (
          <Col key={song.id} md={6} lg={4}>
            <SongCard song={song} showAlbum={true} />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Songs

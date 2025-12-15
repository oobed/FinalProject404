import { useState, useEffect } from 'react'
import { Row, Col, Spinner } from 'react-bootstrap'
import AlbumCard from '../components/AlbumCard'
import { getAlbums } from '../utils/api'
import useDocumentTitle from '../hooks/useDocumentTitle'

function Albums() {
  useDocumentTitle('All Albums')
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const data = await getAlbums()
        setAlbums(data)
      } catch (error) {
        console.error('Error fetching albums:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAlbums()
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
      <h1 className="mb-4">All Albums</h1>
      <Row>
        {albums.map(album => (
          <Col key={album.id} md={6} lg={4}>
            <AlbumCard album={album} />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Albums

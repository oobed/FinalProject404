import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Badge, Spinner, Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
import {
  getAlbum,
  getSongs,
} from '../utils/api'
import useDocumentTitle from '../hooks/useDocumentTitle'
import SongCard from '../components/SongCard'

function AlbumDetail() {
  const { albumId } = useParams()
  const [album, setAlbum] = useState(null)
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useDocumentTitle(album ? `${album.title} - ${album.artist}` : 'Album Details')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [albumData, songsData] = await Promise.all([
          getAlbum(albumId),
          getSongs(),
        ])

        setAlbum(albumData)
        // Filter songs that belong to this album
        const albumSongs = songsData.filter(
          song => song.albumId === parseInt(albumId)
        )
        setSongs(albumSongs)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load album details')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [albumId])

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  if (!album) {
    return <div>Album not found</div>
  }

  return (
    <div>
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              {album.coverImage && (
                <img
                  src={album.coverImage}
                  alt={`${album.title} cover`}
                  className="album-image"
                  style={{ height: '300px' }}
                />
              )}
            </Col>
            <Col md={8}>
              <Card.Title as="h2">{album.title}</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">
                {album.artist}
              </Card.Subtitle>
              <Card.Text>{album.description}</Card.Text>
              <div>
                <Badge bg="primary" className="me-2">
                  {album.genre}
                </Badge>
                <Badge bg="secondary">{album.releaseYear}</Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <h3 className="mb-3">Songs from this Album ({songs.length})</h3>
      {songs.length === 0 ? (
        <p className="text-muted">No songs available for this album.</p>
      ) : (
        <Row>
          {songs.map(song => (
            <Col key={song.id} md={6} lg={4}>
              <SongCard song={song} showAlbum={true} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default AlbumDetail

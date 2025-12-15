import { useNavigate } from 'react-router-dom'
import { Badge } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Card from './Card'

function AlbumCard({ album }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/albums/${album.id}`)
  }

  const body = (
    <>
      {album.coverImage && (
        <img
          src={album.coverImage}
          alt={`${album.title} cover`}
          className="album-image"
        />
      )}
      <p>{album.description}</p>
      <div>
        <Badge bg="primary" className="me-2">
          {album.genre}
        </Badge>
        <Badge bg="secondary">{album.releaseYear}</Badge>
      </div>
    </>
  )

  return (
    <Card
      title={album.title}
      subtitle={album.artist}
      body={body}
      onClick={handleClick}
      className="album-card"
    />
  )
}

AlbumCard.propTypes = {
  album: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    description: PropTypes.string,
    genre: PropTypes.string,
    releaseYear: PropTypes.number,
    coverImage: PropTypes.string,
  }).isRequired,
}

export default AlbumCard

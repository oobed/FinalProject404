import { useNavigate } from 'react-router-dom'
import { Badge } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Card from './Card'

function SongCard({ song, showAlbum = false }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/songs/${song.id}`)
  }

  const footer = (
    <div className="d-flex justify-content-between align-items-center">
      <small className="text-muted">Duration: {song.duration}</small>
      {showAlbum && song.albumId && (
        <Badge bg="secondary">Track #{song.trackNumber}</Badge>
      )}
    </div>
  )

  return (
    <Card
      title={song.title}
      subtitle={song.artist}
      footer={footer}
      onClick={handleClick}
      className="song-card"
    />
  )
}

SongCard.propTypes = {
  song: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    duration: PropTypes.string,
    trackNumber: PropTypes.number,
    albumId: PropTypes.number,
  }).isRequired,
  showAlbum: PropTypes.bool,
}

export default SongCard

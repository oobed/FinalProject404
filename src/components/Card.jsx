import { Card as BootstrapCard } from 'react-bootstrap'
import PropTypes from 'prop-types'

function Card({ title, subtitle, body, footer, onClick, className = '' }) {
  return (
    <BootstrapCard
      className={`mb-3 ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <BootstrapCard.Body>
        {title && <BootstrapCard.Title>{title}</BootstrapCard.Title>}
        {subtitle && (
          <BootstrapCard.Subtitle className="mb-2 text-muted">
            {subtitle}
          </BootstrapCard.Subtitle>
        )}
        {body && <BootstrapCard.Text>{body}</BootstrapCard.Text>}
        {footer && <div className="mt-3">{footer}</div>}
      </BootstrapCard.Body>
    </BootstrapCard>
  )
}

Card.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  body: PropTypes.node,
  footer: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
}

export default Card

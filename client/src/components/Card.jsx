import React from 'react'

const Card = ({ title, children, headerAction, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {(title || headerAction) && (
        <div className="card-header">
          {title && <h3>{title}</h3>}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

export default Card

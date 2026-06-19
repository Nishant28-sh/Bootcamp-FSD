import { colorForGroup } from '../utils/seed'

export function GuestPill({ guest, groups, draggable = true, onClick, selected, onRemove }) {
  const color = colorForGroup(guest.group, groups)

  function handleDragStart(e) {
    e.dataTransfer.setData('text/guest-id', guest.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      className={`guest-pill${selected ? ' guest-pill--selected' : ''}`}
      draggable={draggable}
      onDragStart={handleDragStart}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.()
      }}
    >
      <span className="guest-pill__dot" style={{ background: color }} aria-hidden="true" />
      <span className="guest-pill__name">{guest.name}</span>
      <span className="guest-pill__group">{guest.group}</span>
      {onRemove && (
        <button
          className="guest-pill__remove"
          aria-label={`Remove ${guest.name}`}
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}

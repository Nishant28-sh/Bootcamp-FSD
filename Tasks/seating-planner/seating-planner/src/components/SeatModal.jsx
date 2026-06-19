import { useEffect, useRef, useState } from 'react'
import { colorForGroup } from '../utils/seed'

export function SeatModal({
  seat,
  fixture,
  guests,
  groups,
  seatedMap,
  onAssign,
  onUnseat,
  onClose,
}) {
  const [filter, setFilter] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const currentGuest = seat.guestId ? guests.find((g) => g.id === seat.guestId) : null

  const filtered = guests.filter(
    (g) =>
      g.name.toLowerCase().includes(filter.toLowerCase()) ||
      g.group.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Assign seat"
    >
      <div className="modal">
        <div className="modal__header">
          <div>
            <p className="modal__pretitle">{fixture.label}</p>
            <h2 className="modal__title">Assign guest</h2>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {currentGuest && (
          <div className="modal__current">
            <span
              className="modal__current-dot"
              style={{ background: colorForGroup(currentGuest.group, groups) }}
            />
            <span className="modal__current-name">{currentGuest.name}</span>
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => { onUnseat(currentGuest.id); onClose() }}
            >
              Remove
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          className="modal__search"
          placeholder="Search guests…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <div className="modal__list">
          {filtered.length === 0 && (
            <p className="empty-note">No guests match that search.</p>
          )}
          {filtered.map((guest) => {
            const isCurrent = guest.id === seat.guestId
            const color = colorForGroup(guest.group, groups)
            const isSeated = seatedMap.has(guest.id) && !isCurrent

            return (
              <button
                key={guest.id}
                className={`modal__guest-row${isCurrent ? ' modal__guest-row--current' : ''}${isSeated ? ' modal__guest-row--seated' : ''}`}
                onClick={() => {
                  onAssign(guest.id, fixture.id, seat.id)
                  onClose()
                }}
              >
                <span className="modal__guest-dot" style={{ background: color }} />
                <span className="modal__guest-name">{guest.name}</span>
                <span className="modal__guest-group">{guest.group}</span>
                {isCurrent && <span className="modal__guest-tag">Current</span>}
                {isSeated && <span className="modal__guest-tag modal__guest-tag--seated">Seated</span>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

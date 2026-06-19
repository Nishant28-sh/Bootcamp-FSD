import { colorForGroup } from '../utils/seed'

const SEAT_W = 36
const SEAT_H = 32
const GAP = 6
const HEADER_H = 28

export function RowFixture({
  fixture,
  guestMap,
  groups,
  selectedGuestId,
  onSeatClick,
  onSeatDrop,
  onFixtureClick,
  selected,
}) {
  const cols = Math.min(fixture.seats.length, 12)
  const rows = Math.ceil(fixture.seats.length / cols)
  const width = cols * (SEAT_W + GAP) - GAP + 24
  const height = rows * (SEAT_H + GAP) - GAP + HEADER_H + 24

  function handleDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  return (
    <div
      className={`fixture fixture--row${selected ? ' fixture--selected' : ''}`}
      style={{
        left: fixture.x,
        top: fixture.y,
        width,
        height,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onFixtureClick(fixture.id)
      }}
    >
      <div className="row-header">
        <span className="row-header__label">{fixture.label}</span>
        <span className="row-header__count">
          {fixture.seats.filter((s) => s.guestId).length}/{fixture.seats.length}
        </span>
      </div>
      <div
        className="row-seats"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${SEAT_W}px)`,
          gap: GAP,
          padding: '0 12px 12px 12px',
        }}
      >
        {fixture.seats.map((seat, i) => {
          const guest = seat.guestId ? guestMap.get(seat.guestId) : null
          const color = guest ? colorForGroup(guest.group, groups) : null
          const isHighlight = seat.guestId === selectedGuestId

          return (
            <div
              key={seat.id}
              className={`row-seat${guest ? ' row-seat--filled' : ' row-seat--empty'}${isHighlight ? ' row-seat--highlight' : ''}`}
              style={
                guest
                  ? { background: color + '22', borderColor: color }
                  : {}
              }
              title={guest ? guest.name : `Seat ${i + 1}`}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation()
                onSeatClick(fixture.id, seat.id, seat.guestId)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation()
                  onSeatClick(fixture.id, seat.id, seat.guestId)
                }
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                const guestId = e.dataTransfer.getData('text/guest-id')
                if (guestId) onSeatDrop(guestId, fixture.id, seat.id)
              }}
            >
              {guest ? (
                <span className="row-seat__initials">{initials(guest.name)}</span>
              ) : (
                <span className="row-seat__num">{i + 1}</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

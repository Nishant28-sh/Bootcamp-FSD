import { colorForGroup } from '../utils/seed'

// Seats are positioned around the circumference of the table circle.
// Radius is calculated from seat count so the table scales naturally.

const MIN_R = 72
const MAX_R = 130
const SEAT_R = 16

function seatRadius(seatCount) {
  return Math.max(MIN_R, Math.min(MAX_R, seatCount * 12))
}

export function RoundTable({
  fixture,
  guestMap,
  groups,
  selectedGuestId,
  onSeatClick,
  onSeatDrop,
  onFixtureClick,
  selected,
}) {
  const r = seatRadius(fixture.seats.length)
  const totalSize = (r + SEAT_R + 6) * 2

  function handleDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  return (
    <div
      className={`fixture fixture--round${selected ? ' fixture--selected' : ''}`}
      style={{
        left: fixture.x,
        top: fixture.y,
        width: totalSize,
        height: totalSize,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onFixtureClick(fixture.id)
      }}
    >
      <svg
        width={totalSize}
        height={totalSize}
        viewBox={`0 0 ${totalSize} ${totalSize}`}
        style={{ display: 'block', overflow: 'visible' }}
        aria-label={fixture.label}
      >
        {/* Table surface */}
        <circle
          cx={totalSize / 2}
          cy={totalSize / 2}
          r={r - 8}
          className="table-surface"
        />
        {/* Table label */}
        <text
          x={totalSize / 2}
          y={totalSize / 2 - 6}
          textAnchor="middle"
          className="table-label"
        >
          {fixture.label}
        </text>
        <text
          x={totalSize / 2}
          y={totalSize / 2 + 10}
          textAnchor="middle"
          className="table-sublabel"
        >
          {fixture.seats.filter((s) => s.guestId).length}/{fixture.seats.length}
        </text>

        {/* Seats around circumference */}
        {fixture.seats.map((seat, i) => {
          const angle = (2 * Math.PI * i) / fixture.seats.length - Math.PI / 2
          const cx = totalSize / 2 + r * Math.cos(angle)
          const cy = totalSize / 2 + r * Math.sin(angle)
          const guest = seat.guestId ? guestMap.get(seat.guestId) : null
          const color = guest ? colorForGroup(guest.group, groups) : null
          const isSelectedGuest = seat.guestId === selectedGuestId

          return (
            <g
              key={seat.id}
              transform={`translate(${cx}, ${cy})`}
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation()
                onSeatClick(fixture.id, seat.id, seat.guestId)
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                const guestId = e.dataTransfer.getData('text/guest-id')
                if (guestId) onSeatDrop(guestId, fixture.id, seat.id)
              }}
            >
              <circle
                r={SEAT_R}
                className={`seat-circle${guest ? ' seat-circle--filled' : ' seat-circle--empty'}${isSelectedGuest ? ' seat-circle--highlight' : ''}`}
                style={guest ? { fill: color + '22', stroke: color } : {}}
              />
              {guest && (
                <text textAnchor="middle" dominantBaseline="middle" className="seat-initials">
                  {initials(guest.name)}
                </text>
              )}
              {!guest && (
                <text textAnchor="middle" dominantBaseline="middle" className="seat-number">
                  {i + 1}
                </text>
              )}
            </g>
          )
        })}
      </svg>
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

import { useState, useEffect } from 'react'
import { colorForGroup } from '../utils/seed'

export function Inspector({
  fixture,
  selectedGuestId,
  guests,
  groups,
  seatedMap,
  onRenameFixture,
  onResizeFixture,
  onRemoveFixture,
  onUnseatGuest,
  onRemoveGuest,
  onRenameGuest,
}) {
  const [editLabel, setEditLabel] = useState('')
  const [editSeatCount, setEditSeatCount] = useState(0)
  const [editGuestName, setEditGuestName] = useState('')
  const [editGuestGroup, setEditGuestGroup] = useState('')

  const selectedGuest = selectedGuestId ? guests.find((g) => g.id === selectedGuestId) : null

  useEffect(() => {
    if (fixture) {
      setEditLabel(fixture.label)
      setEditSeatCount(fixture.seats.length)
    }
  }, [fixture])

  useEffect(() => {
    if (selectedGuest) {
      setEditGuestName(selectedGuest.name)
      setEditGuestGroup(selectedGuest.group)
    }
  }, [selectedGuest])

  if (!fixture && !selectedGuest) {
    return (
      <aside className="inspector inspector--empty">
        <p className="inspector-hint">Select a table, row, or guest to inspect.</p>
      </aside>
    )
  }

  if (selectedGuest) {
    const seatInfo = seatedMap.get(selectedGuest.id)
    const color = colorForGroup(selectedGuest.group, groups)

    return (
      <aside className="inspector">
        <div className="inspector__header">
          <span className="inspector__type">Guest</span>
        </div>

        <div className="inspector__group-dot-row">
          <span className="inspector__group-dot" style={{ background: color }} />
          <span className="inspector__group-name">{selectedGuest.group}</span>
        </div>

        <div className="inspector__field">
          <label>Name</label>
          <input
            type="text"
            value={editGuestName}
            onChange={(e) => setEditGuestName(e.target.value)}
            onBlur={() => {
              if (editGuestName.trim()) {
                onRenameGuest(selectedGuest.id, { name: editGuestName.trim() })
              }
            }}
          />
        </div>
        <div className="inspector__field">
          <label>Group</label>
          <input
            type="text"
            value={editGuestGroup}
            onChange={(e) => setEditGuestGroup(e.target.value)}
            list="group-suggestions"
            onBlur={() => {
              if (editGuestGroup.trim()) {
                onRenameGuest(selectedGuest.id, { group: editGuestGroup.trim() })
              }
            }}
          />
          <datalist id="group-suggestions">
            {groups.map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
        </div>

        <div className="inspector__stat-row">
          <span className="inspector__stat-label">Status</span>
          <span className={`inspector__stat-value${seatInfo ? ' inspector__stat-value--sage' : ' inspector__stat-value--terra'}`}>
            {seatInfo ? 'Seated' : 'Unassigned'}
          </span>
        </div>

        {seatInfo && (
          <button
            className="btn btn--ghost btn--full"
            onClick={() => onUnseatGuest(selectedGuest.id)}
          >
            Remove from seat
          </button>
        )}
        <button
          className="btn btn--danger btn--full"
          onClick={() => onRemoveGuest(selectedGuest.id)}
        >
          Remove guest
        </button>
      </aside>
    )
  }

  // Fixture inspector
  const filled = fixture.seats.filter((s) => s.guestId).length
  const kind = fixture.kind === 'round' ? 'Round table' : 'Theater row'

  return (
    <aside className="inspector">
      <div className="inspector__header">
        <span className="inspector__type">{kind}</span>
      </div>

      <div className="inspector__field">
        <label>Label</label>
        <input
          type="text"
          value={editLabel}
          onChange={(e) => setEditLabel(e.target.value)}
          onBlur={() => {
            if (editLabel.trim()) onRenameFixture(fixture.id, editLabel.trim())
          }}
        />
      </div>

      <div className="inspector__field">
        <label>Seats</label>
        <div className="seat-count-row">
          <button
            className="count-btn"
            onClick={() => {
              const next = Math.max(1, editSeatCount - 1)
              setEditSeatCount(next)
              onResizeFixture(fixture.id, next)
            }}
            aria-label="Remove seat"
          >−</button>
          <span className="count-display" style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 500 }}>{editSeatCount}</span>
          <button
            className="count-btn"
            onClick={() => {
              const next = Math.min(fixture.kind === 'round' ? 16 : 24, editSeatCount + 1)
              setEditSeatCount(next)
              onResizeFixture(fixture.id, next)
            }}
            aria-label="Add seat"
          >+</button>
        </div>
      </div>

      <div className="inspector__stat-row">
        <span className="inspector__stat-label">Filled</span>
        <span className="inspector__stat-value inspector__stat-value--sage">{filled} / {fixture.seats.length}</span>
      </div>
      <div className="inspector__stat-row">
        <span className="inspector__stat-label">Open</span>
        <span className="inspector__stat-value">{fixture.seats.length - filled}</span>
      </div>

      <div className="inspector__seat-preview">
        {fixture.seats.map((seat) => {
          const g = seat.guestId ? guests.find((g) => g.id === seat.guestId) : null
          const color = g ? colorForGroup(g.group, groups) : null
          return (
            <div
              key={seat.id}
              className={`inspector-seat-dot${g ? ' inspector-seat-dot--filled' : ''}`}
              style={g ? { background: color + '33', borderColor: color } : {}}
              title={g ? g.name : 'Empty'}
            />
          )
        })}
      </div>

      <button
        className="btn btn--danger btn--full"
        onClick={() => onRemoveFixture(fixture.id)}
      >
        Remove {fixture.kind === 'round' ? 'table' : 'row'}
      </button>
    </aside>
  )
}

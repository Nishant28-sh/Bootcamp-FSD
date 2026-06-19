import { useState } from 'react'
import { GuestPill } from './GuestPill'

export function Sidebar({
  unassignedGuests,
  groups,
  totals,
  onAddGuest,
  onAddBulk,
  onRemoveGuest,
  onSelectGuest,
  selectedGuestId,
}) {
  const [name, setName] = useState('')
  const [group, setGroup] = useState('')
  const [bulkOpen, setBulkOpen] = useState(false)
  const [bulkText, setBulkText] = useState('')
  const [filter, setFilter] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    if (!name.trim()) return
    onAddGuest(name.trim(), group.trim())
    setName('')
    setGroup('')
  }

  function handleBulkSubmit(e) {
    e.preventDefault()
    const lines = bulkText.split('\n')
    onAddBulk(lines)
    setBulkText('')
    setBulkOpen(false)
  }

  const filtered = unassignedGuests.filter((g) =>
    g.name.toLowerCase().includes(filter.toLowerCase())
  )

  const seatedCount = totals.totalGuests - unassignedGuests.length

  return (
    <aside className="sidebar">
      <div className="sidebar__section sidebar__section--summary">
        <div className="summary-row">
          <span className="summary-row__label">Guests</span>
          <span className="summary-row__value">{totals.totalGuests}</span>
        </div>
        <div className="summary-row">
          <span className="summary-row__label">Seated</span>
          <span className="summary-row__value summary-row__value--sage">{seatedCount}</span>
        </div>
        <div className="summary-row">
          <span className="summary-row__label">Seats available</span>
          <span className="summary-row__value">{totals.totalSeats - totals.filledSeats}</span>
        </div>
      </div>

      <div className="sidebar__section">
        <form className="add-guest-form" onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Guest name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Guest name"
          />
          <input
            type="text"
            placeholder="Group (optional)"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            list="group-suggestions"
            aria-label="Guest group"
          />
          <datalist id="group-suggestions">
            {groups.map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
          <button type="submit" className="btn btn--brass btn--full">
            Add guest
          </button>
        </form>
        <button
          className="btn-link"
          onClick={() => setBulkOpen((v) => !v)}
          type="button"
        >
          {bulkOpen ? 'Close bulk add' : 'Add multiple at once'}
        </button>
        {bulkOpen && (
          <form className="bulk-form" onSubmit={handleBulkSubmit}>
            <textarea
              rows={5}
              placeholder={'One per line: Name, Group\nAsha Mehra, VIP\nRohan Nair'}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
            />
            <button type="submit" className="btn btn--ghost btn--full">
              Add list
            </button>
          </form>
        )}
      </div>

      <div className="sidebar__section sidebar__section--grow">
        <div className="sidebar__section-header">
          <h3>Unassigned</h3>
          <span className="pill-count">{filtered.length}</span>
        </div>
        <input
          type="text"
          className="filter-input"
          placeholder="Filter by name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter unassigned guests"
        />
        <div className="guest-pool" role="list">
          {filtered.length === 0 && (
            <p className="empty-note">
              {unassignedGuests.length === 0
                ? 'Every guest has a seat.'
                : 'No names match that filter.'}
            </p>
          )}
          {filtered.map((guest) => (
            <GuestPill
              key={guest.id}
              guest={guest}
              groups={groups}
              selected={guest.id === selectedGuestId}
              onClick={() => onSelectGuest(guest.id === selectedGuestId ? null : guest.id)}
              onRemove={() => onRemoveGuest(guest.id)}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}

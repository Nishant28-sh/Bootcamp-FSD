import { useState } from 'react'

export function Toolbar({
  eventName,
  onRenameEvent,
  onAddTable,
  onAddRow,
  onAutoAssign,
  onClearSeats,
  onResetToSample,
  onStartBlank,
  unassignedCount,
  lastOverflowIds,
}) {
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(eventName)
  const [menuOpen, setMenuOpen] = useState(false)

  function commitName() {
    setEditingName(false)
    if (nameValue.trim()) onRenameEvent(nameValue.trim())
  }

  return (
    <header className="toolbar">
      <div className="toolbar__left">
        {editingName ? (
          <input
            className="toolbar__name-input"
            value={nameValue}
            autoFocus
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitName()
              if (e.key === 'Escape') setEditingName(false)
            }}
          />
        ) : (
          <button
            className="toolbar__name"
            onClick={() => {
              setNameValue(eventName)
              setEditingName(true)
            }}
            title="Click to rename event"
          >
            {eventName}
          </button>
        )}
      </div>

      <div className="toolbar__center">
        <button className="btn btn--ghost" onClick={onAddTable}>
          + Round table
        </button>
        <button className="btn btn--ghost" onClick={onAddRow}>
          + Theater row
        </button>
        <div className="toolbar__divider" />
        <button
          className="btn btn--brass"
          onClick={onAutoAssign}
          title={unassignedCount === 0 ? 'All guests are seated' : `Auto-assign ${unassignedCount} unassigned guests`}
        >
          Auto-assign
          {unassignedCount > 0 && <span className="badge">{unassignedCount}</span>}
        </button>
        {lastOverflowIds.length > 0 && (
          <span className="overflow-badge" role="alert">
            {lastOverflowIds.length} guest{lastOverflowIds.length > 1 ? 's' : ''} could not be placed — add more seats
          </span>
        )}
        <button className="btn btn--ghost" onClick={onClearSeats} title="Clear all seat assignments">
          Clear seats
        </button>
      </div>

      <div className="toolbar__right">
        <div className="menu-wrapper">
          <button
            className="btn btn--icon"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="More options"
            aria-expanded={menuOpen}
          >
            ···
          </button>
          {menuOpen && (
            <div className="dropdown" role="menu">
              <button
                className="dropdown__item"
                role="menuitem"
                onClick={() => { onResetToSample(); setMenuOpen(false) }}
              >
                Load sample event
              </button>
              <button
                className="dropdown__item dropdown__item--danger"
                role="menuitem"
                onClick={() => { onStartBlank(); setMenuOpen(false) }}
              >
                Start blank
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

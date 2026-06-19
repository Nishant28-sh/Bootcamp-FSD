import { useState } from 'react'
import { useSeatingStore } from './hooks/useSeatingStore'
import { Toolbar } from './components/Toolbar'
import { Sidebar } from './components/Sidebar'
import { Canvas } from './components/Canvas'
import { Inspector } from './components/Inspector'
import { SeatModal } from './components/SeatModal'
import './App.css'

export default function App() {
  const store = useSeatingStore()
  const [seatModal, setSeatModal] = useState(null) // { seat, fixture }

  function handleSeatClick(fixtureId, seatId, currentGuestId) {
    const fixture = store.event.fixtures.find((f) => f.id === fixtureId)
    const seat = fixture?.seats.find((s) => s.id === seatId)
    if (!fixture || !seat) return

    // If a guest is selected in the sidebar → assign them directly
    if (store.selectedGuestId) {
      store.swapOrMoveGuests(store.selectedGuestId, fixtureId, seatId)
      store.setSelectedGuestId(null)
      return
    }

    // Otherwise open the assignment modal
    setSeatModal({ seat, fixture })
  }

  function handleSeatDrop(guestId, fixtureId, seatId) {
    store.swapOrMoveGuests(guestId, fixtureId, seatId)
  }

  function closeSeatModal() {
    setSeatModal(null)
  }

  const selectedFixture = store.selectedFixtureId
    ? store.event.fixtures.find((f) => f.id === store.selectedFixtureId) ?? null
    : null

  return (
    <div className="app">
      <Toolbar
        eventName={store.event.name}
        onRenameEvent={store.renameEvent}
        onAddTable={store.addTable}
        onAddRow={store.addRow}
        onAutoAssign={store.runAutoAssign}
        onClearSeats={store.clearAllSeats}
        onResetToSample={store.resetToSample}
        onStartBlank={store.startBlank}
        unassignedCount={store.unassignedGuests.length}
        lastOverflowIds={store.lastOverflowIds}
      />

      <div className="workspace">
        <Sidebar
          unassignedGuests={store.unassignedGuests}
          groups={store.groups}
          totals={store.totals}
          onAddGuest={store.addGuest}
          onAddBulk={store.addGuestsBulk}
          onRemoveGuest={store.removeGuest}
          onSelectGuest={store.setSelectedGuestId}
          selectedGuestId={store.selectedGuestId}
        />

        <Canvas
          fixtures={store.event.fixtures}
          guests={store.event.guests}
          groups={store.groups}
          seatedMap={store.seatedMap}
          selectedGuestId={store.selectedGuestId}
          selectedFixtureId={store.selectedFixtureId}
          onFixtureClick={(id) =>
            store.setSelectedFixtureId(store.selectedFixtureId === id ? null : id)
          }
          onSeatClick={handleSeatClick}
          onSeatDrop={handleSeatDrop}
          onFixtureMove={store.moveFixture}
          onCanvasClick={() => {
            store.setSelectedFixtureId(null)
            store.setSelectedGuestId(null)
          }}
        />

        <Inspector
          fixture={selectedFixture}
          selectedGuestId={store.selectedGuestId}
          guests={store.event.guests}
          groups={store.groups}
          seatedMap={store.seatedMap}
          onRenameFixture={store.renameFixture}
          onResizeFixture={store.resizeFixture}
          onRemoveFixture={store.removeFixture}
          onUnseatGuest={store.unseatGuest}
          onRemoveGuest={store.removeGuest}
          onRenameGuest={store.renameGuest}
        />
      </div>

      {seatModal && (
        <SeatModal
          seat={seatModal.seat}
          fixture={seatModal.fixture}
          guests={store.event.guests}
          groups={store.groups}
          seatedMap={store.seatedMap}
          onAssign={store.swapOrMoveGuests}
          onUnseat={store.unseatGuest}
          onClose={closeSeatModal}
        />
      )}
    </div>
  )
}

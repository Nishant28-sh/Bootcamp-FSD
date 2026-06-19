import { useCallback, useRef, useState } from 'react'
import { RoundTable } from './RoundTable'
import { RowFixture } from './RowFixture'

export function Canvas({
  fixtures,
  guests,
  groups,
  seatedMap,
  selectedGuestId,
  selectedFixtureId,
  onFixtureClick,
  onSeatClick,
  onSeatDrop,
  onFixtureMove,
  onCanvasClick,
}) {
  const canvasRef = useRef(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [draggingFixture, setDraggingFixture] = useState(null) // { id, startMX, startMY, startFX, startFY }

  const guestMap = new Map(guests.map((g) => [g.id, g]))

  // ---- fixture drag (move on canvas) ----
  const handleFixtureMouseDown = useCallback(
    (e, fixtureId) => {
      if (e.button !== 0) return
      if (e.target.closest('[data-seat]')) return // seats handle their own clicks
      e.stopPropagation()
      const fixture = fixtures.find((f) => f.id === fixtureId)
      if (!fixture) return
      setDraggingFixture({
        id: fixtureId,
        startMX: e.clientX,
        startMY: e.clientY,
        startFX: fixture.x,
        startFY: fixture.y,
      })
    },
    [fixtures]
  )

  const handleMouseMove = useCallback(
    (e) => {
      if (!draggingFixture) return
      const dx = e.clientX - draggingFixture.startMX
      const dy = e.clientY - draggingFixture.startMY
      onFixtureMove(
        draggingFixture.id,
        Math.max(0, draggingFixture.startFX + dx),
        Math.max(0, draggingFixture.startFY + dy)
      )
    },
    [draggingFixture, onFixtureMove]
  )

  const handleMouseUp = useCallback(() => {
    setDraggingFixture(null)
  }, [])

  // ---- canvas pan ----
  const panStartRef = useRef(null)

  const handleCanvasMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    if (e.target !== canvasRef.current && e.target !== canvasRef.current.querySelector('.canvas-inner')) return
    panStartRef.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y }
  }, [pan])

  const handleCanvasMouseMove = useCallback((e) => {
    if (!panStartRef.current) return
    if (draggingFixture) return
    const dx = e.clientX - panStartRef.current.mx
    const dy = e.clientY - panStartRef.current.my
    setPan({ x: panStartRef.current.px + dx, y: panStartRef.current.py + dy })
  }, [draggingFixture])

  const handleCanvasMouseUp = useCallback(() => {
    panStartRef.current = null
  }, [])

  // ---- canvas drop (from guest pool) ----
  function handleCanvasDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const noFixtures = fixtures.length === 0

  return (
    <div
      className={`canvas${draggingFixture ? ' canvas--dragging' : ''}`}
      ref={canvasRef}
      onMouseMove={(e) => { handleMouseMove(e); handleCanvasMouseMove(e) }}
      onMouseUp={(e) => { handleMouseUp(); handleCanvasMouseUp() }}
      onMouseLeave={() => { setDraggingFixture(null); panStartRef.current = null }}
      onMouseDown={handleCanvasMouseDown}
      onDragOver={handleCanvasDragOver}
      onClick={() => onCanvasClick()}
    >
      <div
        className="canvas-inner"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
      >
        {noFixtures && (
          <div className="canvas-empty">
            <p className="canvas-empty__headline">No fixtures yet</p>
            <p className="canvas-empty__sub">Add a round table or theater row using the toolbar above.</p>
          </div>
        )}
        {fixtures.map((fixture) => {
          const isSelected = fixture.id === selectedFixtureId
          const commonProps = {
            key: fixture.id,
            fixture,
            guestMap,
            groups,
            selectedGuestId,
            selected: isSelected,
            onSeatClick,
            onSeatDrop,
            onFixtureClick: (id) => {
              onFixtureClick(id)
            },
          }

          const wrapper = (children) => (
            <div
              key={fixture.id}
              className="fixture-mover"
              style={{ position: 'absolute', left: 0, top: 0 }}
              onMouseDown={(e) => handleFixtureMouseDown(e, fixture.id)}
            >
              {children}
            </div>
          )

          if (fixture.kind === 'round') {
            return wrapper(<RoundTable {...commonProps} />)
          }
          return wrapper(<RowFixture {...commonProps} />)
        })}
      </div>
    </div>
  )
}

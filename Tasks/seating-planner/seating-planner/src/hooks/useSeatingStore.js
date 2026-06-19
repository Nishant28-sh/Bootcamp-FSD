import { useCallback, useEffect, useMemo, useState } from 'react'
import { makeId } from '../utils/id'
import { createRoundTable, createRow, createGuest, sampleEvent, emptyEvent } from '../utils/seed'
import { autoAssign } from '../utils/autoAssign'

const STORAGE_KEY = 'seating-planner:event:v1'

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore corrupted storage, fall through to sample
  }
  return sampleEvent()
}

export function useSeatingStore() {
  const [event, setEvent] = useState(loadInitial)
  const [selectedFixtureId, setSelectedFixtureId] = useState(null)
  const [selectedGuestId, setSelectedGuestId] = useState(null)
  const [lastOverflowIds, setLastOverflowIds] = useState([])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(event))
    } catch {
      // storage might be full or unavailable; fail silently, app still works in-session
    }
  }, [event])

  const seatedMap = useMemo(() => {
    const map = new Map()
    for (const fixture of event.fixtures) {
      for (const seat of fixture.seats) {
        if (seat.guestId) map.set(seat.guestId, { fixtureId: fixture.id, seatId: seat.id })
      }
    }
    return map
  }, [event.fixtures])

  const unassignedGuests = useMemo(
    () => event.guests.filter((g) => !seatedMap.has(g.id)),
    [event.guests, seatedMap]
  )

  const groups = useMemo(() => {
    const set = new Set(event.guests.map((g) => g.group))
    return [...set]
  }, [event.guests])

  const totals = useMemo(() => {
    const totalSeats = event.fixtures.reduce((sum, f) => sum + f.seats.length, 0)
    const filledSeats = event.fixtures.reduce(
      (sum, f) => sum + f.seats.filter((s) => s.guestId).length,
      0
    )
    return { totalSeats, filledSeats, totalGuests: event.guests.length }
  }, [event.fixtures, event.guests])

  // ---- mutations ----

  const renameEvent = useCallback((name) => {
    setEvent((prev) => ({ ...prev, name }))
  }, [])

  const addTable = useCallback(() => {
    setEvent((prev) => {
      const n = prev.fixtures.filter((f) => f.kind === 'round').length + 1
      const offset = prev.fixtures.length * 24
      const table = createRoundTable({
        label: `Table ${n}`,
        seatCount: 8,
        x: 140 + (offset % 320),
        y: 120 + Math.floor(offset / 320) * 40,
      })
      return { ...prev, fixtures: [...prev.fixtures, table] }
    })
  }, [])

  const addRow = useCallback(() => {
    setEvent((prev) => {
      const n = prev.fixtures.filter((f) => f.kind === 'row').length + 1
      const offset = prev.fixtures.length * 24
      const row = createRow({
        label: `Row ${String.fromCharCode(65 + ((n - 1) % 26))}`,
        seatCount: 10,
        x: 700,
        y: 140 + offset,
      })
      return { ...prev, fixtures: [...prev.fixtures, row] }
    })
  }, [])

  const removeFixture = useCallback((fixtureId) => {
    setEvent((prev) => ({ ...prev, fixtures: prev.fixtures.filter((f) => f.id !== fixtureId) }))
    setSelectedFixtureId((id) => (id === fixtureId ? null : id))
  }, [])

  const renameFixture = useCallback((fixtureId, label) => {
    setEvent((prev) => ({
      ...prev,
      fixtures: prev.fixtures.map((f) => (f.id === fixtureId ? { ...f, label } : f)),
    }))
  }, [])

  const resizeFixture = useCallback((fixtureId, newCount) => {
    setEvent((prev) => ({
      ...prev,
      fixtures: prev.fixtures.map((f) => {
        if (f.id !== fixtureId) return f
        const current = f.seats.length
        if (newCount === current) return f
        if (newCount > current) {
          const added = Array.from({ length: newCount - current }, () => ({
            id: makeId('seat'),
            guestId: null,
          }))
          return { ...f, seats: [...f.seats, ...added] }
        }
        // shrinking: drop empty seats first, then occupied ones from the end
        const seats = [...f.seats]
        const empties = seats.filter((s) => !s.guestId)
        const occupied = seats.filter((s) => s.guestId)
        const keep = [...occupied, ...empties].slice(0, newCount)
        return { ...f, seats: keep }
      }),
    }))
  }, [])

  const moveFixture = useCallback((fixtureId, x, y) => {
    setEvent((prev) => ({
      ...prev,
      fixtures: prev.fixtures.map((f) => (f.id === fixtureId ? { ...f, x, y } : f)),
    }))
  }, [])

  const assignGuestToSeat = useCallback((guestId, fixtureId, seatId) => {
    setEvent((prev) => ({
      ...prev,
      fixtures: prev.fixtures.map((f) => {
        // clear the guest from wherever they currently sit
        let seats = f.seats.map((s) => (s.guestId === guestId ? { ...s, guestId: null } : s))
        if (f.id === fixtureId) {
          seats = seats.map((s) => (s.id === seatId ? { ...s, guestId } : s))
        }
        return { ...f, seats }
      }),
    }))
  }, [])

  const unseatGuest = useCallback((guestId) => {
    setEvent((prev) => ({
      ...prev,
      fixtures: prev.fixtures.map((f) => ({
        ...f,
        seats: f.seats.map((s) => (s.guestId === guestId ? { ...s, guestId: null } : s)),
      })),
    }))
  }, [])

  const swapOrMoveGuests = useCallback((draggedGuestId, targetFixtureId, targetSeatId) => {
    setEvent((prev) => {
      let draggedFrom = null
      let targetOccupant = null
      for (const f of prev.fixtures) {
        for (const s of f.seats) {
          if (s.guestId === draggedGuestId) draggedFrom = { fixtureId: f.id, seatId: s.id }
          if (f.id === targetFixtureId && s.id === targetSeatId) targetOccupant = s.guestId
        }
      }

      return {
        ...prev,
        fixtures: prev.fixtures.map((f) => ({
          ...f,
          seats: f.seats.map((s) => {
            if (f.id === targetFixtureId && s.id === targetSeatId) {
              return { ...s, guestId: draggedGuestId }
            }
            if (draggedFrom && f.id === draggedFrom.fixtureId && s.id === draggedFrom.seatId) {
              return { ...s, guestId: targetOccupant ?? null }
            }
            return s
          }),
        })),
      }
    })
  }, [])

  const addGuest = useCallback((name, group) => {
    setEvent((prev) => ({
      ...prev,
      guests: [...prev.guests, createGuest({ name, group: group || 'Unsorted' })],
    }))
  }, [])

  const addGuestsBulk = useCallback((lines) => {
    setEvent((prev) => {
      const newGuests = lines
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [name, group] = line.split(',').map((p) => p.trim())
          return createGuest({ name, group: group || 'Unsorted' })
        })
      return { ...prev, guests: [...prev.guests, ...newGuests] }
    })
  }, [])

  const removeGuest = useCallback((guestId) => {
    setEvent((prev) => ({
      ...prev,
      guests: prev.guests.filter((g) => g.id !== guestId),
      fixtures: prev.fixtures.map((f) => ({
        ...f,
        seats: f.seats.map((s) => (s.guestId === guestId ? { ...s, guestId: null } : s)),
      })),
    }))
    setSelectedGuestId((id) => (id === guestId ? null : id))
  }, [])

  const renameGuest = useCallback((guestId, patch) => {
    setEvent((prev) => ({
      ...prev,
      guests: prev.guests.map((g) => (g.id === guestId ? { ...g, ...patch } : g)),
    }))
  }, [])

  const runAutoAssign = useCallback(() => {
    setEvent((prev) => {
      const { fixtures, overflowIds } = autoAssign(prev.fixtures, prev.guests)
      setLastOverflowIds(overflowIds)
      return { ...prev, fixtures }
    })
  }, [])

  const clearAllSeats = useCallback(() => {
    setEvent((prev) => ({
      ...prev,
      fixtures: prev.fixtures.map((f) => ({
        ...f,
        seats: f.seats.map((s) => ({ ...s, guestId: null })),
      })),
    }))
    setLastOverflowIds([])
  }, [])

  const resetToSample = useCallback(() => {
    setEvent(sampleEvent())
    setLastOverflowIds([])
    setSelectedFixtureId(null)
    setSelectedGuestId(null)
  }, [])

  const startBlank = useCallback(() => {
    setEvent(emptyEvent())
    setLastOverflowIds([])
    setSelectedFixtureId(null)
    setSelectedGuestId(null)
  }, [])

  return {
    event,
    groups,
    totals,
    seatedMap,
    unassignedGuests,
    selectedFixtureId,
    setSelectedFixtureId,
    selectedGuestId,
    setSelectedGuestId,
    lastOverflowIds,
    renameEvent,
    addTable,
    addRow,
    removeFixture,
    renameFixture,
    resizeFixture,
    moveFixture,
    assignGuestToSeat,
    unseatGuest,
    swapOrMoveGuests,
    addGuest,
    addGuestsBulk,
    removeGuest,
    renameGuest,
    runAutoAssign,
    clearAllSeats,
    resetToSample,
    startBlank,
  }
}

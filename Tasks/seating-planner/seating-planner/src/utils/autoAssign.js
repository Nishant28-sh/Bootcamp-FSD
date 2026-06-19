// Auto-assign: places unseated guests into open seats, trying to keep each
// group contiguous within a single fixture (table or row) when capacity
// allows, before spilling a group across multiple fixtures.
//
// Strategy:
// 1. Compute open seats per fixture (in seat order) and current occupancy.
// 2. Group unassigned guests by `group`, largest group first (harder to place).
// 3. For each group, try to find a single fixture with enough contiguous
//    open seats. If none fits the whole group, fill greedily across
//    fixtures with the most remaining open seats first.
// 4. Returns a new fixtures array (immutable) and a list of guestIds that
//    could not be placed (overflow).

export function autoAssign(fixtures, guests) {
  const seatedGuestIds = new Set(
    fixtures.flatMap((f) => f.seats.map((s) => s.guestId).filter(Boolean))
  )
  const unassigned = guests.filter((g) => !seatedGuestIds.has(g.id))

  // deep clone fixtures so we can mutate freely
  const working = fixtures.map((f) => ({ ...f, seats: f.seats.map((s) => ({ ...s })) }))

  const groupsMap = new Map()
  for (const guest of unassigned) {
    if (!groupsMap.has(guest.group)) groupsMap.set(guest.group, [])
    groupsMap.get(guest.group).push(guest)
  }
  const orderedGroups = [...groupsMap.entries()].sort((a, b) => b[1].length - a[1].length)

  const openSeatCount = (fixture) => fixture.seats.filter((s) => !s.guestId).length

  const placeInFixture = (fixture, guestsToPlace) => {
    let placedCount = 0
    for (const seat of fixture.seats) {
      if (placedCount >= guestsToPlace.length) break
      if (!seat.guestId) {
        seat.guestId = guestsToPlace[placedCount].id
        placedCount += 1
      }
    }
    return placedCount
  }

  const overflow = []

  for (const [, groupGuests] of orderedGroups) {
    let remaining = [...groupGuests]

    // try to find one fixture that can hold the whole group
    working.sort((a, b) => openSeatCount(b) - openSeatCount(a))
    const wholeFit = working.find((f) => openSeatCount(f) >= remaining.length)

    if (wholeFit) {
      placeInFixture(wholeFit, remaining)
      continue
    }

    // otherwise spill across fixtures, biggest open seat count first
    while (remaining.length > 0) {
      working.sort((a, b) => openSeatCount(b) - openSeatCount(a))
      const target = working[0]
      if (!target || openSeatCount(target) === 0) {
        overflow.push(...remaining)
        remaining = []
        break
      }
      const placed = placeInFixture(target, remaining)
      remaining = remaining.slice(placed)
    }
  }

  return { fixtures: working, overflowIds: overflow.map((g) => g.id) }
}

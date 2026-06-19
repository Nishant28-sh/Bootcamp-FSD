import { makeId } from './id'

// A "fixture" is one physical thing on the floor: a round table or a row of
// theater seats. Both share a shape: an array of seats, each seat either
// empty or holding a guestId.

export function createRoundTable({ label, seatCount = 8, x = 200, y = 200 }) {
  return {
    id: makeId('table'),
    kind: 'round',
    label,
    x,
    y,
    seats: Array.from({ length: seatCount }, () => ({ id: makeId('seat'), guestId: null })),
  }
}

export function createRow({ label, seatCount = 10, x = 200, y = 200 }) {
  return {
    id: makeId('row'),
    kind: 'row',
    label,
    x,
    y,
    seats: Array.from({ length: seatCount }, () => ({ id: makeId('seat'), guestId: null })),
  }
}

export function createGuest({ name, group = 'Unsorted', note = '' }) {
  return { id: makeId('guest'), name, group, note }
}

const GROUP_PALETTE = ['#9c7a3c', '#6f8a63', '#7d6b9e', '#3f7d8c', '#b65c3f', '#9c5c7a']

export function colorForGroup(groupName, groups) {
  const idx = groups.indexOf(groupName)
  if (idx === -1) return '#948e84'
  return GROUP_PALETTE[idx % GROUP_PALETTE.length]
}

export function emptyEvent() {
  return {
    name: 'Untitled event',
    fixtures: [],
    guests: [],
  }
}

export function sampleEvent() {
  const fixtures = [
    createRoundTable({ label: 'Table 1', seatCount: 8, x: 140, y: 120 }),
    createRoundTable({ label: 'Table 2', seatCount: 8, x: 420, y: 120 }),
    createRoundTable({ label: 'Table 3', seatCount: 6, x: 140, y: 380 }),
    createRow({ label: 'Row A', seatCount: 10, x: 700, y: 140 }),
    createRow({ label: 'Row B', seatCount: 10, x: 700, y: 280 }),
  ]

  const names = [
    ['Asha Mehra', "Bride's family"],
    ['Vikram Mehra', "Bride's family"],
    ['Leela Nair', "Bride's family"],
    ['Rohan Nair', "Bride's family"],
    ['Priya Kapoor', "Groom's family"],
    ['Arjun Kapoor', "Groom's family"],
    ['Simran Kapoor', "Groom's family"],
    ['Karan Bedi', "Groom's family"],
    ['Nisha Rao', 'College friends'],
    ['Tarun Rao', 'College friends'],
    ['Diya Sen', 'College friends'],
    ['Aman Sen', 'College friends'],
    ['Meera Iyer', 'Work colleagues'],
    ['Sahil Iyer', 'Work colleagues'],
    ['Ritu Joshi', 'Work colleagues'],
    ['Kabir Joshi', 'Work colleagues'],
    ['Ananya Verma', 'VIP'],
    ['Dev Verma', 'VIP'],
  ]

  const guests = names.map(([name, group]) => createGuest({ name, group }))

  return { name: 'Asha & Karan — Reception', fixtures, guests }
}

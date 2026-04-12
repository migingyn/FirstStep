import type { Event } from '@/data/mockData'

function parseTime(timeStr: string): { start: string; end: string } {
  // Handle "5:00 PM – 7:00 PM" or "5:00 PM - 7:00 PM"
  const parts = timeStr.split(/[–-]/).map((s) => s.trim())
  return { start: parts[0] ?? '', end: parts[1] ?? '' }
}

function timeToHoursMinutes(timeStr: string): { hours: number; minutes: number } {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!match) return { hours: 0, minutes: 0 }
  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const period = match[3].toUpperCase()
  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  return { hours, minutes }
}

function formatICSDate(date: string, time: string): string {
  const { hours, minutes } = timeToHoursMinutes(time)
  const d = new Date(date)
  d.setHours(hours, minutes, 0, 0)
  return d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
}

export function generateICS(event: Event): void {
  const { start, end } = parseTime(event.time)
  const dtStart = formatICSDate(event.date, start)
  const dtEnd = formatICSDate(event.date, end)
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FirstStep//UCSD Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:firststep-${event.id}@ucsd.edu`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    `ORGANIZER;CN=${event.organizer}:mailto:events@ucsd.edu`,
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${event.title} starts in 30 minutes`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function getGoogleCalendarUrl(event: Event): string {
  const { start, end } = parseTime(event.time)
  const dtStart = formatICSDate(event.date, start)
  const dtEnd = formatICSDate(event.date, end)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${dtStart}/${dtEnd}`,
    details: event.description,
    location: event.location,
    sf: 'true',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function formatDuration(seconds: number): string {
  if (!seconds && seconds !== 0) return "--:--:--"

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    secs.toString().padStart(2, "0"),
  ].join(":")
}

export function formatDurationHoursMinutes(seconds: number): string {
  if (!seconds && seconds !== 0) return "--:--"

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  return `${hours}h ${minutes}m`
}

export function formatDurationDecimal(seconds: number): string {
  if (!seconds && seconds !== 0) return "0.00"

  const hours = seconds / 3600
  return hours.toFixed(2)
}

export function formatTime(date: Date | null): string {
  if (!date) return "--:--"

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatDate(date: Date | string): string {
  if (!date) return ""

  const dateObj = typeof date === "string" ? new Date(date) : date

  return dateObj.toLocaleDateString([], {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDateShort(date: Date | string): string {
  if (!date) return ""

  const dateObj = typeof date === "string" ? new Date(date) : date

  return dateObj.toLocaleDateString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}


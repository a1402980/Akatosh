"use client"

import { useState } from "react"
import { useTime } from "@/context/time-context"
import { formatDate, formatTime, formatDuration } from "@/utils/time-formatter"
import styles from "./export-time-data.module.css" // Using CSS module instead of SCSS

export default function ExportTimeData() {
  const { tasks, dailySummaries } = useTime()
  const [copied, setCopied] = useState(false)
  const [exportFormat, setExportFormat] = useState("simple")

  // Generate export text based on the selected format
  const generateExportText = () => {
    if (tasks.length === 0) return "No time data to export."

    // Sort tasks by date (newest first)
    const sortedTasks = [...tasks].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    if (exportFormat === "simple") {
      // Simple format: Date | Task | Duration | Start-End
      let exportText = "Date | Task | Duration | Time Range\n"
      exportText += "----------------------------------------\n"

      sortedTasks.forEach((task) => {
        const date = formatDate(task.date)
        const duration = formatDuration(task.duration || 0)
        const startTime = formatTime(new Date(task.startTime))
        const endTime = task.endTime ? formatTime(new Date(task.endTime)) : "In Progress"

        exportText += `${date} | ${task.name} | ${duration} | ${startTime}-${endTime}\n`
      })

      // Add daily summaries
      exportText += "\nDaily Summaries:\n"
      exportText += "----------------------------------------\n"

      Object.keys(dailySummaries)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        .forEach((date) => {
          const summary = dailySummaries[date]
          exportText += `${formatDate(date)}: Total time ${formatDuration(summary.totalTime)}\n`
        })

      return exportText
    } else if (exportFormat === "csv") {
      // CSV format: Date,Task,Description,Start,End,Duration
      let exportText = "Date,Task,Description,Start,End,Duration\n"

      sortedTasks.forEach((task) => {
        const date = task.date
        const startTime = new Date(task.startTime).toLocaleTimeString()
        const endTime = task.endTime ? new Date(task.endTime).toLocaleTimeString() : ""
        const duration = task.duration ? task.duration : ""
        const description = task.description ? task.description.replace(/,/g, ";") : ""

        exportText += `${date},"${task.name}","${description}",${startTime},${endTime},${duration}\n`
      })

      return exportText
    } else if (exportFormat === "detailed") {
      // Detailed format with more information
      let exportText = "AKATOSH TIME TRACKING EXPORT\n"
      exportText += "=============================\n\n"

      // Group tasks by date
      const tasksByDate: Record<string, typeof tasks> = {}

      sortedTasks.forEach((task) => {
        if (!tasksByDate[task.date]) {
          tasksByDate[task.date] = []
        }
        tasksByDate[task.date].push(task)
      })

      // Generate report for each date
      Object.keys(tasksByDate)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        .forEach((date) => {
          const dateTasks = tasksByDate[date]
          const summary = dailySummaries[date]

          exportText += `Date: ${formatDate(date)}\n`
          exportText += `Total Time: ${formatDuration(summary?.totalTime || 0)}\n`
          exportText += "-----------------------------\n"

          dateTasks.forEach((task) => {
            exportText += `Task: ${task.name}\n`
            if (task.description) {
              exportText += `Description: ${task.description}\n`
            }
            exportText += `Started: ${formatTime(new Date(task.startTime))}\n`
            if (task.endTime) {
              exportText += `Ended: ${formatTime(new Date(task.endTime))}\n`
            } else {
              exportText += "Status: In Progress\n"
            }
            exportText += `Duration: ${formatDuration(task.duration || 0)}\n`
            exportText += "-----------------------------\n"
          })

          exportText += "\n"
        })

      return exportText
    }

    return "No export format selected."
  }

  // Copy to clipboard
  const copyToClipboard = () => {
    const text = generateExportText()
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Export Time Data</h2>

      <div className={styles.formatSelector}>
        <label className={styles.formatLabel}>Export Format</label>
        <div className={styles.formatButtons}>
          <button
            onClick={() => setExportFormat("simple")}
            className={`${styles.formatButton} ${exportFormat === "simple" ? styles.active : ""}`}
          >
            Simple
          </button>
          <button
            onClick={() => setExportFormat("csv")}
            className={`${styles.formatButton} ${exportFormat === "csv" ? styles.active : ""}`}
          >
            CSV
          </button>
          <button
            onClick={() => setExportFormat("detailed")}
            className={`${styles.formatButton} ${exportFormat === "detailed" ? styles.active : ""}`}
          >
            Detailed
          </button>
        </div>
      </div>

      <div className={`${styles.preview} custom-scrollbar`}>
        <pre>{generateExportText()}</pre>
      </div>

      <button onClick={copyToClipboard} className={styles.copyButton}>
        {copied ? "Copied to Clipboard!" : "Copy to Clipboard"}
      </button>
    </div>
  )
}


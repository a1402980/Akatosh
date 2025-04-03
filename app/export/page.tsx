"use client"

import { useState } from "react"
import { useTime } from "@/context/time-context"
import Header from "@/components/header"
import { formatDate, formatDuration } from "@/utils/time-formatter"
import ExportTimeData from "@/components/export-time-data"
import styles from "./page.module.css" // Using CSS module instead of SCSS

export default function ExportPage() {
  const { dailySummaries } = useTime()
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Sort summaries by date (newest first)
  const sortedDates = Object.keys(dailySummaries).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  // Calculate total time for all days
  const totalTimeAllDays = Object.values(dailySummaries).reduce((total, summary) => total + summary.totalTime, 0)

  // Filter dates based on date range
  const filteredDates = sortedDates.filter((date) => {
    if (!startDate && !endDate) return true

    const currentDate = new Date(date)
    const start = startDate ? new Date(startDate) : new Date(0)
    const end = endDate ? new Date(endDate) : new Date(8640000000000000) // Max date

    return currentDate >= start && currentDate <= end
  })

  // Calculate total time for filtered days
  const totalTimeFiltered = filteredDates.reduce((total, date) => total + dailySummaries[date].totalTime, 0)

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.pageTitle}>Export Time Data</h1>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Time Summary</h2>

            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Total Days Tracked</span>
                <span className={styles.statValue}>{sortedDates.length}</span>
              </div>

              <div className={styles.stat}>
                <span className={styles.statLabel}>Total Time Tracked</span>
                <span className={styles.statValue}>{formatDuration(totalTimeAllDays)}</span>
              </div>
            </div>

            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>Filter Date Range</h3>
              <div className={styles.filterGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="startDate" className={styles.label}>
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="endDate" className={styles.label}>
                    End Date
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            {(startDate || endDate) && (
              <div className={styles.filterResults}>
                <h3 className={styles.filterResultsTitle}>Filtered Results</h3>
                <p className={styles.filterResultsText}>Showing data for {filteredDates.length} days</p>
                <p className={styles.filterResultsTotal}>Total Time: {formatDuration(totalTimeFiltered)}</p>
              </div>
            )}
          </div>

          <ExportTimeData />

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Daily Breakdown</h2>

            {filteredDates.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No data available for the selected date range.</p>
              </div>
            ) : (
              <ul className={styles.daysList}>
                {filteredDates.map((date) => {
                  const summary = dailySummaries[date]
                  return (
                    <li key={date} className={styles.dayItem}>
                      <div className={styles.dayHeader}>
                        <h3 className={styles.dayTitle}>{formatDate(date)}</h3>
                        <span className={styles.dayTotal}>{formatDuration(summary.totalTime)}</span>
                      </div>
                      <p className={styles.dayMeta}>{summary.tasks.length} tasks</p>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}


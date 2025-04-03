"use client"

import { useTime } from "@/context/time-context"
import Header from "@/components/header"
import { formatDate, formatDuration, formatTime } from "@/utils/time-formatter"
import styles from "./page.module.css" // Using CSS module instead of SCSS

export default function HistoryPage() {
  const { dailySummaries } = useTime()

  // Sort summaries by date (newest first)
  const sortedDates = Object.keys(dailySummaries).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.pageTitle}>Task History</h1>

          {sortedDates.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No task history available yet. Start tracking your time!</p>
            </div>
          ) : (
            <div className={styles.historyList}>
              {sortedDates.map((date) => {
                const summary = dailySummaries[date]
                return (
                  <div key={date} className={styles.dayCard}>
                    <div className={styles.dayHeader}>
                      <h2 className={styles.dayTitle}>{formatDate(date)}</h2>
                      <div className={styles.dayTotal}>Total: {formatDuration(summary.totalTime)}</div>
                    </div>

                    <ul className={styles.taskList}>
                      {summary.tasks.map((task) => (
                        <li key={task.id} className={styles.taskItem}>
                          <div className={styles.taskHeader}>
                            <h3 className={styles.taskName}>{task.name}</h3>
                            <div className={styles.taskTime}>{formatDuration(task.duration || 0)}</div>
                          </div>

                          {task.description && <p className={styles.taskDescription}>{task.description}</p>}

                          <div className={styles.taskTimes}>
                            <span>Started: {formatTime(new Date(task.startTime))}</span>
                            {task.endTime && <span>Ended: {formatTime(new Date(task.endTime))}</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


"use client"

import { useTime } from "@/context/time-context"
import { formatDuration } from "@/utils/time-formatter"
import styles from "./daily-summary.module.css" // Using CSS module instead of SCSS

export default function DailySummary() {
  const { getTodaysTotalTime, activeTasks } = useTime()
  const totalTime = getTodaysTotalTime()

  return (
    <div className={styles.container}>
      <div className={styles.summaryCard}>
        <h2 className={styles.title}>Daily Summary</h2>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Total Time</span>
            <span className={styles.statValue}>{formatDuration(totalTime)}</span>
          </div>

          <div className={styles.stat}>
            <span className={styles.statLabel}>Active Tasks</span>
            <span className={styles.statValue}>{activeTasks.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}


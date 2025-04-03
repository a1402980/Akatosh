"use client"

import { useTime } from "@/context/time-context"
import { formatDuration, formatTime } from "@/utils/time-formatter"
import styles from "./task-list.module.css" // Using CSS module instead of SCSS

export default function TaskList() {
  const { getTodaysTasks, stopTask, deleteTask, startTask } = useTime()
  const todaysTasks = getTodaysTasks()

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Today's Tasks</h2>

      {todaysTasks.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No tasks for today. Start tracking your time!</p>
        </div>
      ) : (
        <ul className={styles.taskList}>
          {todaysTasks.map((task) => (
            <li key={task.id} className={styles.taskItem}>
              <div className={styles.taskHeader}>
                <h3 className={styles.taskName}>{task.name}</h3>
                <div className={styles.taskTime}>{formatDuration(task.duration || 0)}</div>
              </div>

              {task.description && <p className={styles.taskDescription}>{task.description}</p>}

              <div className={styles.taskMeta}>
                <div className={styles.taskTimes}>
                  <span>Started: {formatTime(new Date(task.startTime))}</span>
                  {task.endTime && <span>Ended: {formatTime(new Date(task.endTime))}</span>}
                </div>

                <div className={styles.taskActions}>
                  {task.endTime ? (
                    <>
                      <button
                        onClick={() => startTask(task.id)}
                        className={`${styles.actionButton} ${styles.startButton}`}
                      >
                        Resume
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button onClick={() => stopTask(task.id)} className={`${styles.actionButton} ${styles.stopButton}`}>
                      Stop
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


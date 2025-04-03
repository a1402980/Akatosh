"use client"

import type React from "react"
import { useState } from "react"
import { useTime } from "@/context/time-context"
import styles from "./task-form.module.css" // Using CSS module instead of SCSS

export default function TaskForm() {
  const { addTask } = useTime()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return

    addTask({
      name,
      description,
      startTime: new Date(),
      endTime: null,
    })

    // Reset form
    setName("")
    setDescription("")
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Add New Task</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="taskName" className={styles.label}>
            Task Name
          </label>
          <input
            id="taskName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What are you working on?"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="taskDescription" className={styles.label}>
            Description (Optional)
          </label>
          <textarea
            id="taskDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about this task"
            className={styles.textarea}
            rows={3}
          />
        </div>

        <button type="submit" className={styles.button}>
          Start Task
        </button>
      </form>
    </div>
  )
}


"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Task {
  id: string
  name: string
  description: string
  startTime: Date
  endTime: Date | null
  duration: number | null
  date: string
}

interface DailySummary {
  date: string
  totalTime: number
  tasks: Task[]
}

interface TimeContextType {
  tasks: Task[]
  activeTasks: Task[]
  dailySummaries: Record<string, DailySummary>
  addTask: (task: Omit<Task, "id" | "date" | "duration">) => void
  startTask: (taskId: string) => void
  stopTask: (taskId: string) => void
  deleteTask: (taskId: string) => void
  getTodaysTasks: () => Task[]
  getTodaysTotalTime: () => number
}

const TimeContext = createContext<TimeContextType | undefined>(undefined)

export function TimeProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTasks, setActiveTasks] = useState<Task[]>([])
  const [dailySummaries, setDailySummaries] = useState<Record<string, DailySummary>>({})

  // Load data from localStorage on initial render
  useEffect(() => {
    if (typeof window === "undefined") return

    const storedTasks = localStorage.getItem("akatosh-tasks")
    const storedSummaries = localStorage.getItem("akatosh-summaries")

    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks)
        setTasks(
          parsedTasks.map((task: any) => ({
            ...task,
            startTime: new Date(task.startTime),
            endTime: task.endTime ? new Date(task.endTime) : null,
          })),
        )
      } catch (e) {
        console.error("Error parsing stored tasks", e)
      }
    }

    if (storedSummaries) {
      try {
        setDailySummaries(JSON.parse(storedSummaries))
      } catch (e) {
        console.error("Error parsing stored summaries", e)
      }
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return
    if (tasks.length > 0) {
      localStorage.setItem("akatosh-tasks", JSON.stringify(tasks))
    }
  }, [tasks])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (Object.keys(dailySummaries).length > 0) {
      localStorage.setItem("akatosh-summaries", JSON.stringify(dailySummaries))
    }
  }, [dailySummaries])

  // Update active tasks
  useEffect(() => {
    setActiveTasks(tasks.filter((task) => !task.endTime))
  }, [tasks])

  // Update durations for active tasks
  useEffect(() => {
    if (activeTasks.length === 0) return

    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (!task.endTime) {
            const duration = Math.floor((new Date().getTime() - new Date(task.startTime).getTime()) / 1000)
            return { ...task, duration }
          }
          return task
        }),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [activeTasks])

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = (): string => {
    return new Date().toISOString().split("T")[0]
  }

  // Add a new task
  const addTask = (task: Omit<Task, "id" | "date" | "duration">) => {
    const today = getTodayDate()
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...task,
      date: today,
      duration: 0,
    }

    setTasks((prevTasks) => [...prevTasks, newTask])

    // Update daily summary
    updateDailySummary(today)
  }

  // Start a task
  const startTask = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, startTime: new Date(), endTime: null, duration: 0 } : task,
      ),
    )
  }

  // Stop a task
  const stopTask = (taskId: string) => {
    const now = new Date()

    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const endTime = now
          const duration = Math.floor((endTime.getTime() - new Date(task.startTime).getTime()) / 1000)
          return { ...task, endTime, duration }
        }
        return task
      }),
    )

    // Update daily summary
    updateDailySummary(getTodayDate())
  }

  // Delete a task
  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((task) => task.id === taskId)
    if (!taskToDelete) return

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))

    // Update daily summary
    updateDailySummary(taskToDelete.date)
  }

  // Update daily summary
  const updateDailySummary = (date: string) => {
    const tasksForDay = tasks.filter((task) => task.date === date)

    const totalTime = tasksForDay.reduce((total, task) => {
      if (task.duration) {
        return total + task.duration
      }
      return total
    }, 0)

    setDailySummaries((prev) => ({
      ...prev,
      [date]: {
        date,
        totalTime,
        tasks: tasksForDay,
      },
    }))
  }

  // Get today's tasks
  const getTodaysTasks = (): Task[] => {
    const today = getTodayDate()
    return tasks.filter((task) => task.date === today)
  }

  // Get today's total time
  const getTodaysTotalTime = (): number => {
    const today = getTodayDate()
    const summary = dailySummaries[today]
    return summary ? summary.totalTime : 0
  }

  return (
    <TimeContext.Provider
      value={{
        tasks,
        activeTasks,
        dailySummaries,
        addTask,
        startTask,
        stopTask,
        deleteTask,
        getTodaysTasks,
        getTodaysTotalTime,
      }}
    >
      {children}
    </TimeContext.Provider>
  )
}

export function useTime() {
  const context = useContext(TimeContext)
  if (context === undefined) {
    throw new Error("useTime must be used within a TimeProvider")
  }
  return context
}


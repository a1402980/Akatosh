import Header from "@/components/header"
import TaskForm from "@/components/task-form"
import TaskList from "@/components/task-list"
import DailySummary from "@/components/daily-summary"
import ExportTimeData from "@/components/export-time-data"
import styles from "./page.module.css" // Using CSS module instead of SCSS

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <DailySummary />
          <ExportTimeData />
          <TaskForm />
          <TaskList />
        </div>
      </main>
    </div>
  )
}


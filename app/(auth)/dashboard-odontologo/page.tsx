import DentistDashboard from "@/components/DentistDashboard"
import QueryProvider from "../../(public)/providers/QueryProvider"

export default function DentistDashboardPage() {
  return (
    <QueryProvider>
      <DentistDashboard />
    </QueryProvider>
  )
}

import Dashboard from "@/components/Dashboard";
import QueryProvider from "../../../(public)/providers/QueryProvider";

export default function DashboardPage() {
    return (
        <QueryProvider>
            <Dashboard />
        </QueryProvider>
    );
}

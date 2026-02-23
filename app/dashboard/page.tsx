import DashboardViews from "@/components/DashboardViews";
import { getAllShifts, getToday } from "@/app/lib";

export default function DashboardPage() {
  return <DashboardViews shifts={getAllShifts()} today={getToday()} />;
}

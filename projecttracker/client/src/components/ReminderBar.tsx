import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Clock } from "lucide-react";

export function ReminderBar() {
  const { data: todayReminders = [] } = useQuery({
    queryKey: ["/api/reminders", "today"],
    queryFn: () => api.getReminders("today"),
  });

  const { data: overdueReminders = [] } = useQuery({
    queryKey: ["/api/reminders", "overdue"],
    queryFn: () => api.getReminders("overdue"),
  });

  const todayCount = todayReminders.length;
  const overdueCount = overdueReminders.length;

  if (todayCount === 0 && overdueCount === 0) {
    return null;
  }

  const reminderText = (() => {
    if (todayCount > 0 && overdueCount > 0) {
      return `You have ${todayCount} tasks due today • ${overdueCount} overdue`;
    } else if (todayCount > 0) {
      return `You have ${todayCount} task${todayCount > 1 ? 's' : ''} due today`;
    } else {
      return `You have ${overdueCount} overdue task${overdueCount > 1 ? 's' : ''}`;
    }
  })();

  return (
    <div className="sticky top-0 z-50 bg-vnx-blue text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">{reminderText}</span>
          </div>
          <button className="text-vnx-blue bg-white px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-100 transition-colors">
            View All
          </button>
        </div>
      </div>
    </div>
  );
}

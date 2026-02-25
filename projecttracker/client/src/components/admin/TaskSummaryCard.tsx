import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TaskSummaryCard() {
  const [summary, setSummary] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    const { data: tasks, error } = await supabase.from("tasks").select("*");
    if (error) {
      console.error("Error fetching tasks:", error);
      return;
    }

    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter((t) => t.status === "pending").length;
    const overdueTasks = tasks.filter(
      (t) => t.status === "pending" && new Date(t.due_date) < new Date()
    ).length;

    setSummary({ totalTasks, pendingTasks, overdueTasks });
  };

  return (
    <div className="mb-6 p-4 border rounded bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Task Overview</h3>
      <div className="flex justify-between text-sm">
        <div>Total Tasks: <strong>{summary.totalTasks}</strong></div>
        <div>Pending: <strong>{summary.pendingTasks}</strong></div>
        <div>Overdue: <strong className="text-red-600">{summary.overdueTasks}</strong></div>
      </div>
    </div>
  );
}
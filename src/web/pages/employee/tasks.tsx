import { useEffect, useState } from "react";
import { CheckCircle, Clock, AlertTriangle, Circle, X, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";

const statusColor: Record<string, string> = {
  completed: "status-completed", pending: "status-pending",
  in_progress: "status-in_progress", overdue: "status-overdue"
};
const catColor: Record<string, string> = {
  gst: "bg-green-100 text-green-700", itr: "bg-blue-100 text-blue-700",
  tds: "bg-yellow-100 text-yellow-700", audit: "bg-purple-100 text-purple-700",
  roc: "bg-orange-100 text-orange-700", general: "bg-gray-100 text-gray-600"
};
const priorityColor: Record<string, string> = {
  low: "bg-gray-100 text-gray-600", medium: "bg-blue-100 text-blue-600",
  high: "bg-orange-100 text-orange-700", urgent: "bg-red-100 text-red-700"
};

export default function EmployeeTasks() {
  const user = getUser();
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  const load = () => {
    if (!user) return;
    fetch(`/api/tasks?firmId=${user.firmId}&employeeId=${user.id}`).then(r => r.json()).then(setTasks);
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/tasks/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    toast.success("Status updated!"); load();
  };

  const filtered = tasks.filter(t => filter === "all" || t.status === filter);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-500 text-sm">{tasks.length} tasks assigned to you</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total", count: tasks.length, color: "border-purple-300" },
          { label: "Pending", count: tasks.filter(t => t.status === "pending").length, color: "border-yellow-300" },
          { label: "In Progress", count: tasks.filter(t => t.status === "in_progress").length, color: "border-blue-300" },
          { label: "Overdue", count: tasks.filter(t => t.status === "overdue").length, color: "border-red-300" },
        ].map((s, i) => (
          <div key={i} className={`bg-white rounded-xl p-3 border-l-4 ${s.color} shadow-sm text-center`}>
            <p className="text-xl font-bold text-gray-900">{s.count}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["all", "pending", "in_progress", "review", "completed", "overdue"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border
              ${filter === s ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"}`}>
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No tasks in this category</div>}
        {filtered.map(t => (
          <Card key={t.id} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className={`font-semibold ${t.status === "completed" ? "line-through text-gray-400" : "text-gray-900"}`}>{t.title}</h3>
                    {t.autoAssigned && (
                      <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                        <Zap className="w-3 h-3" /> AI Assigned
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${catColor[t.category] || "bg-gray-100"}`}>{t.category?.toUpperCase()}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${priorityColor[t.priority] || ""}`}>{t.priority}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[t.status] || ""}`}>{t.status?.replace("_", " ")}</span>
                    {t.dueDate && <span className="text-xs text-gray-400">📅 {new Date(t.dueDate).toLocaleDateString("en-IN")}</span>}
                    {t.billingAmount && <span className="text-xs text-green-600">₹{t.billingAmount.toLocaleString("en-IN")}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <select value={t.status} onChange={e => updateStatus(t.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-400">
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Send for Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

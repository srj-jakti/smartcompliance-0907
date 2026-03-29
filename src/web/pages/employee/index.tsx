import { useEffect, useState } from "react";
import { Link } from "wouter";
import { CheckSquare, Users, Clock, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getUser } from "@/lib/auth";

export default function EmployeeDashboard() {
  const user = getUser();
  const [tasks, setTasks] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/tasks?firmId=${user.firmId}&employeeId=${user.id}`).then(r => r.json()).then(setTasks);
    fetch(`/api/clients?firmId=${user.firmId}&employeeId=${user.id}`).then(r => r.json()).then(setClients);
    fetch(`/api/dashboard/stats?firmId=${user.firmId}&employeeId=${user.id}`).then(r => r.json()).then(setStats);
  }, []);

  const overdueTasks = tasks.filter(t => t.status === "overdue");
  const urgentTasks = tasks.filter(t => t.priority === "urgent" && t.status !== "completed");

  const statusColor: Record<string, string> = {
    completed: "status-completed", pending: "status-pending",
    in_progress: "status-in_progress", overdue: "status-overdue"
  };
  const catColor: Record<string, string> = {
    gst: "bg-green-100 text-green-700", itr: "bg-blue-100 text-blue-700",
    tds: "bg-yellow-100 text-yellow-700", audit: "bg-purple-100 text-purple-700",
    roc: "bg-orange-100 text-orange-700", general: "bg-gray-100 text-gray-600"
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hey, {user?.name?.split(" ")[0]}! 👋</h1>
        <p className="text-gray-500 text-sm">{user?.firmName} • {user?.empRole?.charAt(0).toUpperCase()}{user?.empRole?.slice(1)} • {user?.specialization?.toUpperCase()} Specialist</p>
      </div>

      {/* Alerts */}
      {(overdueTasks.length > 0 || urgentTasks.length > 0) && (
        <div className="mb-5 space-y-2">
          {overdueTasks.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700"><strong>{overdueTasks.length} task(s) overdue</strong> — immediate action needed!</p>
              <Link href="/employee/tasks" className="ml-auto text-xs text-red-600 hover:underline font-medium">View →</Link>
            </div>
          )}
          {urgentTasks.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <p className="text-sm text-orange-700"><strong>{urgentTasks.length} urgent task(s)</strong> need your attention</p>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Assigned Tasks", value: stats?.totalTasks || tasks.length, icon: CheckSquare, color: "text-purple-600", bg: "bg-purple-50", link: "/employee/tasks" },
          { label: "Pending", value: stats?.pendingTasks || tasks.filter(t => t.status === "pending").length, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50", link: "/employee/tasks" },
          { label: "My Clients", value: stats?.totalClients || clients.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50", link: "/employee/clients" },
          { label: "Completed", value: stats?.completedTasks || tasks.filter(t => t.status === "completed").length, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", link: "/employee/tasks" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <Link key={i} href={s.link}>
              <Card className="card-hover cursor-pointer border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                    </div>
                    <div className={`${s.bg} p-3 rounded-xl`}><Icon className={`w-5 h-5 ${s.color}`} /></div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Tasks */}
        <Card className="border-0 shadow-sm">
          <div className="flex items-center justify-between p-5 pb-3">
            <h3 className="font-semibold text-gray-900">My Tasks</h3>
            <Link href="/employee/tasks" className="text-purple-600 text-sm hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <CardContent className="pt-0 space-y-2">
            {tasks.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium flex-shrink-0 ${catColor[t.category] || "bg-gray-100 text-gray-600"}`}>{t.category?.toUpperCase()}</span>
                  <p className="text-sm font-medium text-gray-900 truncate">{t.title}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2 ${statusColor[t.status] || ""}`}>{t.status?.replace("_", " ")}</span>
              </div>
            ))}
            {tasks.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No tasks assigned yet</p>}
          </CardContent>
        </Card>

        {/* My Clients */}
        <Card className="border-0 shadow-sm">
          <div className="flex items-center justify-between p-5 pb-3">
            <h3 className="font-semibold text-gray-900">My Clients</h3>
            <Link href="/employee/clients" className="text-purple-600 text-sm hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <CardContent className="pt-0 space-y-2">
            {clients.slice(0, 5).map(c => (
              <div key={c.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm flex-shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.clientType} • {c.city}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{c.status}</span>
              </div>
            ))}
            {clients.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No clients assigned yet</p>}
          </CardContent>
        </Card>

        {/* Auto-Assigned Badge */}
        {tasks.filter(t => t.autoAssigned).length > 0 && (
          <div className="lg:col-span-2 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-purple-800">AI Auto-Assigned Tasks</p>
              <p className="text-sm text-purple-600">{tasks.filter(t => t.autoAssigned).length} task(s) were automatically assigned to you by the AI. Check your task list!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

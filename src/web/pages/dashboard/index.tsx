import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Users, CheckSquare, IndianRupee, Calendar, TrendingUp, AlertTriangle, Clock, Shield, ArrowRight, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUser } from "@/lib/auth";

interface Stats {
  totalClients: number; activeClients: number;
  totalTasks: number; pendingTasks: number; overdueTasks: number; completedTasks: number;
  totalRevenue: number; pendingAmount: number;
  upcomingCompliance: number; expiredDsc: number; expiringDsc: number; totalDsc: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [compliance, setCompliance] = useState<any[]>([]);

  const user = getUser();
  useEffect(() => {
    const fid = user?.firmId || "";
    fetch(`/api/dashboard/stats?firmId=${fid}`).then(r => r.json()).then(setStats);
    fetch(`/api/tasks?firmId=${fid}`).then(r => r.json()).then(t => setTasks(t.slice(0, 5)));
    fetch("/api/compliance").then(r => r.json()).then(c => setCompliance(c.slice(0, 5)));
  }, []);

  const statCards = stats ? [
    { title: "Total Clients", value: stats.totalClients, sub: `${stats.activeClients} active`, icon: Users, color: "text-blue-600", bg: "bg-blue-50", link: "/dashboard/clients" },
    { title: "Pending Tasks", value: stats.pendingTasks, sub: `${stats.overdueTasks} overdue`, icon: CheckSquare, color: "text-yellow-600", bg: "bg-yellow-50", link: "/dashboard/tasks" },
    { title: "Revenue Collected", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, sub: `₹${stats.pendingAmount.toLocaleString("en-IN")} pending`, icon: IndianRupee, color: "text-green-600", bg: "bg-green-50", link: "/dashboard/invoices" },
    { title: "Compliance Alerts", value: stats.upcomingCompliance, sub: "Due in 30 days", icon: Calendar, color: "text-red-600", bg: "bg-red-50", link: "/dashboard/compliance" },
  ] : [];

  const statusColor: Record<string, string> = {
    completed: "status-completed", pending: "status-pending",
    in_progress: "status-in_progress", overdue: "status-overdue", review: "status-review"
  };

  const categoryColor: Record<string, string> = {
    gst: "bg-green-100 text-green-700", itr: "bg-blue-100 text-blue-700",
    tds: "bg-yellow-100 text-yellow-700", audit: "bg-purple-100 text-purple-700",
    roc: "bg-orange-100 text-orange-700", general: "bg-gray-100 text-gray-700"
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good morning, CA! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening in your practice today.</p>
        </div>
        <Link href="/dashboard/tasks">
          <button className="btn-blue flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" /> New Task
          </button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <Link key={i} href={s.link}>
              <Card className="card-hover cursor-pointer border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{s.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                      <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
                    </div>
                    <div className={`${s.bg} p-3 rounded-xl`}>
                      <Icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Tasks</CardTitle>
              <Link href="/dashboard/tasks" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No tasks yet</p>}
              {tasks.map((t: any) => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{t.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${categoryColor[t.category] || "bg-gray-100 text-gray-600"}`}>
                        {t.category?.toUpperCase()}
                      </span>
                      {t.dueDate && <span className="text-xs text-gray-400">{new Date(t.dueDate).toLocaleDateString("en-IN")}</span>}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[t.status] || ""} ml-3`}>
                    {t.status?.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Calendar */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Upcoming Compliance</CardTitle>
              <Link href="/dashboard/compliance" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {compliance.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No upcoming deadlines</p>}
              {compliance.map((c: any) => {
                const due = new Date(c.dueDate);
                const today = new Date();
                const daysLeft = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const isUrgent = daysLeft <= 7;
                const isOverdue = daysLeft < 0;
                return (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {isUrgent || isOverdue ? (
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{c.title}</p>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${categoryColor[c.category?.toLowerCase()] || "bg-gray-100 text-gray-600"}`}>
                          {c.category?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <p className="text-sm font-semibold text-gray-900">{due.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                      <p className={`text-xs font-medium ${isOverdue ? "text-red-500" : isUrgent ? "text-orange-500" : "text-gray-400"}`}>
                        {isOverdue ? "Overdue" : `${daysLeft}d left`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: "/dashboard/clients", icon: Users, label: "Add Client", color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
                { href: "/dashboard/tasks", icon: CheckSquare, label: "New Task", color: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" },
                { href: "/dashboard/invoices", icon: IndianRupee, label: "Create Invoice", color: "bg-green-50 text-green-700 hover:bg-green-100" },
                { href: "/dashboard/ai", icon: Clock, label: "AI Assistant", color: "bg-purple-50 text-purple-700 hover:bg-purple-100" },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <Link key={i} href={action.href}>
                    <div className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${action.color}`}>
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{action.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* DSC Alerts */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">DSC Alerts</CardTitle>
              <Link href="/dashboard/dsc" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                Manage <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats && (
              <div className="space-y-3">
                {stats.expiredDsc > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                    <Shield className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm font-semibold text-red-700">{stats.expiredDsc} DSC Expired</p>
                      <p className="text-xs text-red-500">Immediate renewal required</p>
                    </div>
                  </div>
                )}
                {stats.expiringDsc > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-700">{stats.expiringDsc} DSC Expiring Soon</p>
                      <p className="text-xs text-yellow-500">Renew within 30 days</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Shield className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-semibold text-green-700">{stats.totalDsc - stats.expiredDsc} DSC Active</p>
                    <p className="text-xs text-green-500">All good</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

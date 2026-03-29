import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, IndianRupee, Users, CheckSquare, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth";

export default function Reports() {
  const [stats, setStats] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/dashboard/stats?firmId=${getUser()?.firmId||""}`).then(r => r.json()).then(setStats);
    fetch(`/api/tasks?firmId=${getUser()?.firmId||""}`).then(r => r.json()).then(setTasks);
    fetch(`/api/invoices?firmId=${getUser()?.firmId||""}`).then(r => r.json()).then(setInvoices);
  }, []);

  const tasksByCategory = tasks.reduce((acc: Record<string, number>, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});

  const tasksByStatus = tasks.reduce((acc: Record<string, number>, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  const monthlyRevenue = invoices.filter(i => i.status === "paid").reduce((s: number, i: any) => s + i.totalAmount, 0);
  const pendingRevenue = invoices.filter(i => i.status !== "paid").reduce((s: number, i: any) => s + i.totalAmount, 0);

  const catColor: Record<string, string> = { gst: "bg-green-500", itr: "bg-blue-500", tds: "bg-yellow-500", audit: "bg-purple-500", roc: "bg-orange-500", general: "bg-gray-400" };
  const maxCat = Math.max(...Object.values(tasksByCategory));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 text-sm">Overview of your practice performance</p>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* KPIs */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Clients", value: stats.totalClients, sub: `${stats.activeClients} active`, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Tasks Completed", value: stats.completedTasks, sub: `${stats.pendingTasks} pending`, icon: CheckSquare, color: "text-green-600", bg: "bg-green-50" },
            { label: "Revenue Collected", value: `₹${stats.totalRevenue?.toLocaleString("en-IN")}`, sub: `₹${stats.pendingAmount?.toLocaleString("en-IN")} pending`, icon: IndianRupee, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Task Completion", value: stats.totalTasks > 0 ? `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}%` : "0%", sub: `${stats.overdueTasks} overdue`, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                      <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
                    </div>
                    <div className={`${s.bg} p-3 rounded-xl`}>
                      <Icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tasks by Category */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Tasks by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(tasksByCategory).map(([cat, count]) => (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 uppercase">{cat}</span>
                    <span className="text-sm text-gray-500">{count} tasks</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${catColor[cat] || "bg-gray-400"} rounded-full transition-all`}
                      style={{ width: `${(count / maxCat) * 100}%` }} />
                  </div>
                </div>
              ))}
              {Object.keys(tasksByCategory).length === 0 && <p className="text-gray-400 text-sm text-center py-4">No tasks data</p>}
            </div>
          </CardContent>
        </Card>

        {/* Task Status Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Task Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { key: "completed", label: "Completed", color: "bg-green-500" },
                { key: "in_progress", label: "In Progress", color: "bg-blue-500" },
                { key: "pending", label: "Pending", color: "bg-yellow-500" },
                { key: "overdue", label: "Overdue", color: "bg-red-500" },
              ].map(s => {
                const count = tasksByStatus[s.key] || 0;
                const total = tasks.length || 1;
                return (
                  <div key={s.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{s.label}</span>
                      <span className="text-sm text-gray-500">{count} ({Math.round(count/total*100)}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full`} style={{ width: `${(count / total) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Summary */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Revenue Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div>
                  <p className="text-sm text-green-600">Collected Revenue</p>
                  <p className="text-2xl font-bold text-green-700">₹{monthlyRevenue.toLocaleString("en-IN")}</p>
                </div>
                <div className="text-4xl font-bold text-green-200">₹</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                <div>
                  <p className="text-sm text-yellow-600">Pending Collection</p>
                  <p className="text-2xl font-bold text-yellow-700">₹{pendingRevenue.toLocaleString("en-IN")}</p>
                </div>
                <div className="text-4xl font-bold text-yellow-200">₹</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div>
                  <p className="text-sm text-blue-600">Total Invoiced</p>
                  <p className="text-2xl font-bold text-blue-700">₹{(monthlyRevenue + pendingRevenue).toLocaleString("en-IN")}</p>
                </div>
                <div className="text-4xl font-bold text-blue-200">₹</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Collection Rate", value: stats ? `${Math.round((stats.totalRevenue / (stats.totalRevenue + stats.pendingAmount || 1)) * 100)}%` : "0%", good: true },
                { label: "Task Completion Rate", value: stats ? `${Math.round((stats.completedTasks / (stats.totalTasks || 1)) * 100)}%` : "0%", good: true },
                { label: "Overdue Tasks", value: stats ? `${stats.overdueTasks}` : "0", good: (stats?.overdueTasks || 0) === 0 },
                { label: "Expired DSC", value: stats ? `${stats.expiredDsc}` : "0", good: (stats?.expiredDsc || 0) === 0 },
                { label: "Active Clients", value: stats ? `${stats.activeClients}/${stats.totalClients}` : "0/0", good: true },
              ].map((insight, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{insight.label}</span>
                  <span className={`text-sm font-bold ${insight.good ? "text-green-600" : "text-red-500"}`}>{insight.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

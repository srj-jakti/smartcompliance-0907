import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertTriangle, TrendingUp } from "lucide-react";

export default function EmployeeReports() {
  const user = getUser();
  const [tasks, setTasks] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/tasks?firmId=${user.firmId}&employeeId=${user.id}`).then(r => r.json()).then(setTasks);
    fetch(`/api/clients?firmId=${user.firmId}&employeeId=${user.id}`).then(r => r.json()).then(setClients);
  }, []);

  const completed = tasks.filter(t => t.status === "completed").length;
  const pending = tasks.filter(t => t.status === "pending").length;
  const overdue = tasks.filter(t => t.status === "overdue").length;
  const rate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  const total = tasks.length || 1;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Performance</h1>
        <p className="text-gray-500 text-sm">Your work summary</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Completion Rate", value: `${rate}%`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Completed", value: completed, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
          { label: "Pending", value: pending, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Overdue", value: overdue, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div><p className="text-sm text-gray-500 mb-1">{s.label}</p><p className="text-2xl font-bold text-gray-900">{s.value}</p></div>
                  <div className={`${s.bg} p-3 rounded-xl`}><Icon className={`w-5 h-5 ${s.color}`} /></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-base">Tasks by Category</CardTitle></CardHeader>
          <CardContent>
            {Object.entries(tasks.reduce((acc: any, t) => { acc[t.category] = (acc[t.category] || 0) + 1; return acc; }, {})).map(([cat, count]: any) => (
              <div key={cat} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 uppercase">{cat}</span>
                  <span className="text-gray-400">{count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(count / total) * 100}%` }} />
                </div>
              </div>
            ))}
            {tasks.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No tasks data</p>}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-base">Client Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">Total Clients</span>
                <span className="font-bold text-gray-900">{clients.length}</span>
              </div>
              <div className="flex justify-between p-3 bg-green-50 rounded-xl">
                <span className="text-sm text-gray-600">Active Clients</span>
                <span className="font-bold text-green-700">{clients.filter(c => c.status === "active").length}</span>
              </div>
              <div className="flex justify-between p-3 bg-purple-50 rounded-xl">
                <span className="text-sm text-gray-600">Specialization</span>
                <span className="font-bold text-purple-700 uppercase">{user?.specialization}</span>
              </div>
              {rate >= 80 ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                  <p className="text-green-700 font-semibold">🏆 Great Work!</p>
                  <p className="text-green-600 text-xs mt-0.5">{rate}% completion rate — Keep it up!</p>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
                  <p className="text-yellow-700 font-semibold">📈 Room to Improve</p>
                  <p className="text-yellow-600 text-xs mt-0.5">Focus on pending tasks to improve your rate</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

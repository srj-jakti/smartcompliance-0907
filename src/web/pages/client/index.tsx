import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  FileText, FolderOpen, CreditCard, Calendar, AlertTriangle,
  CheckCircle, Clock, ArrowRight, TrendingUp, Bell, IndianRupee
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getUser } from "@/lib/auth";

export default function ClientDashboard() {
  const user = getUser();
  const [tasks, setTasks] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [compliance, setCompliance] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/tasks?firmId=${getUser()?.firmId||""}`).then(r => r.json()).then(t => setTasks(t.slice(0, 4)));
    fetch(`/api/invoices?firmId=${getUser()?.firmId||""}`).then(r => r.json()).then(setInvoices);
    fetch("/api/compliance").then(r => r.json()).then(c => setCompliance(c.slice(0, 4)));
  }, []);

  const pendingInvoices = invoices.filter(i => i.status !== "paid");
  const totalDue = pendingInvoices.reduce((s, i) => s + (i.totalAmount || 0), 0);
  const today = new Date();

  const statusColor: Record<string, string> = {
    completed: "status-completed", pending: "status-pending",
    in_progress: "status-in_progress", overdue: "status-overdue"
  };

  const catColor: Record<string, string> = {
    gst: "bg-green-100 text-green-700", itr: "bg-blue-100 text-blue-700",
    tds: "bg-yellow-100 text-yellow-700", roc: "bg-orange-100 text-orange-700"
  };

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hello, {user?.name?.split(" ")[0]}! 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here's a summary of your compliance status with your CA firm.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Filings", value: tasks.filter(t => t.status !== "completed").length, icon: FileText, color: "text-blue-600", bg: "bg-blue-50", link: "/client/tasks" },
          { label: "Completed", value: tasks.filter(t => t.status === "completed").length, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", link: "/client/tasks" },
          { label: "Amount Due", value: `₹${totalDue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-red-600", bg: "bg-red-50", link: "/client/invoices" },
          { label: "Upcoming Dates", value: compliance.filter(c => { const d = Math.ceil((new Date(c.dueDate).getTime() - today.getTime()) / 86400000); return d >= 0 && d <= 30; }).length, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50", link: "/client/compliance" },
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
        {/* My Filings */}
        <Card className="border-0 shadow-sm">
          <div className="flex items-center justify-between p-5 pb-3">
            <h3 className="font-semibold text-gray-900">My Filings</h3>
            <Link href="/client/tasks" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {tasks.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No filings yet</p>}
              {tasks.map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${catColor[t.category] || "bg-gray-100 text-gray-600"}`}>
                      {t.category?.toUpperCase().slice(0, 3)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t.title}</p>
                      {t.dueDate && <p className="text-xs text-gray-400">Due: {new Date(t.dueDate).toLocaleDateString("en-IN")}</p>}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[t.status] || ""}`}>
                    {t.status?.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Invoices */}
        <Card className="border-0 shadow-sm">
          <div className="flex items-center justify-between p-5 pb-3">
            <h3 className="font-semibold text-gray-900">Outstanding Invoices</h3>
            <Link href="/client/invoices" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {pendingInvoices.length === 0 && (
                <div className="text-center py-6">
                  <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">All invoices paid! 🎉</p>
                </div>
              )}
              {pendingInvoices.slice(0, 4).map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-blue-600">{inv.invoiceNo}</p>
                    {inv.dueDate && <p className="text-xs text-gray-400">Due: {new Date(inv.dueDate).toLocaleDateString("en-IN")}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">₹{inv.totalAmount?.toLocaleString("en-IN")}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${inv.status === "overdue" ? "status-overdue" : "status-pending"}`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
              {pendingInvoices.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-red-700">Total Due</span>
                  <span className="text-lg font-bold text-red-700">₹{totalDue.toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Compliance */}
        <Card className="border-0 shadow-sm">
          <div className="flex items-center justify-between p-5 pb-3">
            <h3 className="font-semibold text-gray-900">Upcoming Deadlines</h3>
            <Link href="/client/compliance" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {compliance.map(c => {
                const daysLeft = Math.ceil((new Date(c.dueDate).getTime() - today.getTime()) / 86400000);
                const isUrgent = daysLeft <= 7 && daysLeft >= 0;
                const isOverdue = daysLeft < 0;
                return (
                  <div key={c.id} className={`flex items-center justify-between p-3 rounded-xl ${isOverdue ? "bg-red-50" : isUrgent ? "bg-orange-50" : "bg-gray-50"}`}>
                    <div className="flex items-center gap-3">
                      {isOverdue || isUrgent ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <Clock className="w-4 h-4 text-blue-400" />}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{c.title}</p>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${catColor[c.category?.toLowerCase()] || "bg-gray-100 text-gray-600"}`}>{c.category?.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{new Date(c.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
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
          <div className="p-5 pb-3">
            <h3 className="font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: "/client/documents", icon: FolderOpen, label: "Upload Documents", color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
                { href: "/client/invoices", icon: CreditCard, label: "Pay Invoice", color: "bg-green-50 text-green-700 hover:bg-green-100" },
                { href: "/client/compliance", icon: Calendar, label: "Due Dates", color: "bg-purple-50 text-purple-700 hover:bg-purple-100" },
                { href: "/client/messages", icon: Bell, label: "Messages", color: "bg-orange-50 text-orange-700 hover:bg-orange-100" },
              ].map((a, i) => {
                const Icon = a.icon;
                return (
                  <Link key={i} href={a.href}>
                    <div className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${a.color}`}>
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{a.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* CA Contact Card */}
            <div className="mt-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-white">
              <p className="text-xs text-blue-200 mb-1">Your CA Firm</p>
              <p className="font-bold text-lg">Sharma & Associates</p>
              <p className="text-blue-200 text-sm mt-1">CA Rajesh Sharma</p>
              <div className="flex gap-3 mt-3">
                <a href="tel:+919876543210" className="flex-1 bg-white/20 hover:bg-white/30 rounded-lg py-2 text-center text-sm font-medium transition-all">
                  📞 Call
                </a>
                <a href="https://wa.me/919876543210" className="flex-1 bg-white/20 hover:bg-white/30 rounded-lg py-2 text-center text-sm font-medium transition-all">
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

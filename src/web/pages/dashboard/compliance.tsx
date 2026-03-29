import { useEffect, useState } from "react";
import { Calendar, AlertTriangle, Clock, CheckCircle, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth";

interface ComplianceItem {
  id: string; title: string; description?: string; dueDate: string;
  category: string; applicableTo?: string; penaltyAmount?: string;
}

const catColor: Record<string, string> = {
  gst: "bg-green-100 text-green-700 border-green-200",
  itr: "bg-blue-100 text-blue-700 border-blue-200",
  tds: "bg-yellow-100 text-yellow-700 border-yellow-200",
  roc: "bg-orange-100 text-orange-700 border-orange-200",
  mca: "bg-purple-100 text-purple-700 border-purple-200",
  fema: "bg-red-100 text-red-700 border-red-200",
};

export default function Compliance() {
  const [items, setItems] = useState<ComplianceItem[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => { fetch("/api/compliance").then(r => r.json()).then(setItems); }, []);

  const today = new Date();

  const getDaysLeft = (dateStr: string) => {
    const due = new Date(dateStr);
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const filtered = items.filter(i => filter === "all" || i.category.toLowerCase() === filter);

  const overdue = items.filter(i => getDaysLeft(i.dueDate) < 0).length;
  const urgent = items.filter(i => { const d = getDaysLeft(i.dueDate); return d >= 0 && d <= 7; }).length;
  const upcoming = items.filter(i => { const d = getDaysLeft(i.dueDate); return d > 7 && d <= 30; }).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Calendar</h1>
          <p className="text-gray-500 text-sm">Track all GST, ITR, TDS, ROC deadlines</p>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <div>
            <p className="text-2xl font-bold text-red-600">{overdue}</p>
            <p className="text-sm text-red-600">Overdue</p>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
          <Bell className="w-6 h-6 text-orange-500" />
          <div>
            <p className="text-2xl font-bold text-orange-600">{urgent}</p>
            <p className="text-sm text-orange-600">Due in 7 days</p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <Clock className="w-6 h-6 text-blue-500" />
          <div>
            <p className="text-2xl font-bold text-blue-600">{upcoming}</p>
            <p className="text-sm text-blue-600">Due in 30 days</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["all", "gst", "itr", "tds", "roc", "mca"].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${filter === cat ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}>
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Compliance List */}
      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No compliance items found.</div>}
        {filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map(item => {
          const daysLeft = getDaysLeft(item.dueDate);
          const isOverdue = daysLeft < 0;
          const isUrgent = daysLeft >= 0 && daysLeft <= 7;
          return (
            <Card key={item.id} className={`border-0 shadow-sm ${isOverdue ? "border-l-4 border-l-red-500" : isUrgent ? "border-l-4 border-l-orange-500" : "border-l-4 border-l-blue-300"}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isOverdue ? "bg-red-100" : isUrgent ? "bg-orange-100" : "bg-blue-50"}`}>
                      {isOverdue ? <AlertTriangle className="w-5 h-5 text-red-500" /> : isUrgent ? <Bell className="w-5 h-5 text-orange-500" /> : <Calendar className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded border font-medium ${catColor[item.category?.toLowerCase()]||"bg-gray-100 text-gray-600 border-gray-200"}`}>
                          {item.category?.toUpperCase()}
                        </span>
                        {item.applicableTo && <span className="text-xs text-gray-400">• {item.applicableTo}</span>}
                      </div>
                      {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                      {item.penaltyAmount && (
                        <p className="text-xs text-red-500 mt-1">⚠️ Penalty: {item.penaltyAmount}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(item.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <p className={`text-sm font-semibold mt-0.5 ${isOverdue ? "text-red-500" : isUrgent ? "text-orange-500" : "text-blue-600"}`}>
                      {isOverdue ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? "Due today!" : `${daysLeft} days left`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* India Tax Calendar */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-bold text-blue-900 mb-4">📅 Key India Tax Calendar 2025-26</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { month: "July 2025", items: ["ITR non-audit (Jul 31)", "TDS Q1 return (Jul 31)", "GSTR-1 (Jul 11)", "GSTR-3B (Jul 20)"] },
            { month: "August 2025", items: ["GSTR-1 (Aug 11)", "GSTR-3B (Aug 20)", "TDS deposit (Aug 7)"] },
            { month: "September 2025", items: ["Advance Tax 2nd (Sep 15)", "TDS Q2 (Oct 31)", "GSTR-9 prep"] },
            { month: "October 2025", items: ["ITR audit (Oct 31)", "TDS Q2 return (Oct 31)", "GSTR-3B (Oct 20)"] },
          ].map((m, i) => (
            <div key={i} className="bg-white rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-2">{m.month}</h4>
              <ul className="space-y-1">
                {m.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

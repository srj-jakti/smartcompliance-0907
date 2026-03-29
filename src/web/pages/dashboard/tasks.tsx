import { useEffect, useState } from "react";
import { Plus, X, Filter, CheckCircle, Clock, AlertTriangle, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";

interface Task { id: string; title: string; category: string; status: string; priority: string; clientId?: string; dueDate?: string; billingAmount?: number; description?: string; }
interface Client { id: string; name: string; }

const defaultForm = { title: "", description: "", category: "gst", status: "pending", priority: "medium", clientId: "", billingAmount: "", dueDate: "", recurring: "none", notes: "" };

const statusIcon = { completed: <CheckCircle className="w-4 h-4 text-green-500" />, pending: <Circle className="w-4 h-4 text-gray-400" />, in_progress: <Clock className="w-4 h-4 text-blue-500" />, overdue: <AlertTriangle className="w-4 h-4 text-red-500" />, review: <Clock className="w-4 h-4 text-purple-500" /> };

const priorityColor = { low: "bg-gray-100 text-gray-600", medium: "bg-blue-100 text-blue-700", high: "bg-orange-100 text-orange-700", urgent: "bg-red-100 text-red-700" };
const categoryColor: Record<string, string> = { gst: "bg-green-100 text-green-700", itr: "bg-blue-100 text-blue-700", tds: "bg-yellow-100 text-yellow-700", audit: "bg-purple-100 text-purple-700", roc: "bg-orange-100 text-orange-700", general: "bg-gray-100 text-gray-700" };
const statusColor: Record<string, string> = { completed: "status-completed", pending: "status-pending", in_progress: "status-in_progress", overdue: "status-overdue", review: "status-review" };

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...defaultForm });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCat, setFilterCat] = useState("all");

  const load = () => fetch(`/api/tasks?firmId=${getUser()?.firmId||""}`).then(r => r.json()).then(setTasks);
  useEffect(() => {
    load();
    fetch(`/api/clients?firmId=${getUser()?.firmId||""}`).then(r => r.json()).then(setClients);
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const payload = { ...form, billingAmount: form.billingAmount ? parseFloat(form.billingAmount) : null, dueDate: form.dueDate ? new Date(form.dueDate) : null };
      const url = editId ? `/api/tasks/${editId}` : "/api/tasks";
      await fetch(url, { method: editId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({...payload, firmId: getUser()?.firmId||""}) });
      toast.success(editId ? "Task updated!" : "Task created!"); setShowModal(false); setForm({ ...defaultForm }); setEditId(null); load();
    } catch { toast.error("Failed to save"); } finally { setLoading(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/tasks/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    toast.success("Task deleted"); load();
  };

  const filtered = tasks.filter(t => (filterStatus === "all" || t.status === filterStatus) && (filterCat === "all" || t.category === filterCat));

  const clientName = (id?: string) => clients.find(c => c.id === id)?.name || "-";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500 text-sm">{filtered.length} tasks shown</p>
        </div>
        <button onClick={() => { setForm({...defaultForm}); setEditId(null); setShowModal(true); }} className="btn-blue flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" /> New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {["all", "pending", "in_progress", "completed", "overdue"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filterStatus === s ? "bg-white shadow text-blue-700" : "text-gray-500 hover:text-gray-700"}`}>
              {s === "all" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
          <option value="all">All Categories</option>
          {["gst", "itr", "tds", "audit", "roc", "general"].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
        </select>
      </div>

      {/* Task counts */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        {[
          { label: "Total", count: tasks.length, color: "border-gray-200" },
          { label: "Pending", count: tasks.filter(t => t.status === "pending").length, color: "border-yellow-300" },
          { label: "In Progress", count: tasks.filter(t => t.status === "in_progress").length, color: "border-blue-300" },
          { label: "Overdue", count: tasks.filter(t => t.status === "overdue").length, color: "border-red-300" },
          { label: "Done", count: tasks.filter(t => t.status === "completed").length, color: "border-green-300" },
        ].map((s, i) => (
          <div key={i} className={`bg-white rounded-xl p-3 border-l-4 ${s.color} shadow-sm text-center`}>
            <p className="text-xl font-bold text-gray-900">{s.count}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No tasks found.</div>}
        {filtered.map(t => (
          <Card key={t.id} className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button onClick={() => updateStatus(t.id, t.status === "completed" ? "pending" : "completed")} className="mt-0.5">
                    {(statusIcon as any)[t.status] || <Circle className="w-4 h-4 text-gray-400" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium ${t.status === "completed" ? "line-through text-gray-400" : "text-gray-900"}`}>{t.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${categoryColor[t.category]||"bg-gray-100 text-gray-600"}`}>{t.category?.toUpperCase()}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${(priorityColor as any)[t.priority]||""}`}>{t.priority}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[t.status]||""}`}>{t.status?.replace("_"," ")}</span>
                      {t.clientId && <span className="text-xs text-gray-500">👤 {clientName(t.clientId)}</span>}
                      {t.dueDate && <span className="text-xs text-gray-400">📅 {new Date(t.dueDate).toLocaleDateString("en-IN")}</span>}
                      {t.billingAmount && <span className="text-xs text-green-600 font-medium">₹{t.billingAmount.toLocaleString("en-IN")}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <select value={t.status} onChange={e => updateStatus(t.id, e.target.value)} className="text-xs border border-gray-200 rounded px-2 py-1">
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                  <button onClick={() => del(t.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">{editId ? "Edit Task" : "New Task"}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Task Title *</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., GSTR-3B Filing - August 2025" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {["gst","itr","tds","audit","roc","general"].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Priority</label>
                  <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Client</label>
                  <select value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select client</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Billing Amount (₹)</label>
                  <input type="number" value={form.billingAmount} onChange={e => setForm({...form, billingAmount: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Recurring</label>
                  <select value={form.recurring} onChange={e => setForm({...form, recurring: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="none">None</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-medium">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 btn-blue rounded-lg py-2.5 text-sm font-medium">
                  {loading ? "Saving..." : editId ? "Update" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

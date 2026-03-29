import { useEffect, useState } from "react";
import { Plus, X, Zap, Users, CheckSquare, MessageSquare, Edit, Trash2, Bot, ToggleLeft, ToggleRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";
import Chat from "@/components/shared/chat";

interface Employee { id: string; name: string; email: string; phone?: string; role: string; specialization?: string; activeTaskCount?: number; status: string; }
interface Client { id: string; name: string; assignedEmployeeId?: string; clientType: string; }

const defaultEmpForm = { name: "", email: "", phone: "", role: "staff", specialization: "general", status: "active" };

export default function Team() {
  const user = getUser();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...defaultEmpForm });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoAssign, setAutoAssign] = useState(false);
  const [firm, setFirm] = useState<any>(null);
  const [assignModal, setAssignModal] = useState<{ taskId: string; taskTitle: string } | null>(null);
  const [chatTarget, setChatTarget] = useState<any>(null);

  const firmId = user?.firmId;

  const load = async () => {
    if (!firmId) return;
    const [emps, cls, tks, firmData] = await Promise.all([
      fetch(`/api/employees?firmId=${firmId}`).then(r => r.json()),
      fetch(`/api/clients?firmId=${firmId}`).then(r => r.json()),
      fetch(`/api/tasks?firmId=${firmId}`).then(r => r.json()),
      fetch(`/api/firms/${firmId}`).then(r => r.json()),
    ]);
    setEmployees(emps);
    setClients(cls);
    setTasks(tks.filter((t: any) => !t.assignedEmployeeId));
    setFirm(firmData);
    setAutoAssign(firmData?.aiAutoAssign || false);
  };

  useEffect(() => { load(); }, []);

  const toggleAutoAssign = async () => {
    const newVal = !autoAssign;
    setAutoAssign(newVal);
    await fetch(`/api/firms/${firmId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aiAutoAssign: newVal })
    });
    toast.success(newVal ? "🤖 AI Auto-Assign enabled! New tasks will be assigned automatically." : "AI Auto-Assign disabled.");
  };

  const saveEmployee = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const url = editId ? `/api/employees/${editId}` : "/api/employees";
      const method = editId ? "PUT" : "POST";
      await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, firmId }) });
      toast.success(editId ? "Employee updated!" : "Employee added!");
      setShowModal(false); setForm({ ...defaultEmpForm }); setEditId(null); load();
    } catch { toast.error("Failed"); } finally { setLoading(false); }
  };

  const deleteEmployee = async (id: string) => {
    if (!confirm("Remove this employee?")) return;
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    toast.success("Employee removed"); load();
  };

  const assignTask = async (taskId: string, empId: string) => {
    await fetch(`/api/tasks/${taskId}/assign`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: empId, firmId })
    });
    toast.success("Task assigned!"); setAssignModal(null); load();
  };

  const aiAssignTask = async (taskId: string) => {
    const res = await fetch("/api/ai/assign", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firmId, taskId })
    });
    const data = await res.json();
    if (data.success) { toast.success(`🤖 ${data.message}`); load(); }
    else toast.error(data.error || "Failed to auto-assign");
  };

  const assignClientToEmployee = async (clientId: string, empId: string) => {
    await fetch(`/api/clients/${clientId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedEmployeeId: empId })
    });
    toast.success("Client assigned!"); load();
  };

  const specColor: Record<string, string> = {
    gst: "bg-green-100 text-green-700", itr: "bg-blue-100 text-blue-700",
    tds: "bg-yellow-100 text-yellow-700", audit: "bg-purple-100 text-purple-700",
    roc: "bg-orange-100 text-orange-700", general: "bg-gray-100 text-gray-600"
  };
  const roleColor: Record<string, string> = { manager: "bg-blue-100 text-blue-700", staff: "bg-gray-100 text-gray-600", intern: "bg-orange-100 text-orange-700" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-500 text-sm">{employees.length} employees • Assign tasks & clients</p>
        </div>
        <div className="flex items-center gap-3">
          {/* AI Auto-Assign Toggle */}
          <button onClick={toggleAutoAssign}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-medium text-sm transition-all
              ${autoAssign ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 bg-white text-gray-600 hover:border-purple-300"}`}>
            <Bot className="w-4 h-4" />
            AI Auto-Assign
            {autoAssign ? <ToggleRight className="w-5 h-5 text-purple-600" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
          </button>
          <button onClick={() => { setForm({ ...defaultEmpForm }); setEditId(null); setShowModal(true); }}
            className="btn-blue flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        </div>
      </div>

      {/* AI Auto-Assign Banner */}
      {autoAssign && (
        <div className="mb-5 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-purple-800">🤖 AI Auto-Assign is ON</p>
            <p className="text-sm text-purple-600 mt-0.5">New tasks will be automatically assigned to the best-fit employee based on specialization and workload. You'll be notified of each assignment.</p>
          </div>
        </div>
      )}

      {/* Employees Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {employees.map(emp => {
          const empClients = clients.filter(c => c.assignedEmployeeId === emp.id);
          const empTasks = tasks.filter(t => t.assignedEmployeeId === emp.id); // already unassigned filter is separate

          return (
            <Card key={emp.id} className="border-0 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{emp.name}</h3>
                      <div className="flex gap-1.5 mt-0.5">
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${roleColor[emp.role] || "bg-gray-100 text-gray-600"}`}>{emp.role}</span>
                        {emp.specialization && <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${specColor[emp.specialization] || "bg-gray-100"}`}>{emp.specialization?.toUpperCase()}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setForm({ name: emp.name, email: emp.email, phone: emp.phone || "", role: emp.role, specialization: emp.specialization || "general", status: emp.status }); setEditId(emp.id); setShowModal(true); }}
                      className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteEmployee(emp.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-3 space-y-1">
                  <p>📧 {emp.email}</p>
                  {emp.phone && <p>📞 {emp.phone}</p>}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-blue-700">{empClients.length}</p>
                    <p className="text-xs text-blue-500">Clients</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-yellow-700">{emp.activeTaskCount || 0}</p>
                    <p className="text-xs text-yellow-500">Tasks</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button onClick={() => setChatTarget({ id: emp.id, name: emp.name, role: "employee" })}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100">
                    <MessageSquare className="w-3.5 h-3.5" /> Chat
                  </button>
                  <button onClick={() => toast.info("Drag clients from the list below to assign")}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100">
                    <Users className="w-3.5 h-3.5" /> Clients
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {employees.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-400">No employees yet. Add your first team member!</div>
        )}
      </div>

      {/* Unassigned Tasks */}
      {tasks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">⚠️ Unassigned Tasks ({tasks.length})</h2>
          <div className="space-y-2">
            {tasks.slice(0, 5).map(t => (
              <div key={t.id} className="bg-white border border-orange-200 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{t.title}</p>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">{t.category?.toUpperCase()}</span>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => aiAssignTask(t.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-200">
                    <Bot className="w-3 h-3" /> AI Assign
                  </button>
                  <button onClick={() => setAssignModal({ taskId: t.id, taskTitle: t.title })}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100">
                    <Users className="w-3 h-3" /> Manual Assign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Client Assignment */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Client → Employee Assignment</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Assigned To</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clients.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 capitalize">{c.clientType}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {employees.find(e => e.id === c.assignedEmployeeId)?.name || <span className="text-orange-500 text-xs">Unassigned</span>}
                  </td>
                  <td className="px-4 py-3">
                    <select value={c.assignedEmployeeId || ""}
                      onChange={e => assignClientToEmployee(c.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">— Assign —</option>
                      {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.specialization})</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">{editId ? "Edit Employee" : "Add Employee"}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={saveEmployee} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Role</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="intern">Intern</option>
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Specialization</label>
                  <select value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {["gst", "itr", "tds", "audit", "roc", "general"].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 btn-blue rounded-lg py-2.5 text-sm font-medium">
                  {loading ? "Saving..." : editId ? "Update" : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Assign Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold text-gray-900">Assign Task</h2>
              <button onClick={() => setAssignModal(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 mb-4 bg-gray-50 rounded-lg p-3">{assignModal.taskTitle}</p>
              <div className="space-y-2">
                {employees.map(e => (
                  <button key={e.id} onClick={() => assignTask(assignModal.taskId, e.id)}
                    className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-xl text-left transition-colors">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">{e.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{e.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{e.role} • {e.specialization} • {e.activeTaskCount} tasks</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat */}
      {chatTarget ? (
        <Chat floating={true} defaultOpen={true} targetId={chatTarget.id} targetName={chatTarget.name} targetRole={chatTarget.role} />
      ) : (
        <Chat floating={true} />
      )}
    </div>
  );
}

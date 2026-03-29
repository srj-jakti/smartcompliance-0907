import { useEffect, useState } from "react";
import { Plus, X, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";

interface DSCRecord { id: string; clientId: string; holderName: string; dscClass: string; issuer?: string; serialNo?: string; expiryDate: string; tokenNo?: string; status: string; }
interface Client { id: string; name: string; }

const defaultForm = { clientId: "", holderName: "", dscClass: "class3", issuer: "eMudhra", serialNo: "", expiryDate: "", tokenNo: "", status: "active" };

export default function DSC() {
  const [records, setRecords] = useState<DSCRecord[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...defaultForm });
  const [loading, setLoading] = useState(false);

  const load = () => fetch(`/api/dsc?firmId=${getUser()?.firmId||""}`).then(r => r.json()).then(setRecords);
  useEffect(() => { load(); fetch(`/api/clients?firmId=${getUser()?.firmId||""}`).then(r => r.json()).then(setClients); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await fetch("/api/dsc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, expiryDate: new Date(form.expiryDate), firmId: getUser()?.firmId||"" }) });
      toast.success("DSC added!"); setShowModal(false); setForm({ ...defaultForm }); load();
    } catch { toast.error("Failed"); } finally { setLoading(false); }
  };

  const clientName = (id: string) => clients.find(c => c.id === id)?.name || "Unknown";
  const today = new Date();
  const getDays = (d: string) => Math.ceil((new Date(d).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">DSC Management</h1>
          <p className="text-gray-500 text-sm">Track Digital Signature Certificates</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-blue flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" /> Add DSC
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <div>
            <p className="text-2xl font-bold text-green-600">{records.filter(r => r.status === "active" && getDays(r.expiryDate) > 30).length}</p>
            <p className="text-sm text-green-600">Active & Valid</p>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          <div>
            <p className="text-2xl font-bold text-orange-600">{records.filter(r => { const d = getDays(r.expiryDate); return d >= 0 && d <= 30; }).length}</p>
            <p className="text-sm text-orange-600">Expiring in 30 days</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <Shield className="w-6 h-6 text-red-500" />
          <div>
            <p className="text-2xl font-bold text-red-600">{records.filter(r => r.status === "expired" || getDays(r.expiryDate) < 0).length}</p>
            <p className="text-sm text-red-600">Expired</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {records.length === 0 && <div className="text-center py-12 text-gray-400">No DSC records yet.</div>}
        {records.map(r => {
          const daysLeft = getDays(r.expiryDate);
          const isExpired = daysLeft < 0 || r.status === "expired";
          const isExpiring = daysLeft >= 0 && daysLeft <= 30;
          return (
            <Card key={r.id} className={`border-0 shadow-sm ${isExpired ? "border-l-4 border-l-red-500" : isExpiring ? "border-l-4 border-l-orange-500" : "border-l-4 border-l-green-500"}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isExpired ? "bg-red-100" : isExpiring ? "bg-orange-100" : "bg-green-100"}`}>
                      <Shield className={`w-5 h-5 ${isExpired ? "text-red-500" : isExpiring ? "text-orange-500" : "text-green-500"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{r.holderName}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${r.dscClass === "class3" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                          {r.dscClass?.toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isExpired ? "status-overdue" : isExpiring ? "status-pending" : "status-completed"}`}>
                          {isExpired ? "Expired" : isExpiring ? "Expiring Soon" : "Active"}
                        </span>
                      </div>
                      <div className="flex gap-4 mt-1.5 flex-wrap text-xs text-gray-500">
                        <span>Client: {clientName(r.clientId)}</span>
                        {r.issuer && <span>Issuer: {r.issuer}</span>}
                        {r.serialNo && <span>S/N: {r.serialNo}</span>}
                        {r.tokenNo && <span>Token: {r.tokenNo}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">
                      Expiry: {new Date(r.expiryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <p className={`text-sm font-bold ${isExpired ? "text-red-500" : isExpiring ? "text-orange-500" : "text-green-600"}`}>
                      {isExpired ? `Expired ${Math.abs(daysLeft)}d ago` : `${daysLeft} days left`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">Add DSC Record</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Client *</label>
                <select required value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Holder Name *</label>
                <input required value={form.holderName} onChange={e => setForm({...form, holderName: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">DSC Class</label>
                  <select value={form.dscClass} onChange={e => setForm({...form, dscClass: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="class2">Class 2</option>
                    <option value="class3">Class 3</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Issuer</label>
                  <select value={form.issuer} onChange={e => setForm({...form, issuer: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="eMudhra">eMudhra</option>
                    <option value="NSDL">NSDL</option>
                    <option value="Safescrypt">Safescrypt</option>
                    <option value="IDRBT">IDRBT</option>
                    <option value="NIC">NIC</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Serial No</label>
                  <input value={form.serialNo} onChange={e => setForm({...form, serialNo: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Token No</label>
                  <input value={form.tokenNo} onChange={e => setForm({...form, tokenNo: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Expiry Date *</label>
                <input required type="date" value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 btn-blue rounded-lg py-2.5 text-sm font-medium">
                  {loading ? "Saving..." : "Add DSC"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

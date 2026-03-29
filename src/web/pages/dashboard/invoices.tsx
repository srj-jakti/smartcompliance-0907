import { useEffect, useState } from "react";
import { Plus, X, IndianRupee, Send, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";

interface Invoice { id: string; invoiceNo: string; clientId: string; amount: number; gstAmount: number; totalAmount: number; status: string; dueDate?: string; description?: string; }
interface Client { id: string; name: string; }

const defaultForm = { invoiceNo: "", clientId: "", amount: "", gstRate: "18", description: "", status: "unpaid", dueDate: "" };
const statusColor: Record<string, string> = { paid: "status-completed", unpaid: "status-pending", partial: "status-in_progress", overdue: "status-overdue" };

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...defaultForm });
  const [loading, setLoading] = useState(false);

  const load = () => fetch(`/api/invoices?firmId=${getUser()?.firmId||""}`).then(r => r.json()).then(setInvoices);
  useEffect(() => { load(); fetch(`/api/clients?firmId=${getUser()?.firmId||""}`).then(r => r.json()).then(setClients); }, []);

  const clientName = (id: string) => clients.find(c => c.id === id)?.name || "Unknown";
  const totalRevenue = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.totalAmount, 0);
  const pendingAmount = invoices.filter(i => i.status !== "paid").reduce((s, i) => s + i.totalAmount, 0);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const amount = parseFloat(form.amount);
      const gstAmount = amount * (parseFloat(form.gstRate) / 100);
      const totalAmount = amount + gstAmount;
      const invNo = form.invoiceNo || `INV-${Date.now()}`;
      await fetch("/api/invoices", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, invoiceNo: invNo, amount, gstAmount, totalAmount, dueDate: form.dueDate ? new Date(form.dueDate) : null, firmId: getUser()?.firmId||"" })
      });
      toast.success("Invoice created!"); setShowModal(false); setForm({ ...defaultForm }); load();
    } catch { toast.error("Failed"); } finally { setLoading(false); }
  };

  const markPaid = async (id: string) => {
    await fetch(`/api/invoices/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "paid", paidAt: new Date() }) });
    toast.success("Marked as paid!"); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 text-sm">{invoices.length} invoices</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-blue flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" /> New Invoice
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-600 mb-1">Revenue Collected</p>
          <p className="text-2xl font-bold text-green-700">₹{totalRevenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-600 mb-1">Pending Amount</p>
          <p className="text-2xl font-bold text-yellow-700">₹{pendingAmount.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-600 mb-1">Total Invoices</p>
          <p className="text-2xl font-bold text-blue-700">{invoices.length}</p>
        </div>
      </div>

      <div className="space-y-3">
        {invoices.length === 0 && <div className="text-center py-12 text-gray-400">No invoices yet.</div>}
        {invoices.map(inv => (
          <Card key={inv.id} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold text-blue-600">{inv.invoiceNo}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[inv.status]||""}`}>{inv.status}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{clientName(inv.clientId)}</p>
                  {inv.description && <p className="text-xs text-gray-400 mt-0.5">{inv.description}</p>}
                  {inv.dueDate && <p className="text-xs text-gray-400 mt-0.5">Due: {new Date(inv.dueDate).toLocaleDateString("en-IN")}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-gray-500">Amount: ₹{inv.amount?.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-gray-400">GST: ₹{inv.gstAmount?.toLocaleString("en-IN")}</p>
                  <p className="text-lg font-bold text-gray-900">₹{inv.totalAmount?.toLocaleString("en-IN")}</p>
                </div>
                <div className="flex gap-2">
                  {inv.status !== "paid" && (
                    <button onClick={() => markPaid(inv.id)} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100">
                      <CheckCircle className="w-3.5 h-3.5" /> Mark Paid
                    </button>
                  )}
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100">
                    <Send className="w-3.5 h-3.5" /> Send
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">Create Invoice</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Invoice No</label>
                <input value={form.invoiceNo} onChange={e => setForm({...form, invoiceNo: e.target.value})} placeholder="Auto-generated"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Client *</label>
                <select required value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Amount (₹) *</label>
                  <input required type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">GST Rate (%)</label>
                  <select value={form.gstRate} onChange={e => setForm({...form, gstRate: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="0">0% (Exempt)</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
              </div>
              {form.amount && (
                <div className="bg-blue-50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span><span>₹{parseFloat(form.amount||"0").toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>GST ({form.gstRate}%):</span>
                    <span>₹{(parseFloat(form.amount||"0") * parseFloat(form.gstRate) / 100).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-bold text-blue-700 border-t border-blue-200 mt-1 pt-1">
                    <span>Total:</span>
                    <span>₹{(parseFloat(form.amount||"0") * (1 + parseFloat(form.gstRate)/100)).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 btn-blue rounded-lg py-2.5 text-sm font-medium">
                  {loading ? "Creating..." : "Create Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

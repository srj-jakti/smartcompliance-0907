import { useState } from "react";
import { HelpCircle, ChevronDown, Phone, Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const faqs = [
  { q: "How do I view my filed returns?", a: "Go to 'My Filings' section to see all your GST, ITR, and TDS returns filed by your CA firm with current status." },
  { q: "How can I download my documents?", a: "Navigate to 'Documents' section. All documents shared by your CA firm are available to download securely." },
  { q: "How do I pay my invoice online?", a: "Go to 'Invoices', find the unpaid invoice, and click 'Pay Now'. You'll be redirected to our secure payment gateway." },
  { q: "How do I upload documents for my CA?", a: "Go to 'Documents' → 'Upload Documents' tab. Drag & drop or browse files. Your CA will be notified automatically." },
  { q: "When will my ITR refund come?", a: "ITR refunds are processed by Income Tax Dept, typically within 20-45 days of e-verification. Your CA can track status on the IT portal." },
  { q: "What does 'in progress' status mean?", a: "It means your CA firm has started working on your filing and it's currently being processed. You'll be notified upon completion." },
];

export default function ClientSupport() {
  const [open, setOpen] = useState<number | null>(null);
  const [form, setForm] = useState({ subject: "", message: "" });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Support</h1>
        <p className="text-gray-500 text-sm">Get help with your account or compliance queries</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <button className="w-full flex items-center justify-between p-4 text-left" onClick={() => setOpen(open === i ? null : i)}>
                  <span className="font-medium text-gray-800 text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
                </button>
                {open === i && <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Contact Options */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Contact Your CA Firm</h3>
            <div className="space-y-3">
              <a href="tel:+919876543210" className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center"><Phone className="w-4 h-4 text-white" /></div>
                <div>
                  <p className="text-sm font-semibold text-blue-700">Call Now</p>
                  <p className="text-xs text-gray-500">+91 98765 43210</p>
                </div>
              </a>
              <a href="https://wa.me/919876543210" className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center"><MessageSquare className="w-4 h-4 text-white" /></div>
                <div>
                  <p className="text-sm font-semibold text-green-700">WhatsApp</p>
                  <p className="text-xs text-gray-500">Chat directly</p>
                </div>
              </a>
              <a href="mailto:ca@cafirm.in" className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                <div className="w-9 h-9 bg-purple-600 rounded-lg flex items-center justify-center"><Mail className="w-4 h-4 text-white" /></div>
                <div>
                  <p className="text-sm font-semibold text-purple-700">Email</p>
                  <p className="text-xs text-gray-500">ca@cafirm.in</p>
                </div>
              </a>
            </div>
          </div>

          {/* Raise Ticket */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Raise a Ticket</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Subject</label>
                <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g., ITR refund query"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Message</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              </div>
              <button onClick={() => { toast.success("Ticket raised! We'll respond within 24 hours."); setForm({ subject: "", message: "" }); }}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all"
                style={{ background: "linear-gradient(135deg, #059669, #047857)" }}>
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

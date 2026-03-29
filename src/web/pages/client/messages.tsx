import { useState } from "react";
import { Send, MessageSquare, Bell, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const demoMessages = [
  { id: "1", from: "CA Firm", content: "Your GSTR-3B for July 2025 has been filed successfully. Acknowledgment number: ARN-123456789.", time: "Today, 10:30 AM", type: "update", read: true },
  { id: "2", from: "CA Firm", content: "⚠️ Reminder: ITR filing deadline is July 31, 2025. Please share your Form 16 and investment proofs at the earliest.", time: "Yesterday, 3:00 PM", type: "reminder", read: true },
  { id: "3", from: "CA Firm", content: "Invoice INV-2025-002 of ₹5,900 is due by August 15, 2025. Please make payment at your earliest convenience.", time: "Jul 25, 2:15 PM", type: "invoice", read: false },
  { id: "4", from: "CA Firm", content: "TDS Q1 return has been filed. Your Form 26AS will reflect the entries within 3-5 working days.", time: "Jul 20, 11:00 AM", type: "update", read: true },
];

const typeStyle: Record<string, string> = {
  update: "bg-green-100 text-green-700",
  reminder: "bg-orange-100 text-orange-700",
  invoice: "bg-blue-100 text-blue-700",
};

export default function ClientMessages() {
  const [message, setMessage] = useState("");

  const send = () => {
    if (!message.trim()) return;
    toast.success("Message sent to your CA firm!");
    setMessage("");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 text-sm">Communication from your CA firm</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Message list */}
        <div className="lg:col-span-2 space-y-3">
          {demoMessages.map(msg => (
            <Card key={msg.id} className={`border-0 shadow-sm ${!msg.read ? "ring-2 ring-blue-200" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">CA</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{msg.from}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeStyle[msg.type]}`}>{msg.type}</span>
                        {!msg.read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{msg.time}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2 leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact & compose */}
        <div className="space-y-4">
          {/* CA Contact */}
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-500" />
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">CA</div>
                <div>
                  <p className="font-bold text-gray-900">Sharma & Associates</p>
                  <p className="text-sm text-gray-500">CA Rajesh Sharma</p>
                </div>
              </div>
              <div className="space-y-2">
                <a href="tel:+919876543210" className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700 font-medium">+91 98765 43210</span>
                </a>
                <a href="https://wa.me/919876543210" className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">WhatsApp Chat</span>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Compose */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Send a Message</h3>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
                placeholder="Type your message to your CA firm..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              <button onClick={send} className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
                style={{ background: "linear-gradient(135deg, #059669, #047857)" }}>
                <Send className="w-4 h-4" /> Send Message
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

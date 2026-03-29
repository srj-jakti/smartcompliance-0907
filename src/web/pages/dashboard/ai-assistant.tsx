import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Zap, MessageSquare, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Message { role: "user" | "ai"; content: string; timestamp: string; }

const quickQuestions = [
  "What are the GSTR filing deadlines?",
  "ITR filing last date for FY 2024-25?",
  "TDS rates for professional fees?",
  "What is the penalty for late GST filing?",
  "When to renew DSC?",
  "Advance tax installment dates?",
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Namaste! 🙏 I'm your Smart Compliance AI Assistant. I can help you with:\n\n• **GST rules & deadlines** (GSTR-1, 3B, 9)\n• **ITR filing** sections and deadlines\n• **TDS rates** and deposit dates\n• **DSC management** tips\n• **Penalty calculations**\n• **Compliance calendar** queries\n\nAsk me anything about Indian tax compliance!", timestamp: new Date().toISOString() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (msg?: string) => {
    const text = msg || input.trim();
    if (!text) return;
    setInput("");
    const userMsg: Message = { role: "user", content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text }) });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", content: data.reply, timestamp: data.timestamp }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", content: "Sorry, I encountered an error. Please try again.", timestamp: new Date().toISOString() }]);
    } finally { setLoading(false); }
  };

  const formatContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <p key={i} className="font-bold">{line.slice(2, -2)}</p>;
      }
      if (line.startsWith("• ")) {
        return <li key={i} className="ml-4 list-disc">{line.slice(2)}</li>;
      }
      return <p key={i} className={line === "" ? "mt-2" : ""}>{line}</p>;
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Tax Assistant</h1>
          <p className="text-gray-500 text-sm">Powered by Indian tax law knowledge</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-600 font-medium">Online</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Chat */}
        <div className="lg:col-span-3 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: "600px" }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "ai" ? "bg-blue-600" : "bg-gray-200"}`}>
                  {msg.role === "ai" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-gray-600" />}
                </div>
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                  ${msg.role === "ai" ? "bg-blue-50 text-gray-800 rounded-tl-sm" : "bg-blue-600 text-white rounded-tr-sm"}`}>
                  <div className="space-y-1">{formatContent(msg.content)}</div>
                  <p className={`text-xs mt-2 ${msg.role === "ai" ? "text-gray-400" : "text-blue-200"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-blue-50 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Ask about GST, ITR, TDS, penalties..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={() => send()} disabled={loading || !input.trim()}
                className="btn-blue px-4 py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" /> Quick Questions
              </h3>
              <div className="space-y-2">
                {quickQuestions.map((q, i) => (
                  <button key={i} onClick={() => send(q)}
                    className="w-full text-left text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg px-3 py-2 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-600" /> Connect Channels
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">W</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">WhatsApp Bot</p>
                    <p className="text-xs text-gray-500">Connect WhatsApp API</p>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Setup</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">T</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Telegram Bot</p>
                    <p className="text-xs text-gray-500">Connect Telegram</p>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Setup</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Phone className="w-5 h-5 text-purple-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">SMS Gateway</p>
                    <p className="text-xs text-gray-500">DLT registered sender</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { Send, X, MessageSquare, Search, Users, ChevronLeft } from "lucide-react";
import { getUser } from "@/lib/auth";

interface Message { id: string; senderId: string; senderName: string; senderRole: string; content: string; createdAt: any; isRead: boolean; }
interface Conversation { conversationId: string; otherId: string; otherName: string; otherRole: string; lastMessage: string; unread: number; }

const roleColor: Record<string, string> = { ca: "bg-blue-600", employee: "bg-purple-600", client: "bg-green-600" };
const roleBadge: Record<string, string> = { ca: "bg-blue-100 text-blue-700", employee: "bg-purple-100 text-purple-700", client: "bg-green-100 text-green-700" };

interface ChatProps {
  floating?: boolean;
  defaultOpen?: boolean;
  targetId?: string;
  targetName?: string;
  targetRole?: string;
}

export default function Chat({ floating = true, defaultOpen = false, targetId, targetName, targetRole }: ChatProps) {
  const user = getUser();
  const [open, setOpen] = useState(defaultOpen || !!targetId);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [allUsers, setAllUsers] = useState<{ employees: any[]; clients: any[] }>({ employees: [], clients: [] });
  const [showNewChat, setShowNewChat] = useState(false);
  const [search, setSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<any>(null);

  const firmId = user?.firmId;
  const userId = user?.id;

  const loadConversations = async () => {
    if (!firmId || !userId) return;
    const res = await fetch(`/api/chat/conversations?userId=${userId}&firmId=${firmId}`);
    const data = await res.json();
    setConversations(data);
  };

  const loadMessages = async (convId: string) => {
    if (!firmId) return;
    const res = await fetch(`/api/chat/messages?conversationId=${convId}&firmId=${firmId}`);
    const data = await res.json();
    setMessages(data);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // Mark read
    await fetch("/api/chat/read", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId: convId, userId }) });
    loadConversations();
  };

  useEffect(() => {
    if (!open) return;
    loadConversations();
    fetch(`/api/chat/users?firmId=${firmId}`).then(r => r.json()).then(setAllUsers);
  }, [open]);

  useEffect(() => {
    // Start polling if conversation open
    if (activeConv) {
      pollRef.current = setInterval(() => loadMessages(activeConv.conversationId), 3000);
      return () => clearInterval(pollRef.current);
    }
  }, [activeConv?.conversationId]);

  useEffect(() => {
    // Open chat with target if provided
    if (targetId && targetName && targetRole && open) {
      const convId = [userId, targetId].sort().join("_");
      setActiveConv({ conversationId: convId, otherId: targetId, otherName: targetName, otherRole: targetRole, lastMessage: "", unread: 0 });
      loadMessages(convId);
    }
  }, [targetId, open]);

  const openConv = (conv: Conversation) => {
    setActiveConv(conv);
    setShowNewChat(false);
    loadMessages(conv.conversationId);
  };

  const startNewChat = (other: any) => {
    const convId = [userId, other.id].sort().join("_");
    const conv: Conversation = { conversationId: convId, otherId: other.id, otherName: other.name, otherRole: other.role, lastMessage: "", unread: 0 };
    setActiveConv(conv);
    setShowNewChat(false);
    loadMessages(convId);
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeConv || !user) return;
    setSending(true);
    await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firmId, senderId: userId, senderName: user.name, senderRole: user.role,
        receiverId: activeConv.otherId, receiverName: activeConv.otherName, receiverRole: activeConv.otherRole,
        content: input.trim(),
      }),
    });
    setInput("");
    setSending(false);
    loadMessages(activeConv.conversationId);
    loadConversations();
  };

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);
  const filteredUsers = [...allUsers.employees, ...allUsers.clients].filter(u => u.id !== userId && u.name.toLowerCase().includes(search.toLowerCase()));

  if (!open && floating) {
    return (
      <button onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-2xl z-50 transition-all">
        <MessageSquare className="w-6 h-6 text-white" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">{totalUnread}</span>
        )}
      </button>
    );
  }

  const containerClass = floating
    ? "fixed bottom-6 right-6 w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200"
    : "w-full h-full bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden";

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100" style={{ background: "linear-gradient(135deg, #1e3a8a, #1d4ed8)" }}>
        {activeConv ? (
          <div className="flex items-center gap-2">
            <button onClick={() => { setActiveConv(null); clearInterval(pollRef.current); }} className="text-white/70 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className={`w-8 h-8 rounded-full ${roleColor[activeConv.otherRole] || "bg-gray-500"} flex items-center justify-center text-white text-xs font-bold`}>
              {activeConv.otherName.charAt(0)}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{activeConv.otherName}</p>
              <p className="text-blue-200 text-xs capitalize">{activeConv.otherRole}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">Messages</span>
            {totalUnread > 0 && <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{totalUnread}</span>}
          </div>
        )}
        <div className="flex items-center gap-2">
          {!activeConv && (
            <button onClick={() => setShowNewChat(!showNewChat)} title="New Chat" className="text-white/70 hover:text-white p-1">
              <Users className="w-4 h-4" />
            </button>
          )}
          {floating && <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1"><X className="w-4 h-4" /></button>}
        </div>
      </div>

      {/* New Chat Search */}
      {showNewChat && !activeConv && (
        <div className="border-b border-gray-100 bg-gray-50 p-3">
          <div className="relative mb-2">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search people..."
              className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {filteredUsers.map(u => (
              <button key={u.id} onClick={() => startNewChat(u)}
                className="w-full flex items-center gap-2 p-2 hover:bg-white rounded-lg transition-colors text-left">
                <div className={`w-7 h-7 rounded-full ${roleColor[u.role]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {u.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>
                  <p className={`text-xs px-1.5 py-0.5 rounded inline-block ${roleBadge[u.role]}`}>{u.role}</p>
                </div>
              </button>
            ))}
            {filteredUsers.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No users found</p>}
          </div>
        </div>
      )}

      {/* Conversation List */}
      {!activeConv && (
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <MessageSquare className="w-10 h-10 opacity-30" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs">Click 👥 to start a chat</p>
            </div>
          )}
          {conversations.map(conv => (
            <button key={conv.conversationId} onClick={() => openConv(conv)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 text-left transition-colors ${conv.unread > 0 ? "bg-blue-50/40" : ""}`}>
              <div className={`w-10 h-10 rounded-full ${roleColor[conv.otherRole] || "bg-gray-400"} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                {conv.otherName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900 truncate">{conv.otherName}</p>
                  {conv.unread > 0 && <span className="w-5 h-5 bg-blue-600 rounded-full text-xs text-white flex items-center justify-center font-bold flex-shrink-0">{conv.unread}</span>}
                </div>
                <p className={`text-xs truncate ${conv.unread > 0 ? "text-gray-800 font-medium" : "text-gray-400"}`}>{conv.lastMessage || "Start a conversation"}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded ${roleBadge[conv.otherRole]}`}>{conv.otherRole}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Messages View */}
      {activeConv && (
        <>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">Start the conversation!</div>
            )}
            {messages.map(msg => {
              const isMe = msg.senderId === userId;
              return (
                <div key={msg.id} className={`flex ${isMe ? "flex-row-reverse" : ""} gap-2`}>
                  {!isMe && (
                    <div className={`w-7 h-7 rounded-full ${roleColor[msg.senderRole]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-auto`}>
                      {msg.senderName.charAt(0)}
                    </div>
                  )}
                  <div className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm
                    ${isMe ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white text-gray-800 rounded-tl-sm shadow-sm"}`}>
                    {!isMe && <p className="text-xs font-semibold opacity-70 mb-0.5">{msg.senderName}</p>}
                    <p className="leading-relaxed">{msg.content}</p>
                    <p className={`text-xs mt-1 ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      {isMe && <span className="ml-1">{msg.isRead ? "✓✓" : "✓"}</span>}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
          <div className="p-3 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={sendMessage} disabled={sending || !input.trim()}
                className="w-9 h-9 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-50">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Phone, Mail, MapPin, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getUser } from "@/lib/auth";
import Chat from "@/components/shared/chat";

export default function EmployeeClients() {
  const user = getUser();
  const [clients, setClients] = useState<any[]>([]);
  const [chatTarget, setChatTarget] = useState<{ id: string; name: string; role: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/clients?firmId=${user.firmId}&employeeId=${user.id}`).then(r => r.json()).then(setClients);
  }, []);

  const typeColor: Record<string, string> = {
    individual: "bg-blue-100 text-blue-700", company: "bg-purple-100 text-purple-700",
    firm: "bg-orange-100 text-orange-700", trust: "bg-green-100 text-green-700"
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Clients</h1>
        <p className="text-gray-500 text-sm">{clients.length} clients assigned to you</p>
      </div>

      {clients.length === 0 && <div className="text-center py-12 text-gray-400">No clients assigned yet. Contact your CA.</div>}

      <div className="grid gap-4">
        {clients.map(c => (
          <Card key={c.id} className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm flex-shrink-0">
                    {c.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{c.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${typeColor[c.clientType] || "bg-gray-100 text-gray-600"}`}>{c.clientType}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{c.status}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      {c.phone && <span className="flex items-center gap-1 text-xs text-gray-500"><Phone className="w-3 h-3" />{c.phone}</span>}
                      {c.email && <span className="flex items-center gap-1 text-xs text-gray-500"><Mail className="w-3 h-3" />{c.email}</span>}
                      {c.city && <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin className="w-3 h-3" />{c.city}</span>}
                      {c.pan && <span className="flex items-center gap-1 text-xs text-gray-500"><CreditCard className="w-3 h-3" />PAN: {c.pan}</span>}
                    </div>
                  </div>
                </div>
                <button onClick={() => setChatTarget({ id: c.id, name: c.name, role: "client" })}
                  className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100 flex-shrink-0">
                  💬 Chat
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chat modal when initiated from client card */}
      {chatTarget && (
        <Chat floating={true} defaultOpen={true} targetId={chatTarget.id} targetName={chatTarget.name} targetRole={chatTarget.role} />
      )}
      {!chatTarget && <Chat floating={true} />}
    </div>
  );
}

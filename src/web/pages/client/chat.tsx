import Chat from "@/components/shared/chat";

export default function ClientChat() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 text-sm">Chat with your CA firm & assigned staff</p>
      </div>
      <div style={{ height: "600px" }}>
        <Chat floating={false} defaultOpen={true} />
      </div>
    </div>
  );
}

import Chat from "@/components/shared/chat";

export default function EmployeeChat() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 text-sm">Chat with your CA and assigned clients</p>
      </div>
      <div className="flex-1" style={{ minHeight: "560px" }}>
        <Chat floating={false} defaultOpen={true} />
      </div>
    </div>
  );
}

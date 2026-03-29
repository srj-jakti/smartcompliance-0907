import { useState } from "react";
import { Upload, FileText, Image, File, FolderOpen, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const myDocs = [
  { id: "1", name: "PAN Card.pdf", category: "pan", fileType: "pdf", fileSize: 245000, date: "2025-07-01", sharedBy: "CA Firm" },
  { id: "2", name: "ITR-V Acknowledgement FY24.pdf", category: "itr", fileType: "pdf", fileSize: 180000, date: "2025-07-15", sharedBy: "CA Firm" },
  { id: "3", name: "GST Registration Certificate.pdf", category: "gst", fileType: "pdf", fileSize: 320000, date: "2025-06-10", sharedBy: "CA Firm" },
];

const catColor: Record<string, string> = {
  pan: "bg-blue-100 text-blue-700", gst: "bg-green-100 text-green-700",
  itr: "bg-purple-100 text-purple-700", aadhar: "bg-orange-100 text-orange-700",
  bank: "bg-yellow-100 text-yellow-700", other: "bg-gray-100 text-gray-600"
};

export default function ClientDocuments() {
  const [drag, setDrag] = useState(false);
  const [tab, setTab] = useState<"shared" | "upload">("shared");

  const formatSize = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-500 text-sm">View documents shared by your CA & upload files</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        <button onClick={() => setTab("shared")} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === "shared" ? "bg-white shadow text-green-700" : "text-gray-500"}`}>
          Shared with Me ({myDocs.length})
        </button>
        <button onClick={() => setTab("upload")} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === "upload" ? "bg-white shadow text-green-700" : "text-gray-500"}`}>
          Upload Documents
        </button>
      </div>

      {tab === "shared" && (
        <div className="space-y-3">
          {myDocs.map(doc => (
            <Card key={doc.id} className="border-0 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                        <span className={`px-2 py-0.5 rounded font-medium ${catColor[doc.category] || catColor.other}`}>{doc.category.toUpperCase()}</span>
                        <span>{formatSize(doc.fileSize)}</span>
                        <span>Shared by {doc.sharedBy}</span>
                        <span>{new Date(doc.date).toLocaleDateString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 flex items-center gap-1">
                    <File className="w-3 h-3" /> Download
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === "upload" && (
        <div>
          <div
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); toast.success("File uploaded successfully!"); }}
            className={`border-2 border-dashed rounded-2xl p-10 text-center mb-6 cursor-pointer transition-all
              ${drag ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300 hover:bg-gray-50"}`}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 font-semibold text-lg">Drop files here or click to upload</p>
            <p className="text-gray-400 text-sm mt-2">PDF, JPG, PNG — Max 20MB per file</p>
            <button className="mt-4 btn-blue px-6 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
              onClick={() => toast.success("File browser opened")}>
              <Upload className="w-4 h-4" /> Browse Files
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Secure Upload</span>
            </div>
            <p className="text-sm text-blue-600">All uploaded documents are encrypted and only visible to you and your CA firm. Maximum security ensured.</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {["Aadhar Card", "PAN Card", "Bank Statements", "Previous ITR", "GST Returns", "Balance Sheet"].map((cat, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-blue-700 bg-white rounded-lg px-3 py-2">
                  <span className="text-blue-400">📎</span> {cat}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

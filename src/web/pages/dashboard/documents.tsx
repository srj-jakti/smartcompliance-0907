import { useState } from "react";
import { Upload, FolderOpen, FileText, Image, File } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const sampleDocs = [
  { id: "1", name: "PAN Card - Rajesh Kumar.pdf", category: "pan", clientName: "Rajesh Kumar", fileType: "pdf", fileSize: 245000, uploadedBy: "Admin", createdAt: "2025-07-01" },
  { id: "2", name: "GSTIN Certificate - Sharma & Associates.pdf", category: "gst", clientName: "Sharma & Associates", fileType: "pdf", fileSize: 180000, uploadedBy: "Admin", createdAt: "2025-07-05" },
  { id: "3", name: "ITR-V FY2024-25 - TechVision.pdf", category: "itr", clientName: "TechVision Pvt Ltd", fileType: "pdf", fileSize: 320000, uploadedBy: "Staff", createdAt: "2025-07-15" },
  { id: "4", name: "Aadhar Card - Priya Mehta.jpg", category: "aadhar", clientName: "Priya Mehta", fileType: "jpg", fileSize: 156000, uploadedBy: "Client", createdAt: "2025-07-10" },
  { id: "5", name: "Bank Statement Q1 - Gupta Trading.pdf", category: "bank", clientName: "Gupta Trading Co", fileType: "pdf", fileSize: 890000, uploadedBy: "Client", createdAt: "2025-07-20" },
];

const catColor: Record<string, string> = { pan: "bg-blue-100 text-blue-700", gst: "bg-green-100 text-green-700", itr: "bg-purple-100 text-purple-700", aadhar: "bg-orange-100 text-orange-700", bank: "bg-yellow-100 text-yellow-700", other: "bg-gray-100 text-gray-600" };

export default function Documents() {
  const [filter, setFilter] = useState("all");
  const [drag, setDrag] = useState(false);

  const filtered = sampleDocs.filter(d => filter === "all" || d.category === filter);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500 text-sm">{filtered.length} files</p>
        </div>
        <button className="btn-blue flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
          <Upload className="w-4 h-4" /> Upload
        </button>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); }}
        className={`border-2 border-dashed rounded-2xl p-8 text-center mb-6 transition-all cursor-pointer
          ${drag ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"}`}
      >
        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 font-medium">Drag & drop files here, or click to upload</p>
        <p className="text-gray-400 text-sm mt-1">PDF, JPG, PNG, Excel — Max 50MB per file</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["all", "pan", "gst", "itr", "aadhar", "bank", "other"].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${filter === cat ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}>
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map(doc => (
          <Card key={doc.id} className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    {doc.fileType === "pdf" ? <FileText className="w-5 h-5 text-red-500" /> :
                     doc.fileType === "jpg" || doc.fileType === "png" ? <Image className="w-5 h-5 text-blue-500" /> :
                     <File className="w-5 h-5 text-gray-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${catColor[doc.category]||catColor.other}`}>{doc.category.toUpperCase()}</span>
                      <span className="text-xs text-gray-400">{doc.clientName}</span>
                      <span className="text-xs text-gray-400">{formatSize(doc.fileSize)}</span>
                      <span className="text-xs text-gray-400">by {doc.uploadedBy}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100">View</button>
                  <button className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100">Download</button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

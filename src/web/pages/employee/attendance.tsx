import { useState } from "react";
import { Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";

const today = new Date().toISOString().split("T")[0];

export default function EmployeeAttendance() {
  const user = getUser();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [saved, setSaved] = useState(false);

  const now = () => new Date().toTimeString().slice(0, 5);

  const handleCheckIn = () => {
    const t = now(); setCheckIn(t);
    toast.success(`Checked in at ${t}`);
  };

  const handleCheckOut = () => {
    const t = now(); setCheckOut(t);
    toast.success(`Checked out at ${t}`);
  };

  const save = async () => {
    if (!user) return;
    await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firmId: user.firmId, employeeId: user.id, date: today, checkIn, checkOut, status: "present" })
    });
    setSaved(true); toast.success("Attendance saved!");
  };

  const workHours = checkIn && checkOut ? (() => {
    const [ih, im] = checkIn.split(":").map(Number);
    const [oh, om] = checkOut.split(":").map(Number);
    const diff = (oh * 60 + om) - (ih * 60 + im);
    return diff > 0 ? `${Math.floor(diff / 60)}h ${diff % 60}m` : "—";
  })() : null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
        <p className="text-gray-500 text-sm">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      <div className="max-w-md">
        <Card className="border-0 shadow-sm mb-4">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500 capitalize">{user?.empRole} • {user?.firmName}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-green-600 mb-1">Check In</p>
                  <p className="text-2xl font-bold text-green-700">{checkIn || "—:—"}</p>
                  <button onClick={handleCheckIn} disabled={!!checkIn}
                    className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white text-xs py-1.5 rounded-lg font-medium disabled:opacity-50 transition-colors">
                    {checkIn ? "✓ Checked In" : "Check In Now"}
                  </button>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-blue-600 mb-1">Check Out</p>
                  <p className="text-2xl font-bold text-blue-700">{checkOut || "—:—"}</p>
                  <button onClick={handleCheckOut} disabled={!checkIn || !!checkOut}
                    className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 rounded-lg font-medium disabled:opacity-50 transition-colors">
                    {checkOut ? "✓ Checked Out" : "Check Out"}
                  </button>
                </div>
              </div>

              {workHours && (
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-purple-600 mb-1">Work Hours Today</p>
                  <p className="text-3xl font-bold text-purple-700">{workHours}</p>
                </div>
              )}

              {checkIn && !saved && (
                <button onClick={save} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Save Attendance
                </button>
              )}
              {saved && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center text-green-700 font-medium text-sm">
                  ✓ Attendance saved for today!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
          <p className="font-medium mb-2">📋 Attendance Rules</p>
          <ul className="space-y-1 text-xs text-gray-500">
            <li>• Office hours: 10:00 AM – 6:00 PM</li>
            <li>• Half day: less than 4 hours work</li>
            <li>• Mark attendance before 11 AM</li>
            <li>• For leave, contact your manager</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

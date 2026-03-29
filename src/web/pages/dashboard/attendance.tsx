import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, Calendar, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";

const today = new Date().toISOString().split("T")[0];

export default function Attendance() {
  const user = getUser();
  const [employees, setEmployees] = useState<any[]>([]);
  const [date, setDate] = useState(today);
  const [attendance, setAttendance] = useState<Record<string, { status: string; checkIn: string; checkOut: string }>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user?.firmId) return;
    fetch(`/api/employees?firmId=${user.firmId}`)
      .then(r => r.json())
      .then((emps: any[]) => {
        setEmployees(emps);
        // init default attendance
        const init: Record<string, any> = {};
        emps.forEach(e => { init[e.id] = { status: "present", checkIn: "09:30", checkOut: "" }; });
        setAttendance(init);
      });
  }, []);

  const update = (empId: string, field: string, value: string) => {
    setAttendance(prev => ({ ...prev, [empId]: { ...prev[empId], [field]: value } }));
  };

  const save = async () => {
    if (!user?.firmId) return;
    for (const [empId, att] of Object.entries(attendance)) {
      await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firmId: user.firmId, employeeId: empId, date, ...att }),
      });
    }
    setSaved(true);
    toast.success("Attendance saved!");
  };

  const presentCount = Object.values(attendance).filter(a => a.status === "present").length;
  const absentCount = Object.values(attendance).filter(a => a.status === "absent").length;
  const halfDayCount = Object.values(attendance).filter(a => a.status === "half_day").length;

  const statusColor: Record<string, string> = {
    present: "status-completed", absent: "status-overdue",
    half_day: "status-pending", leave: "status-in_progress"
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500 text-sm">Track staff attendance for {new Date(date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="date" value={date} onChange={e => { setDate(e.target.value); setSaved(false); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={save} className="btn-blue px-4 py-2 rounded-lg text-sm font-medium">
            {saved ? "✓ Saved" : "Save"}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Staff", value: employees.length, color: "bg-blue-50 text-blue-600", icon: UserCheck },
          { label: "Present", value: presentCount, color: "bg-green-50 text-green-600", icon: CheckCircle },
          { label: "Absent", value: absentCount, color: "bg-red-50 text-red-600", icon: XCircle },
          { label: "Half Day", value: halfDayCount, color: "bg-yellow-50 text-yellow-600", icon: Clock },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`${s.color} rounded-xl p-4 flex items-center gap-3`}>
              <Icon className="w-5 h-5" />
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs opacity-75">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {employees.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No employees found. Add team members first.</p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Employee</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Check In</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Check Out</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employees.map(emp => {
                    const att = attendance[emp.id] || { status: "present", checkIn: "", checkOut: "" };
                    const hours = att.checkIn && att.checkOut ? (() => {
                      const [ih, im] = att.checkIn.split(":").map(Number);
                      const [oh, om] = att.checkOut.split(":").map(Number);
                      const diff = (oh * 60 + om) - (ih * 60 + im);
                      return diff > 0 ? `${Math.floor(diff / 60)}h ${diff % 60}m` : "-";
                    })() : att.checkIn ? "Active" : "-";

                    return (
                      <tr key={emp.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                              {emp.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{emp.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 capitalize">{emp.role} • {emp.specialization?.toUpperCase()}</td>
                        <td className="px-4 py-3">
                          <select value={att.status} onChange={e => update(emp.id, "status", e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${statusColor[att.status] || ""}`}>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="half_day">Half Day</option>
                            <option value="leave">Leave</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input type="time" value={att.checkIn} onChange={e => update(emp.id, "checkIn", e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-28" />
                        </td>
                        <td className="px-4 py-3">
                          <input type="time" value={att.checkOut} onChange={e => update(emp.id, "checkOut", e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-28" />
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${hours === "Active" ? "text-green-600" : "text-gray-700"}`}>{hours}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

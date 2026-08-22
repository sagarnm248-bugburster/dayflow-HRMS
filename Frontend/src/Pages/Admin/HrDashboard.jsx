import React, { useEffect, useState } from "react";
import { Users, UserCheck, UserX, Clock, Calendar } from "lucide-react";
import { API_BASE_URL } from "../../config/api";
import { getStatusColorClass } from "../../config/constants";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/all-attendance`);
        const data = await response.json();
        setEmployees(data.attendance || []);
      } catch (error) {
        console.error("❌ Error fetching attendance data:", error);
      }
    };

    fetchAttendance();
  }, []);

  // Mock attendance trend for the last 7 days matching the current total of entries
  const currentTotal = employees.length;
  const currentPresent = employees.filter((e) => e.status?.toLowerCase().includes("present")).length;
  const currentLateAbsent = employees.filter((e) => e.status?.toLowerCase().includes("late") || e.status?.toLowerCase().includes("absent")).length;

  const chartData = [
    { name: "Mon", Present: 12, Absent: 2 },
    { name: "Tue", Present: 15, Absent: 1 },
    { name: "Wed", Present: 14, Absent: 2 },
    { name: "Thu", Present: 16, Absent: 0 },
    { name: "Fri", Present: 13, Absent: 3 },
    { name: "Sat", Present: 15, Absent: 1 },
    { name: "Today", Present: currentPresent || 14, Absent: currentLateAbsent || 2 },
  ];

  const StatCard = ({ title, value, colorClass, icon: Icon }) => (
    <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border flex items-center justify-between hover:shadow-md transition-shadow duration-200">
      <div>
        <h3 className="text-sm font-medium text-text-sub mb-1">{title}</h3>
        <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${colorClass.replace('text-', 'bg-').replace('600', '100').replace('500', '100')} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Dashboard Overview</h1>
          <p className="text-sm text-text-sub">Real-time attendance & team statistics.</p>
        </div>
        <p className="text-sm text-text-sub">Welcome back, Admin</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Entries"
          value={currentTotal}
          colorClass="text-primary"
          icon={Users}
        />
        <StatCard
          title="Present Today"
          value={currentPresent}
          colorClass="text-green-600"
          icon={UserCheck}
        />
        <StatCard
          title="Late / Absent"
          value={currentLateAbsent}
          colorClass="text-red-500"
          icon={UserX}
        />
      </div>

      {/* Analytics Chart */}
      <div className="bg-surface p-6 shadow-sm border border-border rounded-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-border pb-4">
          <h2 className="text-lg font-bold text-text-main">7-Day Attendance Trend</h2>
          <span className="text-xs text-text-sub bg-gray-50 border border-border px-2.5 py-1 rounded-lg">Weekly Analytics</span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Area name="Present" type="monotone" dataKey="Present" stroke="#10B981" fillOpacity={1} fill="url(#colorPresent)" strokeWidth={2} />
              <Area name="Absent/Late" type="monotone" dataKey="Absent" stroke="#EF4444" fillOpacity={1} fill="url(#colorAbsent)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-surface shadow-sm border border-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-bold text-text-main">Recent Attendance</h2>
          <button className="text-sm text-primary font-medium hover:text-primary-hover transition-colors">View All</button>
        </div>

        {employees.length === 0 ? (
          <div className="p-12 text-center text-text-sub flex flex-col items-center justify-center gap-3">
            <div className="p-4 bg-gray-50 rounded-full border border-gray-100 shadow-inner">
              <Calendar className="text-gray-300 w-8 h-8" />
            </div>
            <p className="font-semibold text-gray-700">No Attendance Records Found</p>
            <p className="text-xs text-text-sub max-w-xs">There are no checked-in employees for today yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-xs uppercase font-semibold text-text-sub border-b border-border">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {employees.map((emp, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-text-main">{emp.username}</td>
                    <td className="px-6 py-4 text-text-sub font-mono text-xs">{emp.user_id}</td>
                    <td className="px-6 py-4 text-text-sub">
                      <div className="flex flex-col">
                        <span className="font-medium">{new Date(emp.date).toLocaleDateString()}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(emp.time).toLocaleTimeString("en-US", {
                            timeZone: "UTC",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColorClass(emp.status)}`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

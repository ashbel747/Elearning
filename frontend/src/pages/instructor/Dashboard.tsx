import React, { useEffect, useState } from "react";
import { fetchDashboardData } from "../../api/instructorApi";
import type { InstructorDashboardData } from "../../types/instructor";
import MetricsCard from "../../components/analytics/MetricsCard";
import { Users, BookOpen, DollarSign } from "lucide-react";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<InstructorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!data) return <p className="p-6 text-red-500">Failed to load data.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Instructor Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <MetricsCard title="Total Courses" value={data.totalCourses} icon={<BookOpen />} />
        <MetricsCard title="Total Students" value={data.totalStudents} icon={<Users />} />
        <MetricsCard title="Revenue" value={`$${data.totalRevenue}`} icon={<DollarSign />} />
      </div>

      {/* Recent Enrollments */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Enrollments</h2>
        <ul>
        {data.recentEnrollments?.length ? (
            data.recentEnrollments.map((e, idx) => (
            <li
                key={idx}
                className="border-b border-gray-200 dark:border-gray-700 py-2"
            >
                {e.studentName} enrolled in <strong>{e.courseTitle}</strong> on{" "}
                {new Date(e.date).toLocaleDateString()}
            </li>
            ))
        ) : (
            <li>No recent enrollments.</li>
        )}
        </ul>

      </div>
    </div>
  );
};

export default Dashboard;

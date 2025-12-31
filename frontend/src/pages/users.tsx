import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { PlatformDistribution } from "@/components/dashboard/PlatformDistribution";
import { GeoDistribution } from "@/components/dashboard/GeoDistribution";
import { UserChart } from "@/components/dashboard/UserChart";
import { UsersList } from "@/components/users/UsersList";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { subDays } from "date-fns";

const usersData = [
  { id: "01KCR8XTGQ5W7HR0MAV22YXDHC", name: "Antique Alex", platform: "iOS", country: "Türkiye", countryCode: "TR", firstSeen: "18/12/2025 11:23 AM", firstSeenDate: new Date("2025-12-18T11:23:00") },
  { id: "01KCQAE9RP013RTJZE10SQX5TR", name: "Emotional Tyrese", platform: "iOS", country: "Türkiye", countryCode: "TR", firstSeen: "18/12/2025 02:31 AM", firstSeenDate: new Date("2025-12-18T02:31:00") },
  { id: "01KCQAE9RP013RTJZE10SQX5TS", name: "Creative Luna", platform: "Android", country: "Germany", countryCode: "DE", firstSeen: "19/12/2025 10:15 AM", firstSeenDate: new Date("2025-12-19T10:15:00") },
  { id: "01KCQAE9RP013RTJZE10SQX5TT", name: "Digital Sarah", platform: "iOS", country: "United States", countryCode: "US", firstSeen: "20/12/2025 03:45 PM", firstSeenDate: new Date("2025-12-20T15:45:00") },
  { id: "01KCQAE9RP013RTJZE10SQX5TU", name: "Pixel Hunter", platform: "Web", country: "Germany", countryCode: "DE", firstSeen: "21/12/2025 08:30 AM", firstSeenDate: new Date("2025-12-21T08:30:00") },
  { id: "01KCQAE9RP013RTJZE10SQX5TV", name: "Neon Phoenix", platform: "iOS", country: "Japan", countryCode: "JP", firstSeen: "21/12/2025 02:15 PM", firstSeenDate: new Date("2025-12-21T14:15:00") },
  { id: "01KCQAE9RP013RTJZE10SQX5TW", name: "Shadow Wolf", platform: "Android", country: "Brazil", countryCode: "BR", firstSeen: "22/12/2025 09:00 AM", firstSeenDate: new Date("2025-12-22T09:00:00") },
  { id: "01KCQAE9RP013RTJZE10SQX5TX", name: "Crystal Rain", platform: "iOS", country: "France", countryCode: "FR", firstSeen: "22/12/2025 04:30 PM", firstSeenDate: new Date("2025-12-22T16:30:00") },
  { id: "01KCQAE9RP013RTJZE10SQX5TY", name: "Mystic Flame", platform: "Web", country: "United Kingdom", countryCode: "GB", firstSeen: "23/12/2025 11:45 AM", firstSeenDate: new Date("2025-12-23T11:45:00") },
  { id: "01KCQAE9RP013RTJZE10SQX5TZ", name: "Thunder Bolt", platform: "Android", country: "India", countryCode: "IN", firstSeen: "23/12/2025 06:20 PM", firstSeenDate: new Date("2025-12-23T18:20:00") },
  { id: "01KCQAE9RP013RTJZE10SQX5UA", name: "Silver Storm", platform: "iOS", country: "Australia", countryCode: "AU", firstSeen: "24/12/2025 07:10 AM", firstSeenDate: new Date("2025-12-24T07:10:00") },
  { id: "01KCQAE9RP013RTJZE10SQX5UB", name: "Golden Star", platform: "iOS", country: "Canada", countryCode: "CA", firstSeen: "24/12/2025 12:00 PM", firstSeenDate: new Date("2025-12-24T12:00:00") },
  { id: "01KCQAE9RP013RTJZE10SQX5UC", name: "Azure Wave", platform: "Android", country: "Netherlands", countryCode: "NL", firstSeen: "24/12/2025 03:25 PM", firstSeenDate: new Date("2025-12-24T15:25:00") },
  { id: "01KCQAE9RP013RTJZE10SQX5UD", name: "Ruby Spark", platform: "Web", country: "Spain", countryCode: "ES", firstSeen: "25/12/2025 08:00 AM", firstSeenDate: new Date("2025-12-25T08:00:00") },
  { id: "01KCQAE9RP013RTJZE10SQX5UE", name: "Emerald Dream", platform: "iOS", country: "Italy", countryCode: "IT", firstSeen: "25/12/2025 10:30 AM", firstSeenDate: new Date("2025-12-25T10:30:00") },
];

const chartData = [
  { date: "18/12/2025", value: 2 },
  { date: "19/12/2025", value: 3 },
  { date: "20/12/2025", value: 4 },
  { date: "21/12/2025", value: 6 },
  { date: "22/12/2025", value: 8 },
  { date: "23/12/2025", value: 10 },
  { date: "24/12/2025", value: 13 },
  { date: "25/12/2025", value: 15 },
];

const dailyActiveData = [
  { date: "18/12/2025", value: 2 },
  { date: "19/12/2025", value: 1 },
  { date: "20/12/2025", value: 1 },
  { date: "21/12/2025", value: 2 },
  { date: "22/12/2025", value: 2 },
  { date: "23/12/2025", value: 2 },
  { date: "24/12/2025", value: 3 },
  { date: "25/12/2025", value: 2 },
];

const Users = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const filteredUsers = useMemo(() => {
    return usersData.filter((user) => {
      return user.firstSeenDate >= dateRange.from && user.firstSeenDate <= dateRange.to;
    });
  }, [dateRange]);

  const platformData = useMemo(() => {
    const counts = { iOS: 0, Android: 0, Web: 0 };
    filteredUsers.forEach((u) => {
      if (u.platform in counts) counts[u.platform as keyof typeof counts]++;
    });
    const total = filteredUsers.length || 1;
    return [
      { name: "iOS", icon: "ios" as const, count: counts.iOS, percentage: Math.round((counts.iOS / total) * 100) },
      { name: "Android", icon: "android" as const, count: counts.Android, percentage: Math.round((counts.Android / total) * 100) },
      { name: "Web", icon: "web" as const, count: counts.Web, percentage: Math.round((counts.Web / total) * 100) },
    ];
  }, [filteredUsers]);

  const countryData = useMemo(() => {
    const counts: Record<string, { name: string; code: string; count: number }> = {};
    filteredUsers.forEach((u) => {
      if (!counts[u.countryCode]) counts[u.countryCode] = { name: u.country, code: u.countryCode, count: 0 };
      counts[u.countryCode].count++;
    });
    const total = filteredUsers.length || 1;
    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .map((c) => ({ name: c.name, countryCode: c.code, count: c.count, percentage: Math.round((c.count / total) * 100) }));
  }, [filteredUsers]);

  return (
    <DashboardLayout
      title="Users"
      description="Track and analyze users in your application"
      headerAction={
        <DateRangeFilter
          showPresets={true}
          defaultPreset="7d"
          onChange={(range) => setDateRange(range)}
        />
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Users" value={filteredUsers.length} change={{ value: "200%", isPositive: true, suffix: "from yesterday" }} />
        <StatCard label="Daily Active Users" value={Math.min(filteredUsers.length, 5)} change={{ value: "150%", isPositive: true, suffix: "from yesterday" }} />
        <StatCard label="Online Users" value={Math.floor(Math.random() * 3)} indicator={{ type: "online", label: "Users currently online" }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <PlatformDistribution data={platformData} />
        <GeoDistribution countries={countryData} cities={[]} />
      </div>

      <div className="mb-6">
        <UserChart totalUsersData={chartData} dailyActiveData={dailyActiveData} />
      </div>

      <UsersList users={filteredUsers} />
    </DashboardLayout>
  );
};

export default Users;

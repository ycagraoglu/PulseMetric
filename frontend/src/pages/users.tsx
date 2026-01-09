import { useState, useMemo, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { PlatformDistribution } from "@/components/dashboard/PlatformDistribution";
import { GeoDistribution } from "@/components/dashboard/GeoDistribution";
import { UserChart } from "@/components/dashboard/UserChart";
import { UsersList } from "@/components/users/UsersList";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import {
  StatCardSkeleton,
  ChartSkeleton,
  UsersTableSkeleton,
  PlatformDistributionSkeleton,
  GeoDistributionSkeleton,
} from "@/components/ui/skeletons";
import { subDays, format } from "date-fns";
import {
  useUsers,
  useUsersCount,
  usePlatformDistribution,
  useGeoDistribution,
  useUsersChart,
  userKeys,
} from "@/hooks/useUsers";
import { formatUserName, getDefaultPlatforms, getDefaultGeo } from "@/services/users";

// ============================================
// Types
// ============================================

interface DateRange {
  from: Date;
  to: Date;
}

interface UserDisplay {
  id: string;
  name: string;
  platform: string;
  country: string;
  countryCode: string;
  firstSeen: string;
  firstSeenDate: Date;
}

// ============================================
// Constants
// ============================================

const PAGE_TITLE = "Users";
const PAGE_DESCRIPTION = "Track and analyze users in your application";
const DEFAULT_DAYS = 7;

const DEFAULT_DATE_RANGE: DateRange = {
  from: subDays(new Date(), DEFAULT_DAYS),
  to: new Date(),
};

// ============================================
// Sub-Components
// ============================================

interface KpiCardsProps {
  isLoading: boolean;
  isError: boolean;
  totalUsers: number;
  dailyActiveUsers: number;
  onlineUsers: number;
  changePercent: number;
}

const KpiCards = ({
  isLoading,
  isError,
  totalUsers,
  dailyActiveUsers,
  onlineUsers,
  changePercent,
}: KpiCardsProps) => {
  if (isLoading) {
    return (
      <>
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </>
    );
  }

  if (isError) return null;

  return (
    <>
      <StatCard
        label="Total Users"
        value={totalUsers}
        change={
          changePercent !== 0
            ? {
              value: `${Math.abs(changePercent)}%`,
              isPositive: changePercent > 0,
              suffix: "from yesterday",
            }
            : undefined
        }
      />
      <StatCard label="Daily Active Users" value={dailyActiveUsers} />
      <StatCard
        label="Online Users"
        value={onlineUsers}
        indicator={{ type: "online", label: "Users currently online" }}
      />
    </>
  );
};

interface DistributionSectionProps {
  platformLoading: boolean;
  platformError: boolean;
  platforms: ReturnType<typeof getDefaultPlatforms>;
  geoLoading: boolean;
  geoError: boolean;
  geo: ReturnType<typeof getDefaultGeo>;
}

const DistributionSection = ({
  platformLoading,
  platformError,
  platforms,
  geoLoading,
  geoError,
  geo,
}: DistributionSectionProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
    {platformLoading ? (
      <PlatformDistributionSkeleton />
    ) : platformError ? (
      <ErrorState title="Platform verileri yüklenemedi" />
    ) : (
      <PlatformDistribution data={platforms} />
    )}

    {geoLoading ? (
      <GeoDistributionSkeleton />
    ) : geoError ? (
      <ErrorState title="Coğrafi veriler yüklenemedi" />
    ) : geo.countries.length === 0 ? (
      <EmptyState
        icon="chart"
        title="Coğrafi veri yok"
        message="Henüz coğrafi dağılım verisi bulunmuyor."
      />
    ) : (
      <GeoDistribution countries={geo.countries} cities={geo.cities} />
    )}
  </div>
);

interface ChartSectionProps {
  isLoading: boolean;
  isError: boolean;
  totalUsersData: { date: string; value: number }[];
  dailyActiveData: { date: string; value: number }[];
}

const ChartSection = ({
  isLoading,
  isError,
  totalUsersData,
  dailyActiveData,
}: ChartSectionProps) => {
  if (isLoading) return <ChartSkeleton />;
  if (isError) return <ErrorState title="Grafik verileri yüklenemedi" />;
  if (totalUsersData.length === 0) {
    return (
      <EmptyState
        icon="chart"
        title="Grafik verisi yok"
        message="Seçilen tarih aralığında gösterilecek veri bulunmuyor."
      />
    );
  }
  return <UserChart totalUsersData={totalUsersData} dailyActiveData={dailyActiveData} />;
};

interface UsersListSectionProps {
  isLoading: boolean;
  isError: boolean;
  hasNoData: boolean;
  users: UserDisplay[];
  onRetry: () => void;
}

const UsersListSection = ({
  isLoading,
  isError,
  hasNoData,
  users,
  onRetry,
}: UsersListSectionProps) => {
  if (isLoading) return <UsersTableSkeleton rows={5} />;
  if (isError) return <ErrorState title="Kullanıcı listesi yüklenemedi" onRetry={onRetry} />;
  if (hasNoData) {
    return (
      <EmptyState
        icon="users"
        title="Henüz kullanıcı yok"
        message="Seçilen tarih aralığında kaydedilmiş kullanıcı bulunmuyor. Web sitenize pulse.js scriptini ekleyerek veri toplamaya başlayabilirsiniz."
      />
    );
  }
  return <UsersList users={users} />;
};

// ============================================
// Main Component
// ============================================

const Users = () => {
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState<DateRange>(DEFAULT_DATE_RANGE);

  // Queries using existing hooks
  const usersQuery = useUsers({
    from: format(dateRange.from, "yyyy-MM-dd"),
    to: format(dateRange.to, "yyyy-MM-dd"),
  });
  const countQuery = useUsersCount();
  const platformQuery = usePlatformDistribution();
  const geoQuery = useGeoDistribution();
  const chartQuery = useUsersChart(DEFAULT_DAYS);

  // Transform users data
  const users: UserDisplay[] = useMemo(() => {
    if (!usersQuery.data?.length) return [];
    return usersQuery.data.map((u) => ({
      id: u.id,
      name: formatUserName(u),
      platform: u.platform,
      country: u.country,
      countryCode: u.countryCode,
      firstSeen: u.firstSeen,
      firstSeenDate: new Date(u.firstSeen),
    }));
  }, [usersQuery.data]);

  // Platform data with defaults
  const platforms = useMemo(
    () => platformQuery.data ?? getDefaultPlatforms(),
    [platformQuery.data]
  );

  // Geo data with defaults
  const geo = useMemo(() => geoQuery.data ?? getDefaultGeo(), [geoQuery.data]);

  // Chart data
  const totalUsersChartData = chartQuery.data?.totalUsers ?? [];
  const dailyActiveChartData = chartQuery.data?.dailyActive ?? [];

  // KPI values
  const totalUsers = countQuery.data?.total ?? 0;
  const dailyActiveUsers = countQuery.data?.dailyActive ?? 0;
  const onlineUsers = countQuery.data?.online ?? 0;
  const changePercent = countQuery.data?.changePercent ?? 0;

  // Derived state
  const isLoading = usersQuery.isLoading || countQuery.isLoading;
  const hasError = usersQuery.isError || countQuery.isError;
  const hasNoData = !isLoading && !hasError && users.length === 0;

  // Handlers
  const handleRetryAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: userKeys.all });
  }, [queryClient]);

  const handleDateRangeChange = useCallback((range: DateRange) => {
    setDateRange(range);
  }, []);

  return (
    <DashboardLayout
      title={PAGE_TITLE}
      description={PAGE_DESCRIPTION}
      headerAction={
        <DateRangeFilter
          showPresets
          defaultPreset="7d"
          onChange={handleDateRangeChange}
        />
      }
    >
      {/* Global Error State */}
      {hasError && (
        <div className="mb-6">
          <ErrorState
            title="Kullanıcı verileri yüklenemedi"
            message="Backend API'ye bağlanılamadı. Lütfen backend servisinin çalıştığından emin olun."
            onRetry={handleRetryAll}
          />
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KpiCards
          isLoading={countQuery.isLoading}
          isError={countQuery.isError}
          totalUsers={totalUsers}
          dailyActiveUsers={dailyActiveUsers}
          onlineUsers={onlineUsers}
          changePercent={changePercent}
        />
      </div>

      {/* Platform & Geo Distribution */}
      <DistributionSection
        platformLoading={platformQuery.isLoading}
        platformError={platformQuery.isError}
        platforms={platforms}
        geoLoading={geoQuery.isLoading}
        geoError={geoQuery.isError}
        geo={geo}
      />

      {/* Chart */}
      <div className="mb-6">
        <ChartSection
          isLoading={chartQuery.isLoading}
          isError={chartQuery.isError}
          totalUsersData={totalUsersChartData}
          dailyActiveData={dailyActiveChartData}
        />
      </div>

      {/* Users List */}
      <UsersListSection
        isLoading={usersQuery.isLoading}
        isError={usersQuery.isError}
        hasNoData={hasNoData}
        users={users}
        onRetry={() => usersQuery.refetch()}
      />
    </DashboardLayout>
  );
};

export default Users;

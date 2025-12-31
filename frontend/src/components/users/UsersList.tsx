import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Monitor, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import { useNavigate } from "react-router-dom";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { PlatformFilter } from "@/components/filters/PlatformFilter";
import { CountryFlag } from "@/components/ui/country-flag";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  name: string;
  platform: string;
  country: string;
  countryCode: string;
  firstSeen: string;
  firstSeenDate: Date;
}

interface UsersListProps {
  users: User[];
}

export function UsersList({ users }: UsersListProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [platformFilter, setPlatformFilter] = useState<"all" | "iOS" | "Android" | "Web">("all");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase());
      
      // Platform filter
      const matchesPlatform = platformFilter === "all" || user.platform === platformFilter;
      
      // Date range filter
      let matchesDate = true;
      if (dateRange) {
        const userDate = user.firstSeenDate;
        matchesDate = userDate >= dateRange.from && userDate <= dateRange.to;
      }

      return matchesSearch && matchesPlatform && matchesDate;
    });
  }, [users, search, platformFilter, dateRange]);

  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const paginatedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setPage(1);
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5">
        <div className="mb-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
            ALL USERS
          </h3>
          <p className="text-sm text-muted-foreground">Complete list of all users</p>
        </div>

        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search User"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                handleFilterChange();
              }}
              className="w-64 bg-secondary border-border"
            />
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <DateRangeFilter
              showPresets={false}
              onChange={(range) => {
                setDateRange(range);
                handleFilterChange();
              }}
            />
            <PlatformFilter
              onChange={(platform) => {
                setPlatformFilter(platform);
                handleFilterChange();
              }}
            />
          </div>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground p-4">
                  USER
                </th>
                <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground p-4">
                  PLATFORM
                </th>
                <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground p-4">
                  COUNTRY
                </th>
                <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground p-4">
                  FIRST SEEN
                </th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/users/${user.id}`)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={user.name} className="w-8 h-8" />
                        <span className="text-foreground">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Monitor className="w-4 h-4" />
                        {user.platform}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CountryFlag countryCode={user.countryCode} showCode showName />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {user.firstSeen}
                      </div>
                    </td>
                    <td className="p-4">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages || 1} ({filteredUsers.length} total)
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows:</span>
            <Select
              value={perPage.toString()}
              onValueChange={(value) => {
                setPerPage(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

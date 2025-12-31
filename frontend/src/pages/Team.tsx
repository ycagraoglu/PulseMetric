import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, MoreHorizontal, Mail, Shield, User } from "lucide-react";

const teamMembers = [
  { id: 1, name: "Miraç Berk", email: "berk@mirac.dev", role: "Owner", avatar: "", initials: "M" },
  { id: 2, name: "John Doe", email: "john@example.com", role: "Admin", avatar: "", initials: "JD" },
  { id: 3, name: "Jane Smith", email: "jane@example.com", role: "Member", avatar: "", initials: "JS" },
];

const Team = () => {
  return (
    <DashboardLayout
      title="Team"
      description="Manage team members and their permissions"
    >
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Team Members</CardTitle>
            <CardDescription>Invite and manage your team members</CardDescription>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Invite Member
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-theme"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{member.name}</p>
                      <Badge
                        variant={
                          member.role === "Owner"
                            ? "default"
                            : member.role === "Admin"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {member.role === "Owner" && <Shield className="w-3 h-3 mr-1" />}
                        {member.role === "Admin" && <User className="w-3 h-3 mr-1" />}
                        {member.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Mail className="w-3 h-3" />
                      {member.email}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Team;

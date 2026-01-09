import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Bell, Shield, Palette, Copy, Check, RefreshCw } from "lucide-react";
import { useSettings, useCopyScript } from "@/hooks/useSettings";

// ============================================
// Constants
// ============================================

const PAGE_TITLE = "Settings";
const PAGE_DESCRIPTION = "Manage your application settings and preferences";

// ============================================
// Sub-Components
// ============================================

const FormSkeleton = ({ lines = 3 }: { lines?: number }) => (
  <>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className="h-10 w-full max-w-md" />
    ))}
  </>
);

interface SettingRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SettingRow = ({ label, description, checked, onChange }: SettingRowProps) => (
  <div className="flex items-center justify-between max-w-md">
    <div className="space-y-0.5">
      <Label>{label}</Label>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

interface SaveButtonProps {
  onClick: () => void;
  isSaving: boolean;
}

const SaveButton = ({ onClick, isSaving }: SaveButtonProps) => (
  <Button className="flex items-center gap-2" onClick={onClick} disabled={isSaving}>
    <Save className="w-4 h-4" />
    {isSaving ? "Kaydediliyor..." : "Save Changes"}
  </Button>
);

interface EmbedScriptSectionProps {
  script: string;
  copied: boolean;
  onCopy: () => void;
}

const EmbedScriptSection = ({ script, copied, onCopy }: EmbedScriptSectionProps) => (
  <div className="space-y-2 pt-4 border-t">
    <Label>Embed Script</Label>
    <p className="text-sm text-muted-foreground">Add this script to your website</p>
    <div className="relative">
      <pre className="bg-secondary p-4 rounded-lg text-xs overflow-x-auto max-w-md">
        {script || "Loading..."}
      </pre>
      <Button size="sm" variant="ghost" className="absolute top-2 right-2" onClick={onCopy}>
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  </div>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <DashboardLayout title={PAGE_TITLE} description={PAGE_DESCRIPTION}>
    <Card className="bg-destructive/10 border-destructive">
      <CardContent className="p-6 text-center">
        <p className="text-destructive">Ayarlar yüklenemedi. Lütfen tekrar deneyin.</p>
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Yeniden Dene
        </Button>
      </CardContent>
    </Card>
  </DashboardLayout>
);

// ============================================
// Tab Content Components
// ============================================

interface GeneralTabProps {
  isLoading: boolean;
  projectName: string;
  projectUrl: string;
  dataRetention: boolean;
  embedScript: string;
  copied: boolean;
  isSaving: boolean;
  onProjectNameChange: (value: string) => void;
  onProjectUrlChange: (value: string) => void;
  onDataRetentionChange: (value: boolean) => void;
  onCopyScript: () => void;
  onSave: () => void;
}

const GeneralTab = ({
  isLoading,
  projectName,
  projectUrl,
  dataRetention,
  embedScript,
  copied,
  isSaving,
  onProjectNameChange,
  onProjectUrlChange,
  onDataRetentionChange,
  onCopyScript,
  onSave,
}: GeneralTabProps) => (
  <Card className="bg-card border-border">
    <CardHeader>
      <CardTitle className="text-lg">Project Settings</CardTitle>
      <CardDescription>Configure your project details and preferences</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      {isLoading ? (
        <FormSkeleton lines={3} />
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(e) => onProjectNameChange(e.target.value)}
              className="max-w-md bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-url">Project URL</Label>
            <Input
              id="project-url"
              value={projectUrl}
              onChange={(e) => onProjectUrlChange(e.target.value)}
              className="max-w-md bg-secondary border-border"
            />
          </div>
          <SettingRow
            label="Data Retention"
            description="Keep data for 90 days"
            checked={dataRetention}
            onChange={onDataRetentionChange}
          />
          <EmbedScriptSection script={embedScript} copied={copied} onCopy={onCopyScript} />
          <SaveButton onClick={onSave} isSaving={isSaving} />
        </>
      )}
    </CardContent>
  </Card>
);

interface NotificationsTabProps {
  isLoading: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  isSaving: boolean;
  onEmailChange: (value: boolean) => void;
  onPushChange: (value: boolean) => void;
  onWeeklyChange: (value: boolean) => void;
  onSave: () => void;
}

const NotificationsTab = ({
  isLoading,
  emailNotifications,
  pushNotifications,
  weeklyReports,
  isSaving,
  onEmailChange,
  onPushChange,
  onWeeklyChange,
  onSave,
}: NotificationsTabProps) => (
  <Card className="bg-card border-border">
    <CardHeader>
      <CardTitle className="text-lg">Notification Preferences</CardTitle>
      <CardDescription>Choose how you want to receive notifications</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      {isLoading ? (
        <FormSkeleton lines={3} />
      ) : (
        <>
          <SettingRow
            label="Email Notifications"
            description="Receive daily digest emails"
            checked={emailNotifications}
            onChange={onEmailChange}
          />
          <SettingRow
            label="Push Notifications"
            description="Get notified about important events"
            checked={pushNotifications}
            onChange={onPushChange}
          />
          <SettingRow
            label="Weekly Reports"
            description="Receive weekly analytics summary"
            checked={weeklyReports}
            onChange={onWeeklyChange}
          />
          <SaveButton onClick={onSave} isSaving={isSaving} />
        </>
      )}
    </CardContent>
  </Card>
);

interface SecurityTabProps {
  isLoading: boolean;
  twoFactor: boolean;
  sessionTimeout: boolean;
  isSaving: boolean;
  onTwoFactorChange: (value: boolean) => void;
  onSessionTimeoutChange: (value: boolean) => void;
  onSave: () => void;
}

const SecurityTab = ({
  isLoading,
  twoFactor,
  sessionTimeout,
  isSaving,
  onTwoFactorChange,
  onSessionTimeoutChange,
  onSave,
}: SecurityTabProps) => (
  <Card className="bg-card border-border">
    <CardHeader>
      <CardTitle className="text-lg">Security Settings</CardTitle>
      <CardDescription>Manage your security and privacy settings</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      {isLoading ? (
        <FormSkeleton lines={2} />
      ) : (
        <>
          <SettingRow
            label="Two-Factor Authentication"
            description="Add an extra layer of security"
            checked={twoFactor}
            onChange={onTwoFactorChange}
          />
          <SettingRow
            label="Session Timeout"
            description="Auto logout after 30 minutes"
            checked={sessionTimeout}
            onChange={onSessionTimeoutChange}
          />
          <div className="flex gap-2">
            <SaveButton onClick={onSave} isSaving={isSaving} />
            <Button variant="destructive">Revoke All Sessions</Button>
          </div>
        </>
      )}
    </CardContent>
  </Card>
);

// ============================================
// Main Component
// ============================================

const Settings = () => {
  const {
    settings,
    isLoading,
    isError,
    generalForm,
    setGeneralForm,
    notificationForm,
    setNotificationForm,
    securityForm,
    setSecurityForm,
    isSaving,
    saveGeneral,
    saveNotifications,
    saveSecurity,
    retry,
  } = useSettings();

  const { copied, copy } = useCopyScript();

  if (isError) {
    return <ErrorState onRetry={retry} />;
  }

  return (
    <DashboardLayout title={PAGE_TITLE} description={PAGE_DESCRIPTION}>
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralTab
            isLoading={isLoading}
            projectName={generalForm.projectName}
            projectUrl={generalForm.projectUrl}
            dataRetention={generalForm.dataRetention}
            embedScript={settings?.embedScript ?? ""}
            copied={copied}
            isSaving={isSaving}
            onProjectNameChange={(value) => setGeneralForm((f) => ({ ...f, projectName: value }))}
            onProjectUrlChange={(value) => setGeneralForm((f) => ({ ...f, projectUrl: value }))}
            onDataRetentionChange={(value) => setGeneralForm((f) => ({ ...f, dataRetention: value }))}
            onCopyScript={() => settings?.embedScript && copy(settings.embedScript)}
            onSave={saveGeneral}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab
            isLoading={isLoading}
            emailNotifications={notificationForm.emailNotifications}
            pushNotifications={notificationForm.pushNotifications}
            weeklyReports={notificationForm.weeklyReports}
            isSaving={isSaving}
            onEmailChange={(value) => setNotificationForm((f) => ({ ...f, emailNotifications: value }))}
            onPushChange={(value) => setNotificationForm((f) => ({ ...f, pushNotifications: value }))}
            onWeeklyChange={(value) => setNotificationForm((f) => ({ ...f, weeklyReports: value }))}
            onSave={saveNotifications}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab
            isLoading={isLoading}
            twoFactor={securityForm.twoFactor}
            sessionTimeout={securityForm.sessionTimeout}
            isSaving={isSaving}
            onTwoFactorChange={(value) => setSecurityForm((f) => ({ ...f, twoFactor: value }))}
            onSessionTimeoutChange={(value) => setSecurityForm((f) => ({ ...f, sessionTimeout: value }))}
            onSave={saveSecurity}
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Copy, Plus, Eye, EyeOff, Trash2, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  useApiKeys,
  useKeyVisibility,
  useCopyToClipboard,
  formatKeyDate,
  formatLastUsed,
  type ApiKey,
} from "@/hooks/useApiKeys";
import { IntegrationGuide } from "@/components/integration/IntegrationGuide";
import { getUser } from "@/services/auth";

// ============================================
// Constants
// ============================================

const PAGE_TITLE = "API Keys";
const PAGE_DESCRIPTION = "Manage your API keys for SDK integration";

// ============================================
// Sub-Components
// ============================================

const LoadingState = () => (
  <DashboardLayout title={PAGE_TITLE} description={PAGE_DESCRIPTION}>
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
    </div>
  </DashboardLayout>
);

const ErrorState = () => (
  <DashboardLayout title={PAGE_TITLE} description={PAGE_DESCRIPTION}>
    <Card className="bg-destructive/10 border-destructive">
      <CardContent className="pt-6">
        <p className="text-destructive">API key'ler yüklenirken hata oluştu.</p>
      </CardContent>
    </Card>
  </DashboardLayout>
);

const EmptyState = () => (
  <div className="text-center py-8 text-muted-foreground">
    <p>Henüz API key oluşturmadınız.</p>
    <p className="text-sm mt-1">Yukarıdaki butona tıklayarak ilk key'inizi oluşturun.</p>
  </div>
);

// ============================================
// API Key Item Component
// ============================================

interface ApiKeyItemProps {
  apiKey: ApiKey;
  isVisible: boolean;
  isCopied: boolean;
  onToggleVisibility: () => void;
  onCopy: () => void;
  onDelete: () => void;
}

const ApiKeyItem = ({
  apiKey,
  isVisible,
  isCopied,
  onToggleVisibility,
  onCopy,
  onDelete,
}: ApiKeyItemProps) => (
  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
    <div className="flex-1">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <p className="font-medium text-foreground">{apiKey.name}</p>
        <Badge variant={apiKey.prefix === "live" ? "default" : "secondary"}>
          {apiKey.prefix === "live" ? "Live" : "Test"}
        </Badge>
        {!apiKey.isActive && <Badge variant="destructive">Deaktif</Badge>}
      </div>

      {/* Key display */}
      <div className="flex items-center gap-2">
        <code className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
          {apiKey.maskedKey}
        </code>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onToggleVisibility}>
          {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onCopy}>
          {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
        <span>Oluşturuldu: {formatKeyDate(apiKey.createdAt)}</span>
        <span>Son kullanım: {formatLastUsed(apiKey.lastUsedAt)}</span>
        <span>Kullanım: {apiKey.usageCount}</span>
      </div>
    </div>

    {/* Delete button with confirmation */}
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>API Key'i Sil</AlertDialogTitle>
          <AlertDialogDescription>
            "{apiKey.name}" key'ini silmek istediğinize emin misiniz?
            Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Sil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
);

// ============================================
// Create Key Dialog Component
// ============================================

interface CreateKeyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: { name: string; isLive: boolean }) => void;
  isCreating: boolean;
  createdKey: { key: string } | null;
  onCopyCreatedKey: () => void;
  isCopied: boolean;
  onClose: () => void;
}

const CreateKeyDialog = ({
  isOpen,
  onOpenChange,
  onCreate,
  isCreating,
  createdKey,
  onCopyCreatedKey,
  isCopied,
  onClose,
}: CreateKeyDialogProps) => {
  const [name, setName] = useState("");
  const [isLive, setIsLive] = useState(true);

  const handleCreate = () => {
    if (!name.trim()) {
      return;
    }
    onCreate({ name: name.trim(), isLive });
  };

  const handleClose = () => {
    setName("");
    setIsLive(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create New Key
        </Button>
      </DialogTrigger>
      <DialogContent>
        {!createdKey ? (
          <>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>Create a new API key for your application</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="e.g. Production, Development"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Production Key</Label>
                  <p className="text-sm text-muted-foreground">
                    {isLive ? "pk_live_" : "pk_test_"} prefix
                  </p>
                </div>
                <Switch checked={isLive} onCheckedChange={setIsLive} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleCreate} disabled={isCreating || !name.trim()}>
                {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Key
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-green-500">Key Created!</DialogTitle>
              <DialogDescription>
                Copy your API key now. You won't be able to see it again!
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="p-4 bg-muted rounded-lg">
                <code className="text-sm font-mono break-all">{createdKey.key}</code>
              </div>
              <Button className="w-full mt-4" onClick={onCopyCreatedKey}>
                {isCopied ? (
                  <><Check className="w-4 h-4 mr-2" /> Copied!</>
                ) : (
                  <><Copy className="w-4 h-4 mr-2" /> Copy to Clipboard</>
                )}
              </Button>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

// ============================================
// Main Component
// ============================================

const ApiKeys = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    apiKeys,
    isLoading,
    error,
    createKey,
    deleteKey,
    isCreating,
    createdKey,
    clearCreatedKey,
  } = useApiKeys();

  const { toggleVisibility, isVisible } = useKeyVisibility();
  const { copy, isCopied } = useCopyToClipboard();

  // Get tenant ID from user
  const user = getUser();
  const tenantId = user?.tenantId || 'YOUR_TENANT_ID';

  // Loading & Error states
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <DashboardLayout title={PAGE_TITLE} description={PAGE_DESCRIPTION}>
      {/* Integration Guide - önce göster */}
      <div className="mb-6">
        <IntegrationGuide clientId={tenantId} />
      </div>

      {/* API Keys Card */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Your API Keys</CardTitle>
            <CardDescription>Use these keys to integrate the SDK into your app</CardDescription>
          </div>
          <CreateKeyDialog
            isOpen={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onCreate={createKey}
            isCreating={isCreating}
            createdKey={createdKey}
            onCopyCreatedKey={() => createdKey && copy(createdKey.key, "new")}
            isCopied={isCopied("new")}
            onClose={() => {
              setIsCreateDialogOpen(false);
              clearCreatedKey();
            }}
          />
        </CardHeader>

        <CardContent>
          {apiKeys.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <ApiKeyItem
                  key={apiKey.id}
                  apiKey={apiKey}
                  isVisible={isVisible(apiKey.id)}
                  isCopied={isCopied(apiKey.id)}
                  onToggleVisibility={() => toggleVisibility(apiKey.id)}
                  onCopy={() => copy(apiKey.maskedKey, apiKey.id)}
                  onDelete={() => deleteKey(apiKey.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ApiKeys;

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    getSettings,
    updateSettings,
    settingsQueryKeys,
    isExtendedRetention,
    isExtendedTimeout,
    getRetentionDays,
    getTimeoutMinutes,
    type TenantSettings,
    type UpdateSettingsRequest,
} from "@/services/settings";

// ============================================
// Types
// ============================================

export interface GeneralFormState {
    projectName: string;
    projectUrl: string;
    dataRetention: boolean;
}

export interface NotificationFormState {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReports: boolean;
}

export interface SecurityFormState {
    twoFactor: boolean;
    sessionTimeout: boolean;
}

// ============================================
// Main Hook
// ============================================

export const useSettings = () => {
    const queryClient = useQueryClient();

    // Query
    const query = useQuery<TenantSettings>({
        queryKey: settingsQueryKeys.all,
        queryFn: getSettings,
    });

    // General form state
    const [generalForm, setGeneralForm] = useState<GeneralFormState>({
        projectName: "",
        projectUrl: "",
        dataRetention: true,
    });

    // Notification form state
    const [notificationForm, setNotificationForm] = useState<NotificationFormState>({
        emailNotifications: true,
        pushNotifications: false,
        weeklyReports: true,
    });

    // Security form state
    const [securityForm, setSecurityForm] = useState<SecurityFormState>({
        twoFactor: false,
        sessionTimeout: true,
    });

    // Sync form state when settings load
    useEffect(() => {
        if (query.data) {
            const settings = query.data;
            setGeneralForm({
                projectName: settings.projectName,
                projectUrl: settings.projectUrl,
                dataRetention: isExtendedRetention(settings.dataRetentionDays),
            });
            setNotificationForm({
                emailNotifications: settings.notifications.emailNotifications,
                pushNotifications: settings.notifications.pushNotifications,
                weeklyReports: settings.notifications.weeklyReports,
            });
            setSecurityForm({
                twoFactor: settings.security.twoFactorEnabled,
                sessionTimeout: isExtendedTimeout(settings.security.sessionTimeoutMinutes),
            });
        }
    }, [query.data]);

    // Save mutation
    const saveMutation = useMutation({
        mutationFn: (request: UpdateSettingsRequest) => updateSettings(request),
        onSuccess: () => {
            toast.success("Ayarlar kaydedildi!");
            queryClient.invalidateQueries({ queryKey: settingsQueryKeys.all });
        },
        onError: () => {
            toast.error("Ayarlar kaydedilemedi!");
        },
    });

    // Save handlers
    const saveGeneral = useCallback(() => {
        saveMutation.mutate({
            projectName: generalForm.projectName,
            projectUrl: generalForm.projectUrl,
            dataRetentionDays: getRetentionDays(generalForm.dataRetention),
        });
    }, [generalForm, saveMutation]);

    const saveNotifications = useCallback(() => {
        saveMutation.mutate({
            emailNotifications: notificationForm.emailNotifications,
            pushNotifications: notificationForm.pushNotifications,
            weeklyReports: notificationForm.weeklyReports,
        });
    }, [notificationForm, saveMutation]);

    const saveSecurity = useCallback(() => {
        saveMutation.mutate({
            twoFactorEnabled: securityForm.twoFactor,
            sessionTimeoutMinutes: getTimeoutMinutes(securityForm.sessionTimeout),
        });
    }, [securityForm, saveMutation]);

    // Retry
    const retry = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: settingsQueryKeys.all });
    }, [queryClient]);

    return {
        // Query state
        settings: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        // Form state
        generalForm,
        setGeneralForm,
        notificationForm,
        setNotificationForm,
        securityForm,
        setSecurityForm,
        // Mutation state
        isSaving: saveMutation.isPending,
        // Actions
        saveGeneral,
        saveNotifications,
        saveSecurity,
        retry,
    };
};

// ============================================
// Copy Hook
// ============================================

export const useCopyScript = () => {
    const [copied, setCopied] = useState(false);

    const copy = useCallback(async (script: string) => {
        try {
            await navigator.clipboard.writeText(script);
            setCopied(true);
            toast.success("Script kopyalandı!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Kopyalama başarısız");
        }
    }, []);

    return { copied, copy };
};

// ============================================
// Re-exports
// ============================================

export type { TenantSettings, UpdateSettingsRequest };

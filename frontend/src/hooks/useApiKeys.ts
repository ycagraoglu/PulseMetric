import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    getApiKeys,
    createApiKey,
    deleteApiKey,
    apiKeysQueryKeys,
    formatKeyDate,
    formatLastUsed,
    type ApiKey,
    type CreateApiKeyResponse,
} from "@/services/apikeys";

// ============================================
// Types
// ============================================

interface CreateKeyData {
    name: string;
    isLive: boolean;
}

// ============================================
// Custom Hook
// ============================================

export const useApiKeys = () => {
    const queryClient = useQueryClient();
    const [createdKey, setCreatedKey] = useState<CreateApiKeyResponse | null>(null);

    // Query
    const query = useQuery({
        queryKey: apiKeysQueryKeys.all,
        queryFn: () => getApiKeys(),
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (data: CreateKeyData) =>
            createApiKey({ name: data.name, isLive: data.isLive }),
        onSuccess: (response) => {
            setCreatedKey(response);
            queryClient.invalidateQueries({ queryKey: apiKeysQueryKeys.all });
            toast.success("API key oluşturuldu!");
        },
        onError: () => {
            toast.error("API key oluşturulamadı");
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteApiKey(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: apiKeysQueryKeys.all });
            toast.success("API key silindi");
        },
        onError: () => {
            toast.error("API key silinemedi");
        },
    });

    // Clear created key
    const clearCreatedKey = useCallback(() => {
        setCreatedKey(null);
    }, []);

    return {
        // Query
        apiKeys: query.data ?? [],
        isLoading: query.isLoading,
        error: query.error,
        // Mutations
        createKey: createMutation.mutate,
        deleteKey: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isDeleting: deleteMutation.isPending,
        // Created key state
        createdKey,
        clearCreatedKey,
    };
};

// ============================================
// Visibility Hook
// ============================================

export const useKeyVisibility = () => {
    const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

    const toggleVisibility = useCallback((id: string) => {
        setVisibleKeys((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const isVisible = useCallback(
        (id: string) => visibleKeys.has(id),
        [visibleKeys]
    );

    return { toggleVisibility, isVisible };
};

// ============================================
// Copy Hook
// ============================================

export const useCopyToClipboard = () => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copy = useCallback(async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            toast.success("Key kopyalandı!");
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            toast.error("Kopyalama başarısız");
        }
    }, []);

    const isCopied = useCallback(
        (id: string) => copiedId === id,
        [copiedId]
    );

    return { copy, isCopied };
};

// ============================================
// Re-export utilities
// ============================================

export { formatKeyDate, formatLastUsed };
export type { ApiKey, CreateApiKeyResponse };

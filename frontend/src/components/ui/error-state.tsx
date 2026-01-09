import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

/**
 * API hatası durumunda gösterilecek component
 */
export function ErrorState({
    title = "Veri yüklenemedi",
    message = "Sunucuya bağlanırken bir hata oluştu. Lütfen tekrar deneyin.",
    onRetry
}: ErrorStateProps) {
    return (
        <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">{message}</p>
                {onRetry && (
                    <Button variant="outline" onClick={onRetry} className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Tekrar Dene
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

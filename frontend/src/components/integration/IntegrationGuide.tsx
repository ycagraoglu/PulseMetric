import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Code2 } from "lucide-react";
import { toast } from "sonner";
import {
    FRAMEWORKS,
    getScriptTag,
    getFrameworkCode,
    type FrameworkInfo
} from "./frameworkTemplates";

// ============================================
// Types
// ============================================

interface IntegrationGuideProps {
    clientId: string;
    apiUrl?: string;
}

// ============================================
// Code Block Component
// ============================================

interface CodeBlockProps {
    code: string;
    language: string;
    title?: string;
}

const CodeBlock = ({ code, language, title }: CodeBlockProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            toast.success("Kod kopyalandı!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Kopyalama başarısız");
        }
    }, [code]);

    return (
        <div className="relative">
            {title && (
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground font-mono">{title}</span>
                </div>
            )}
            <div className="relative group">
                <pre className="bg-secondary/50 rounded-lg p-4 overflow-x-auto text-sm">
                    <code className={`language-${language} text-foreground font-mono text-xs leading-relaxed`}>
                        {code}
                    </code>
                </pre>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 bg-background/80 hover:bg-background"
                    onClick={handleCopy}
                >
                    {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                    ) : (
                        <Copy className="w-4 h-4" />
                    )}
                </Button>
            </div>
        </div>
    );
};

// ============================================
// API Key Display
// ============================================

interface ApiKeyDisplayProps {
    clientId: string;
}

const ApiKeyDisplay = ({ clientId }: ApiKeyDisplayProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(clientId);
            setCopied(true);
            toast.success("API Key kopyalandı!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Kopyalama başarısız");
        }
    }, [clientId]);

    return (
        <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
            <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Your API Key</p>
                <code className="text-sm font-mono text-primary font-semibold">{clientId}</code>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? (
                    <><Check className="w-4 h-4 mr-2 text-green-500" /> Copied</>
                ) : (
                    <><Copy className="w-4 h-4 mr-2" /> Copy</>
                )}
            </Button>
        </div>
    );
};

// ============================================
// Framework Selector
// ============================================

interface FrameworkSelectorProps {
    selected: string;
    onSelect: (id: string) => void;
}

const FrameworkSelector = ({ selected, onSelect }: FrameworkSelectorProps) => (
    <Tabs value={selected} onValueChange={onSelect} className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-secondary/30 p-1">
            {FRAMEWORKS.map((framework) => (
                <TabsTrigger
                    key={framework.id}
                    value={framework.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs"
                >
                    <span>{framework.icon}</span>
                    <span>{framework.name}</span>
                </TabsTrigger>
            ))}
        </TabsList>
    </Tabs>
);

// ============================================
// Main Integration Guide Component
// ============================================

export const IntegrationGuide = ({
    clientId,
    apiUrl = 'https://api.pulsemetric.com'
}: IntegrationGuideProps) => {
    const [selectedFramework, setSelectedFramework] = useState('react');

    const currentFramework = FRAMEWORKS.find(f => f.id === selectedFramework);
    const scriptCode = getScriptTag(clientId, apiUrl);
    const frameworkCode = getFrameworkCode(selectedFramework, clientId, apiUrl);

    return (
        <div className="space-y-6">
            {/* API Key Card */}
            <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-primary" />
                        Integration Guide
                    </CardTitle>
                    <CardDescription>
                        Follow these steps to integrate PulseMetric into your application
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Step 1: API Key */}
                    <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">1</span>
                            Copy Your API Key
                        </h4>
                        <ApiKeyDisplay clientId={clientId} />
                    </div>

                    {/* Step 2: Quick Script */}
                    <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">2</span>
                            Add Script to Your Site
                        </h4>
                        <CodeBlock code={scriptCode} language="html" />
                    </div>

                    {/* Step 3: Framework Integration */}
                    <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">3</span>
                            Framework Integration
                        </h4>

                        <FrameworkSelector
                            selected={selectedFramework}
                            onSelect={setSelectedFramework}
                        />

                        <div className="mt-4">
                            <CodeBlock
                                code={frameworkCode}
                                language={currentFramework?.language || 'html'}
                                title={currentFramework?.file}
                            />
                        </div>
                    </div>

                    {/* Custom Events Info */}
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <h5 className="text-sm font-medium mb-2">💡 Custom Events</h5>
                        <p className="text-xs text-muted-foreground mb-3">
                            Track custom events with the PulseMetric API:
                        </p>
                        <CodeBlock
                            code={`// Track custom event
PulseMetric.track('button_click', { 
    buttonId: 'signup',
    page: 'homepage'
});

// Identify user (after login)
PulseMetric.identify('user_123', {
    email: 'user@example.com',
    plan: 'premium'
});`}
                            language="javascript"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default IntegrationGuide;

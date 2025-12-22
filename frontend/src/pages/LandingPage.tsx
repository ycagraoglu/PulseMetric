import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ArrowRight,
    Shield,
    Gauge,
    BarChart3,
    Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
    {
        icon: Shield,
        title: 'Privacy-First',
        description: 'GDPR compliant. No cookies. No personal data collected.',
    },
    {
        icon: Gauge,
        title: 'Blazing Fast',
        description: 'Lightweight script under 1KB. Zero impact on performance.',
    },
    {
        icon: BarChart3,
        title: 'Powerful Insights',
        description: 'Real-time analytics, user sessions, events, and more.',
    },
    {
        icon: Globe,
        title: 'Global Edge',
        description: 'Data collected at the edge for minimal latency worldwide.',
    },
]

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Globe className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-xl">PulseMetric</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate('/auth')}>
                            Sign In
                        </Button>
                        <Button onClick={() => navigate('/auth')}>
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="container py-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                        Privacy-First
                        <span className="block text-primary">Web Analytics</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                        Get powerful insights without compromising user privacy. No cookies,
                        no personal data, fully GDPR compliant. Simple, fast, and ethical.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-4">
                        <Button size="lg" onClick={() => navigate('/dashboard')}>
                            View Dashboard Demo
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
                            Start Free Trial
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* Features */}
            <section className="container py-24">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, i) => {
                        const Icon = feature.icon
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="rounded-xl border bg-card p-6"
                            >
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mb-2 font-semibold text-lg">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {feature.description}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-8">
                <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                            <Globe className="h-4 w-4" />
                        </div>
                        <span className="font-semibold">PulseMetric</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        © 2024 PulseMetric. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

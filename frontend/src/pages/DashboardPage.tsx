import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    PlusSquare,
    ArrowRight,
    LayoutGrid,
    LineChart,
    Database,
    FileText,
    Github,
    Activity,
    HeadphonesIcon,
    User,
    Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Demo apps data
const demoApps = [
    { id: '1', name: 'My Website', role: 'owner' },
    { id: '2', name: 'Mobile App', role: 'member' },
    { id: '3', name: 'E-commerce Store', role: 'owner' },
]

const quickLinks = [
    { title: 'Documentation', description: 'Learn how to use PulseMetric', icon: FileText, href: '/docs' },
    { title: 'Support', description: 'Get help from our team', icon: HeadphonesIcon, href: '/support' },
    { title: 'Status', description: 'Check system status', icon: Activity, href: 'https://status.pulsemetric.com' },
    { title: 'GitHub', description: 'View source code', icon: Github, href: 'https://github.com' },
]

export default function DashboardPage() {
    const navigate = useNavigate()

    const handleAppSelect = (id: string) => {
        navigate(`/dashboard/analytics/users?app=${id}`)
    }

    return (
        <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h1 className="font-bold text-4xl">Welcome to PulseMetric</h1>
                <p className="mt-3 text-lg text-muted-foreground">
                    Select an application to view analytics and insights
                </p>
            </motion.div>

            {/* Apps Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap justify-center gap-4"
            >
                {demoApps.map((app, i) => (
                    <motion.div
                        key={app.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                    >
                        <Card
                            className="w-full cursor-pointer py-0 transition-all hover:scale-[1.02] hover:shadow-lg sm:w-80"
                            onClick={() => handleAppSelect(app.id)}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                        <LayoutGrid className="h-6 w-6" />
                                    </div>
                                    <div
                                        className={cn(
                                            'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs',
                                            app.role === 'owner'
                                                ? 'bg-primary/10 text-primary'
                                                : 'bg-muted text-muted-foreground'
                                        )}
                                    >
                                        {app.role === 'owner' ? (
                                            <User className="h-3 w-3" />
                                        ) : (
                                            <Users className="h-3 w-3" />
                                        )}
                                        <span className="font-medium capitalize">{app.role}</span>
                                    </div>
                                </div>
                                <h3 className="mt-4 font-semibold text-lg">{app.name}</h3>
                                <div className="mt-4 flex items-center gap-4 text-muted-foreground text-xs">
                                    <div className="flex items-center gap-1">
                                        <LineChart className="h-3.5 w-3.5" />
                                        <span>Analytics</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Database className="h-3.5 w-3.5" />
                                        <span>Events</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Create New App Button */}
            <div className="flex justify-center">
                <Button variant="outline" className="gap-2 border-dashed">
                    <PlusSquare className="h-5 w-5" />
                    Create New App
                </Button>
            </div>

            {/* Quick Links */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
            >
                <h2 className="mb-3 font-semibold text-muted-foreground text-sm uppercase">
                    Quick Links
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {quickLinks.map((link) => {
                        const Icon = link.icon
                        return (
                            <Card
                                key={link.title}
                                className="cursor-pointer py-0 transition-colors hover:bg-accent"
                                onClick={() => window.open(link.href, '_blank')}
                            >
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-primary/10 p-3">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-muted-foreground text-sm uppercase">
                                                {link.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm">{link.description}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </motion.div>
        </div>
    )
}

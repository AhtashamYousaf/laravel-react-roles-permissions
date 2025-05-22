import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ChartAreaInteractive } from '@/pages/chart-area-interactive';
import { type User } from '@/types';
import StatCard from './components/card';
import { TrendingUpIcon, ShieldQuestion, BookKey } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type ChartData = {
  date: string
  desktop: number
  mobile: number
}
interface Props {
    users: User[];
    roles: { id: number; name: string }[];
    permissions: { id: number; name: string }[];
    status: string;
    mustVerifyEmail: boolean;
    chartData: ChartData[];
}

export default function Dashboard({ users, roles, permissions, chartData }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-3 md:grid-cols-4">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <StatCard 
                            description="Total Users"
                            cardTitle={users.length}
                            badgeIcon={<TrendingUpIcon className="size-3" />} 
                            badge="+12.5%" 
                            footerIconTitle="Trending up this month"
                            footerIcon={<TrendingUpIcon className="size-4" />} 
                            footerDescription="Visitors for the last 6 months" 
                        />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <StatCard 
                            description="Total Roles"
                            cardTitle={roles.length}
                            badgeIcon={<BookKey className="size-3" />} 
                            badge="" 
                            footerIconTitle=""
                            footerIcon={<BookKey className="size-4" />} 
                            footerDescription="" 
                        />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <StatCard 
                            description="Total Permissions"
                            cardTitle={permissions.length}
                            badgeIcon={<ShieldQuestion className="size-3" />} 
                            badge="" 
                            footerIconTitle=""
                            footerIcon={<ShieldQuestion className="size-4" />} 
                            footerDescription="" 
                        />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                 <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <ChartAreaInteractive chartData={chartData} />
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}

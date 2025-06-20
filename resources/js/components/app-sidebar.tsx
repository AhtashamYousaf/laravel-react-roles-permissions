import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, BookKey, Users, BookOpen, Folder } from 'lucide-react';
import AppLogo from './app-logo';
import { type SharedData } from '@/types';


export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const roles = auth.role ?? [];
    const isAdmin = roles.includes('Admin') || roles.includes('Superadmin');
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',    
            href: '/dashboard',
            icon: LayoutGrid,
        },
        ...(isAdmin ? [{
            title: 'Roles',
            href: '/roles',
            icon: BookKey,
        },
        {
            title: 'Users',    
            href: '/users',
            icon: Users,
        }] : []),
    ];
    
    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/AhtashamYousaf/laravel-react-roles-permissions',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

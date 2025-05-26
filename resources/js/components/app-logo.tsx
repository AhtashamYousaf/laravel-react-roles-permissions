import AppLogoIcon from './app-logo-icon';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { settings } = usePage<SharedData>().props;
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">{settings.app_name}</span>
            </div>
        </>
    );
}

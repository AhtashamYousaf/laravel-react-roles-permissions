import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { settings } = usePage<SharedData>().props;

    return (
        <>
            {/* Light mode logo */}
            <img
                className="block dark:hidden"
                src={settings.site_logo_lite || '/logo.svg'}
                alt={settings.app_name || 'App Logo'}
            />
            {/* Dark mode logo */}
            <img
                className="hidden dark:block"
                src={settings.site_logo_dark || '/logo.svg'}
                alt={settings.app_name || 'App Logo'}
            />
        </>
    );
}

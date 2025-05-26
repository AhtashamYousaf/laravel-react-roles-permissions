import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'General settings', href: '/settings/general' }];

const defaultImage = '/images/placeholder.png';

export default function General() {
    const { settings } = usePage<SharedData>().props;

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<{
        app_name: string;
        site_logo_lite: File | null;
        site_logo_dark: File | null;
        site_icon: File | null;
        site_favicon: File | null;
    }>({
        app_name: settings.app_name ?? '',
        site_logo_lite: null,
        site_logo_dark: null,
        site_icon: null,
        site_favicon: null,
    });

    const [previews, setPreviews] = useState({
        site_logo_lite: settings.site_logo_lite || defaultImage,
        site_logo_dark: settings.site_logo_dark || defaultImage,
        site_icon: settings.site_icon || defaultImage,
        site_favicon: settings.site_favicon || defaultImage,
    });

    const handleImageChange = (key: keyof typeof previews, file: File | null) => {
        setData(key, file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviews((prev) => ({ ...prev, [key]: e.target?.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('settings.general.update'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                toast.success('Settings updated successfully');
            },
            onError: (Errors) => {
                toast.error(Errors?.update || 'Failed to update settings');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="General Settings" />
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="General Site Information" description="Update site name and logos" />
                    <Toaster position="top-right" />
                    <form onSubmit={submit} className="space-y-6">
                        {/* Site Name */}
                        <div className="grid gap-2">
                            <Label htmlFor="app_name">Site Name</Label>
                            <Input
                                id="app_name"
                                value={data.app_name}
                                onChange={(e) => setData('app_name', e.target.value)}
                                required
                                placeholder="Site name"
                            />
                            <InputError message={errors.app_name} />
                        </div>

                        {/* Logos & Icons */}
                        {(
                            [
                                ['site_logo_lite', 'Site Logo (Light)'],
                                ['site_logo_dark', 'Site Logo (Dark)'],
                                ['site_icon', 'Site Icon'],
                                ['site_favicon', 'Site Favicon'],
                            ] as [keyof typeof previews, string][]
                        ).map(([key, label]) => (
                            <div key={key} className="grid gap-2">
                                <Label htmlFor={key}>{label}</Label>
                                <img src={previews[key]} alt={`${label} preview`} className="max-h-[80px] bg-gray-200 p-2 dark:bg-gray-800" />
                                <Input id={key} type="file" accept="image/*" onChange={(e) => handleImageChange(key, e.target.files?.[0] ?? null)} />
                                <InputError message={errors[key]} />
                            </div>
                        ))}

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                Save Changes
                            </Button>

                            <Transition show={recentlySuccessful} enter="transition-opacity duration-500" enterFrom="opacity-0" enterTo="opacity-100">
                                <p className="text-sm text-neutral-600">Saved.</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

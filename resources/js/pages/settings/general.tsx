import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'General settings', href: '/settings/general' },
];

type GeneralSettingForm = {
    site_name: string;
    site_logo_dark: File | null;
    site_logo_light: File | null;
    site_icon: File | null;
    site_favicon: File | null;
};

type Props = {
    mustVerifyEmail: boolean;
    status?: string;
    settings: {
        site_name: string;
        site_logo_dark_url: string;
        site_logo_light_url: string;
        site_icon_url: string;
        site_favicon_url: string;
    };
};

const defaultImage = '/images/placeholder.png'; // 👈 Your default image path

export default function General({ settings }: Props) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<GeneralSettingForm>({
        site_name: settings.site_name || '',
        site_logo_dark: null,
        site_logo_light: null,
        site_icon: null,
        site_favicon: null,
    });

    const [previews, setPreviews] = useState({
        site_logo_dark: settings.site_logo_dark_url || defaultImage,
        site_logo_light: settings.site_logo_light_url || defaultImage,
        site_icon: settings.site_icon_url || defaultImage,
        site_favicon: settings.site_favicon_url || defaultImage,
    });

    const handleImageChange = (key: keyof GeneralSettingForm, file: File | null) => {
        if (file) {
            setData(key, file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviews((prev) => ({ ...prev, [key]: e.target?.result as string }));
            };
            reader.readAsDataURL(file);
        } else {
            setData(key, null);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        patch(route('settings.store'), {
            preserveScroll: true,
        }); 
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="General Settings" />
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="General Site Information" description="Update site name and logo" />

                    <form onSubmit={submit} className="space-y-6">
                        {/* Site Name */}
                        <div className="grid gap-2">
                            <Label htmlFor="site_name">Site Name</Label>
                            <Input
                                id="site_name"
                                value={data.site_name}
                                onChange={(e) => setData('site_name', e.target.value)}
                                required
                                autoComplete="site_name"
                                placeholder="Site name"
                            />
                            <InputError className="mt-2" message={errors.site_name} />
                        </div>

                        {/* Image Fields */}
                        {([
                            { key: 'site_logo_light', label: 'Site Logo (Light)' },
                            { key: 'site_logo_dark', label: 'Site Logo (Dark)' },
                            { key: 'site_icon', label: 'Site Icon' },
                            { key: 'site_favicon', label: 'Site Favicon' },
                        ] as const).map(({ key, label }) => (
                            <div key={key} className="grid gap-2">
                                <Label htmlFor={key}>{label}</Label>
                                <img
                                    src={previews[key]}
                                    alt={`${key} preview`}
                                    className="h-20 w-20 rounded border object-contain bg-white"
                                />
                                <Input
                                    id={key}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(key, e.target.files?.[0] || null)}
                                />
                                <InputError className="mt-2" message={errors[key]} />
                            </div>
                        ))}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

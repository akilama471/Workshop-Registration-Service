import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white tracking-tight">
                            Account Profile
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium">Manage your personal information and security settings</p>
                    </div>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-8 shadow-sm sm:rounded-2xl border border-gray-100 dark:border-gray-700 transition-colors">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-2xl"
                        />
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 shadow-sm sm:rounded-2xl border border-gray-100 dark:border-gray-700 transition-colors">
                        <UpdatePasswordForm className="max-w-2xl" />
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 shadow-sm sm:rounded-2xl border border-red-100 dark:border-red-900/30 transition-colors">
                        <DeleteUserForm className="max-w-2xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

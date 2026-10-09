import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { useForm } from '@inertiajs/react';

export default function Show({ auth, workshop, flash, errors }) {
    const isManager = auth.user.roles.includes('Manager');
    const isStaff = auth.user.roles.includes('Staff');
    const canManage = isManager || isStaff;

    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const registerForm = useForm({
        name: '',
        email: ''
    });

    const editForm = useForm({
        code: workshop.code,
        title: workshop.title,
        instructor: workshop.instructor,
        starts_at: workshop.starts_at ? new Date(workshop.starts_at).toISOString().slice(0, 16) : '',
        capacity: workshop.capacity,
        status: workshop.status,
    });

    const submitRegister = (e) => {
        e.preventDefault();
        registerForm.post(route('registrations.store', workshop.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowRegisterModal(false);
                registerForm.reset();
            }
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editForm.put(route('workshops.update', workshop.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowEditModal(false);
            }
        });
    };

    const handleCancelRegistration = (registrationId) => {
        if (confirm('Are you sure you want to cancel this registration?')) {
            router.delete(route('registrations.destroy', { workshop: workshop.id, registration: registrationId }), {
                preserveScroll: true,
            });
        }
    };

    const activeRegistrations = workshop.registrations?.filter(r => r.status === 'active') || [];
    const history = workshop.registrations?.flatMap(r => 
        r.history.map(h => ({
            ...h,
            attendee_name: r.name,
            attendee_email: r.email
        }))
    ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) || [];

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Workshop Details</h2>}
        >
            <Head title={workshop.title} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {flash?.success && (
                        <div className="rounded-md bg-green-50 p-4 text-green-700">
                            {flash.success}
                        </div>
                    )}
                    {errors?.registration && (
                        <div className="rounded-md bg-red-50 p-4 text-red-700">
                            {errors.registration}
                        </div>
                    )}

                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-bold text-primary-dark mb-2">{workshop.title}</h3>
                                <p className="text-sm text-gray-600 mb-1"><strong>Code:</strong> {workshop.code}</p>
                                <p className="text-sm text-gray-600 mb-1"><strong>Instructor:</strong> {workshop.instructor}</p>
                                <p className="text-sm text-gray-600 mb-1"><strong>Date:</strong> {new Date(workshop.starts_at).toLocaleString()}</p>
                                <p className="text-sm text-gray-600 mb-1"><strong>Status:</strong> {workshop.status}</p>
                                <p className="text-sm text-gray-600">
                                    <strong>Seats:</strong> {workshop.active_registrations_count} / {workshop.capacity}
                                </p>
                            </div>
                            <div className="space-x-2">
                                {isManager && (
                                    <SecondaryButton onClick={() => setShowEditModal(true)}>Edit Workshop</SecondaryButton>
                                )}
                                {canManage && workshop.active_registrations_count < workshop.capacity && workshop.status === 'scheduled' && (
                                    <PrimaryButton onClick={() => setShowRegisterModal(true)}>Register Attendee</PrimaryButton>
                                )}
                            </div>
                        </div>
                    </div>

                    {canManage && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Active Registrations */}
                            <div className="bg-white shadow-sm sm:rounded-lg p-6">
                                <h4 className="text-lg font-bold mb-4">Active Registrations</h4>
                                {activeRegistrations.length > 0 ? (
                                    <ul className="divide-y divide-gray-200">
                                        {activeRegistrations.map(reg => (
                                            <li key={reg.id} className="py-3 flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{reg.name}</p>
                                                    <p className="text-sm text-gray-500">{reg.email}</p>
                                                </div>
                                                <DangerButton onClick={() => handleCancelRegistration(reg.id)} className="text-xs">Cancel Seat</DangerButton>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">No active registrations.</p>
                                )}
                            </div>

                            {/* Audit Trail / History */}
                            <div className="bg-white shadow-sm sm:rounded-lg p-6 max-h-96 overflow-y-auto">
                                <h4 className="text-lg font-bold mb-4">Registration History (Audit Trail)</h4>
                                {history.length > 0 ? (
                                    <ul className="space-y-4">
                                        {history.map(item => (
                                            <li key={item.id} className="text-sm">
                                                <span className="text-gray-500">{new Date(item.created_at).toLocaleString()}</span>
                                                <p>
                                                    <strong className={item.action === 'registered' ? 'text-green-600' : 'text-red-600'}>
                                                        {item.action.toUpperCase()}
                                                    </strong>: {item.attendee_name} ({item.attendee_email}) 
                                                    <br/>
                                                    <span className="text-gray-500 italic">by {item.user?.name || 'System'}</span>
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">No history available.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Register Modal */}
            <Modal show={showRegisterModal} onClose={() => setShowRegisterModal(false)}>
                <form onSubmit={submitRegister} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Register Attendee</h2>

                    <div className="mt-4">
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput id="name" type="text" className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary" value={registerForm.data.name} onChange={e => registerForm.setData('name', e.target.value)} required />
                        <InputError message={registerForm.errors.name} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="email" value="Email Address" />
                        <TextInput id="email" type="email" className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary" value={registerForm.data.email} onChange={e => registerForm.setData('email', e.target.value)} required />
                        <InputError message={registerForm.errors.email} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setShowRegisterModal(false)}>Close</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={registerForm.processing}>Register</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <form onSubmit={submitEdit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Edit Workshop</h2>

                    <div className="mt-4">
                        <InputLabel htmlFor="edit_code" value="Workshop Code" />
                        <TextInput id="edit_code" type="text" className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary" value={editForm.data.code} onChange={e => editForm.setData('code', e.target.value)} required />
                        <InputError message={editForm.errors.code} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="edit_title" value="Title" />
                        <TextInput id="edit_title" type="text" className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary" value={editForm.data.title} onChange={e => editForm.setData('title', e.target.value)} required />
                        <InputError message={editForm.errors.title} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="edit_instructor" value="Instructor" />
                        <TextInput id="edit_instructor" type="text" className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary" value={editForm.data.instructor} onChange={e => editForm.setData('instructor', e.target.value)} required />
                        <InputError message={editForm.errors.instructor} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="edit_starts_at" value="Date & Time" />
                        <TextInput id="edit_starts_at" type="datetime-local" className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary" value={editForm.data.starts_at} onChange={e => editForm.setData('starts_at', e.target.value)} required />
                        <InputError message={editForm.errors.starts_at} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="edit_capacity" value="Capacity" />
                        <TextInput id="edit_capacity" type="number" min="1" className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary" value={editForm.data.capacity} onChange={e => editForm.setData('capacity', e.target.value)} required />
                        <InputError message={editForm.errors.capacity} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="edit_status" value="Status" />
                        <select id="edit_status" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" value={editForm.data.status} onChange={e => editForm.setData('status', e.target.value)}>
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <InputError message={editForm.errors.status} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setShowEditModal(false)}>Cancel</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={editForm.processing}>Save Changes</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}

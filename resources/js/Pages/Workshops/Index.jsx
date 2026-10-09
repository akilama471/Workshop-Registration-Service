import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { useForm } from '@inertiajs/react';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ auth, workshops, filters, flash }) {
    const isManager = auth.user.roles.includes('Manager');
    
    const [showAddModal, setShowAddModal] = useState(false);
    const addForm = useForm({
        code: '',
        title: '',
        instructor: '',
        starts_at: '',
        capacity: ''
    });

    const submitAdd = (e) => {
        e.preventDefault();
        addForm.post(route('workshops.store'), {
            onSuccess: () => {
                setShowAddModal(false);
                addForm.reset();
            }
        });
    };

    const [filterData, setFilterData] = useState({
        status: filters?.status || '',
        date_start: filters?.date_start || '',
        date_end: filters?.date_end || '',
        available_seats: filters?.available_seats === '1' || filters?.available_seats === true || filters?.available_seats === 'true',
    });

    const applyFilters = (newFilters) => {
        const query = { ...newFilters };
        Object.keys(query).forEach(key => {
            if (query[key] === '' || query[key] === false) {
                delete query[key];
            }
        });
        
        router.get(route('workshops.index'), query, { preserveState: true, preserveScroll: true });
    };

    const handleFilterChange = (key, value) => {
        const updated = { ...filterData, [key]: value };
        setFilterData(updated);
        applyFilters(updated);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Workshop Catalogue</h2>}
        >
            <Head title="Workshops" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 rounded-md bg-green-50 p-4 text-green-700">
                            {flash.success}
                        </div>
                    )}
                    
                    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                        <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                            <div>
                                <InputLabel htmlFor="filter-status" value="Status" className="text-xs mb-1" />
                                <select 
                                    id="filter-status"
                                    value={filterData.status} 
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm py-1.5"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            
                            <div>
                                <InputLabel htmlFor="filter-start" value="From Date" className="text-xs mb-1" />
                                <TextInput 
                                    id="filter-start"
                                    type="date" 
                                    value={filterData.date_start} 
                                    onChange={(e) => handleFilterChange('date_start', e.target.value)}
                                    className="py-1.5 text-sm"
                                />
                            </div>
                            
                            <div>
                                <InputLabel htmlFor="filter-end" value="To Date" className="text-xs mb-1" />
                                <TextInput 
                                    id="filter-end"
                                    type="date" 
                                    value={filterData.date_end} 
                                    onChange={(e) => handleFilterChange('date_end', e.target.value)}
                                    className="py-1.5 text-sm"
                                />
                            </div>

                            <div className="flex items-center h-full pt-5">
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={filterData.available_seats}
                                        onChange={(e) => handleFilterChange('available_seats', e.target.checked)}
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Available Seats Only</span>
                                </label>
                            </div>
                            
                            {(filters?.status || filters?.date_start || filters?.date_end || filters?.available_seats) && (
                                <div className="flex items-center h-full pt-5 ml-2">
                                    <button 
                                        onClick={() => {
                                            const cleared = { status: '', date_start: '', date_end: '', available_seats: false };
                                            setFilterData(cleared);
                                            applyFilters(cleared);
                                        }}
                                        className="text-sm text-red-600 hover:text-red-800 underline flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                        {isManager && (
                            <PrimaryButton onClick={() => setShowAddModal(true)}>Add Workshop</PrimaryButton>
                        )}
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {workshops.map(workshop => (
                                    <div key={workshop.id} className="border rounded-lg p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-primary-dark">{workshop.title}</h3>
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${workshop.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : workshop.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {workshop.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1"><strong>Code:</strong> {workshop.code}</p>
                                            <p className="text-sm text-gray-600 mb-1"><strong>Instructor:</strong> {workshop.instructor}</p>
                                            <p className="text-sm text-gray-600 mb-1"><strong>Date:</strong> {new Date(workshop.starts_at).toLocaleString()}</p>
                                            <p className="text-sm text-gray-600 mb-4">
                                                <strong>Seats:</strong> {workshop.active_registrations_count} / {workshop.capacity}
                                            </p>
                                        </div>
                                        <Link href={route('workshops.show', workshop.id)} className="w-full text-center inline-flex justify-center items-center px-4 py-2 bg-primary border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-dark active:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition ease-in-out duration-150">
                                            View Details
                                        </Link>
                                    </div>
                                ))}
                                {workshops.length === 0 && (
                                    <div className="col-span-full text-center py-8 text-gray-500">
                                        No workshops found.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
                <form onSubmit={submitAdd} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Add New Workshop</h2>

                    <div className="mt-4">
                        <InputLabel htmlFor="code" value="Workshop Code" />
                        <TextInput id="code" type="text" className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary" value={addForm.data.code} onChange={e => addForm.setData('code', e.target.value)} required />
                        <InputError message={addForm.errors.code} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="title" value="Title" />
                        <TextInput id="title" type="text" className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary" value={addForm.data.title} onChange={e => addForm.setData('title', e.target.value)} required />
                        <InputError message={addForm.errors.title} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="instructor" value="Instructor" />
                        <TextInput id="instructor" type="text" className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary" value={addForm.data.instructor} onChange={e => addForm.setData('instructor', e.target.value)} required />
                        <InputError message={addForm.errors.instructor} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="starts_at" value="Date & Time" />
                        <TextInput id="starts_at" type="datetime-local" className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary" value={addForm.data.starts_at} onChange={e => addForm.setData('starts_at', e.target.value)} required />
                        <InputError message={addForm.errors.starts_at} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="capacity" value="Capacity (Number of Seats)" />
                        <TextInput id="capacity" type="number" min="1" className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary" value={addForm.data.capacity} onChange={e => addForm.setData('capacity', e.target.value)} required />
                        <InputError message={addForm.errors.capacity} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setShowAddModal(false)}>Cancel</SecondaryButton>
                        <button type="submit" disabled={addForm.processing} className="ms-3 inline-flex items-center px-4 py-2 bg-primary border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-dark active:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition ease-in-out duration-150">
                            Save Workshop
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}

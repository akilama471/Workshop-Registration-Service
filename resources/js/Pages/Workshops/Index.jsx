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
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Workshop Catalogue</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium hidden sm:block">Discover and join our latest sessions</p>
                </div>
            }
        >
            <Head title="Workshops" />

            <div className="py-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/30 p-4 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 shadow-sm flex items-center">
                            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                            {flash.success}
                        </div>
                    )}
                    
                    {/* Filter and Action Bar */}
                    <div className="mb-8 bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 transition-colors">
                        
                        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold mb-1 w-full sm:w-auto">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                                Filters
                            </div>
                            
                            <div className="w-full sm:w-auto">
                                <select 
                                    id="filter-status"
                                    value={filterData.status} 
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full sm:w-auto rounded-xl border-gray-200 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 bg-gray-50 dark:bg-gray-700 font-medium text-gray-700 dark:text-gray-200"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <TextInput 
                                    id="filter-start"
                                    type="date" 
                                    value={filterData.date_start} 
                                    onChange={(e) => handleFilterChange('date_start', e.target.value)}
                                    className="py-2 text-sm w-full sm:w-auto rounded-xl border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100"
                                    title="From Date"
                                />
                                <span className="text-gray-400 dark:text-gray-500 font-medium">to</span>
                                <TextInput 
                                    id="filter-end"
                                    type="date" 
                                    value={filterData.date_end} 
                                    onChange={(e) => handleFilterChange('date_end', e.target.value)}
                                    className="py-2 text-sm w-full sm:w-auto rounded-xl border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100"
                                    title="To Date"
                                />
                            </div>

                            <label className="flex items-center cursor-pointer px-3 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 rounded-xl transition border border-gray-200 dark:border-gray-600 hover:border-indigo-200 dark:hover:border-gray-500">
                                <input 
                                    type="checkbox" 
                                    checked={filterData.available_seats}
                                    onChange={(e) => handleFilterChange('available_seats', e.target.checked)}
                                    className="rounded border-gray-300 dark:border-gray-500 text-indigo-600 focus:ring-indigo-600 w-4 h-4 cursor-pointer"
                                />
                                <span className="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-200">Available Seats Only</span>
                            </label>
                            
                            {(filters?.status || filters?.date_start || filters?.date_end || filters?.available_seats) && (
                                <button 
                                    onClick={() => {
                                        const cleared = { status: '', date_start: '', date_end: '', available_seats: false };
                                        setFilterData(cleared);
                                        applyFilters(cleared);
                                    }}
                                    className="text-sm font-semibold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-xl transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Clear
                                </button>
                            )}
                        </div>
                        
                        {isManager && (
                            <PrimaryButton 
                                onClick={() => setShowAddModal(true)}
                                className="w-full xl:w-auto flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 border-0 hover:from-indigo-700 hover:to-purple-700 shadow-md py-3 px-6 rounded-xl text-sm justify-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Add Workshop
                            </PrimaryButton>
                        )}
                    </div>

                    {/* Workshop Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {workshops.map(workshop => {
                            const isFull = workshop.active_registrations_count >= workshop.capacity;
                            
                            return (
                                <div key={workshop.id} className="group flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="h-32 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 relative p-5 flex flex-col justify-between border-b border-gray-100 dark:border-gray-700 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                                {workshop.code}
                                            </span>
                                            <span className={`px-3 py-1 text-xs font-extrabold rounded-full shadow-sm flex items-center ${workshop.status === 'scheduled' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700' : workshop.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700'}`}>
                                                {workshop.status === 'scheduled' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-1.5 animate-pulse"></span>}
                                                {workshop.status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{workshop.title}</h3>
                                        
                                        <div className="space-y-3 mt-4 flex-1">
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mr-3 text-indigo-500 dark:text-indigo-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                                </div>
                                                <span className="font-medium">{workshop.instructor}</span>
                                            </div>
                                            
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mr-3 text-purple-500 dark:text-purple-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                </div>
                                                <span>
                                                    {new Date(workshop.starts_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} 
                                                    <span className="mx-1 font-bold">&middot;</span> 
                                                    {new Date(workshop.starts_at).toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' })}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${isFull ? 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400'}`}>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                                </div>
                                                <div>
                                                    <span className="font-bold text-gray-900 dark:text-white">{workshop.active_registrations_count}</span>
                                                    <span className="mx-1 text-gray-400">/</span>
                                                    <span>{workshop.capacity} seats</span>
                                                    {isFull && <span className="ml-2 text-xs font-bold text-red-500 dark:text-red-400 uppercase">Full</span>}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <Link 
                                                href={route('workshops.show', workshop.id)} 
                                                className="w-full text-center inline-flex justify-center items-center px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl font-bold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {workshops.length === 0 && (
                        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 border-dashed p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">No workshops found</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">We couldn't find any workshops matching your current filters. Try adjusting them or clear all filters.</p>
                            
                            {(filters?.status || filters?.date_start || filters?.date_end || filters?.available_seats) && (
                                <button 
                                    onClick={() => {
                                        const cleared = { status: '', date_start: '', date_end: '', available_seats: false };
                                        setFilterData(cleared);
                                        applyFilters(cleared);
                                    }}
                                    className="mt-6 font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-6 py-2 rounded-xl transition"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    )}
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

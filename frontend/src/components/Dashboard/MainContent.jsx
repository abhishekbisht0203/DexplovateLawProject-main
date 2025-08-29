
const MainContent = () => (
    <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4" style={{ color: '#303772' }}>
                    Dashboard
                </h1>
                <p className="text-base sm:text-lg text-gray-500 max-w-xl">
                    Manage your cases, documents, and team collaboration all in one place.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mb-12">
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="text-4xl font-bold text-gray-800 mb-2">3</div>
                    <div className="text-gray-600">Pending Reviews</div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="text-4xl font-bold text-gray-800 mb-2">12</div>
                    <div className="text-gray-600">Active Cases</div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="text-4xl font-bold text-gray-800 mb-2">87</div>
                    <div className="text-gray-600">Documents Shared</div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="text-4xl font-bold text-gray-800 mb-2">5</div>
                    <div className="text-gray-600">Upcoming Hearings</div>
                </div>
            </div>
            
            {/* Recent Cases Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ color: '#303772' }}>
                    Recent Cases
                </h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case No.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">CR-2024-001</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">John Smith</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Criminal</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 hours ago</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">CIV-2024-045</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Sarah Johnson</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Civil</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 day ago</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">FAM-2024-023</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Michael Brown</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Family</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">In Progress</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 days ago</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">COM-2024-078</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Emily Davis</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Commercial</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Review</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 week ago</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">PRO-2024-012</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">David Wilson</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Property</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 weeks ago</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            {/* Hearings Section */}
            <div id="hearings-section" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ color: '#303772' }}>
                    Upcoming Hearings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500">Case No.</span>
                            <span className="text-sm font-bold text-gray-900">CR-2025-001</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">John Smith vs. State</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Date:</span>
                                <span className="font-medium">Jan 15, 2025</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Time:</span>
                                <span className="font-medium">10:00 AM</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Court:</span>
                                <span className="font-medium">District Court</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Type:</span>
                                <span className="font-medium">Preliminary</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Urgent</span>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500">Case No.</span>
                            <span className="text-sm font-bold text-gray-900">CIV-2025-045</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Johnson vs. Corporation</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Date:</span>
                                <span className="font-medium">Mar 8, 2025</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Time:</span>
                                <span className="font-medium">2:30 PM</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Court:</span>
                                <span className="font-medium">Civil Court</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Type:</span>
                                <span className="font-medium">Trial</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Scheduled</span>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500">Case No.</span>
                            <span className="text-sm font-bold text-gray-900">FAM-2025-023</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Brown Family Matter</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Date:</span>
                                <span className="font-medium">May 12, 2025</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Time:</span>
                                <span className="font-medium">11:00 AM</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Court:</span>
                                <span className="font-medium">Family Court</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Type:</span>
                                <span className="font-medium">Mediation</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Confirmed</span>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500">Case No.</span>
                            <span className="text-sm font-bold text-gray-900">COM-2025-078</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Davis vs. TechCorp</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Date:</span>
                                <span className="font-medium">Jun 20, 2025</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Time:</span>
                                <span className="font-medium">9:30 AM</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Court:</span>
                                <span className="font-medium">Commercial Court</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Type:</span>
                                <span className="font-medium">Arbitration</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Review</span>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500">Case No.</span>
                            <span className="text-sm font-bold text-gray-900">PRO-2025-012</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Wilson Property Dispute</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Date:</span>
                                <span className="font-medium">Jul 3, 2025</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Time:</span>
                                <span className="font-medium">3:00 PM</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Court:</span>
                                <span className="font-medium">Property Court</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Type:</span>
                                <span className="font-medium">Settlement</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">Pending</span>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500">Case No.</span>
                            <span className="text-sm font-bold text-gray-900">CR-2025-015</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Anderson vs. State</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Date:</span>
                                <span className="font-medium">Aug 1, 2025</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Time:</span>
                                <span className="font-medium">1:15 PM</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Court:</span>
                                <span className="font-medium">District Court</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-gray-500">Type:</span>
                                <span className="font-medium">Final Hearing</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Urgent</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Space for future content */}
            <div className="h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <div className="text-lg font-medium mb-2">More Content Coming Soon</div>
                    <div className="text-sm">Scroll down to see additional sections</div>
                </div>
            </div>
            
            {/* Additional space for more content */}
            <div className="h-64"></div>
        </div>
    </main>
);
export default MainContent;
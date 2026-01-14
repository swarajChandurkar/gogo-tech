import { getLeads } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Force dynamic rendering so we see new leads on refresh
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const leads = await getLeads();

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900">Admin Dashboard</h1>
                        <p className="text-slate-500 mt-1">Real-time B2B Quote Requests</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <form action={async () => {
                            "use server";
                            const { cookies } = await import("next/headers");
                            (await cookies()).delete("admin_session");
                            const { redirect } = await import("next/navigation");
                            redirect("/admin/login");
                        }}>
                            <button type="submit" className="text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors">
                                Sign Out
                            </button>
                        </form>
                        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                            <span className="text-sm font-semibold text-slate-600">Total Leads: </span>
                            <span className="text-lg font-bold text-primary">{leads.length}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-slate-700">Company</th>
                                    <th className="px-6 py-4 font-bold text-slate-700">Fleet</th>
                                    <th className="px-6 py-4 font-bold text-slate-700">Fuel</th>
                                    <th className="px-6 py-4 font-bold text-slate-700">Contact</th>
                                    <th className="px-6 py-4 font-bold text-slate-700">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {leads.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                                            No leads found yet.
                                        </td>
                                    </tr>
                                ) : (
                                    leads.map((lead: any, i: number) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-slate-900">{lead.companyName}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {lead.fleetSize}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{lead.fuelType}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-900 font-medium">{lead.email}</span>
                                                    <span className="text-slate-400 text-xs">{lead.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                                {lead.submittedAt ? new Date(lead.submittedAt).toLocaleString() : 'Just now'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

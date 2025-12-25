import { getInvoices, deleteInvoice } from "@/app/actions/invoices";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Plus, Trash2, FileText } from "lucide-react";
import Link from "next/link";

export default async function InvoicesPage() {
    const { invoices, error } = await getInvoices();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Invoices</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage and track student invoices.</p>
                </div>
                <Link href="/admin/invoices/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        New Invoice
                    </Button>
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    Errors loading invoices: {error}
                </div>
            )}

            <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle>Invoice History</CardTitle>
                </CardHeader>
                <CardContent>
                    {!invoices || invoices.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No invoices generated yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50">
                                    <tr>
                                        <th className="px-6 py-3">Invoice #</th>
                                        <th className="px-6 py-3">Student</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Amount</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="px-6 py-4 font-medium">{invoice.number}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900 dark:text-slate-100">
                                                    {invoice.student ? invoice.student.name : invoice.recipientName}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {invoice.student ? invoice.student.email : invoice.recipientEmail}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {format(new Date(invoice.date), "MMM d, yyyy")}
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                ${invoice.total.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${invoice.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                                    invoice.status === 'SENT' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-slate-100 text-slate-700'
                                                    }`}>
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <form action={async () => {
                                                    "use server";
                                                    await deleteInvoice(invoice.id);
                                                }}>
                                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

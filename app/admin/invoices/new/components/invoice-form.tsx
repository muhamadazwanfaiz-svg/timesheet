"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Ensure this component exists or use standard textarea
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus, Printer, Save } from "lucide-react";
import { toast } from "sonner";
import { createInvoice, CreateInvoiceItem } from "@/app/actions/invoices";
import { StudentSelect } from "./student-select";
import { LineItemRow } from "./line-item-row";

interface Student {
    id: string;
    name: string;
    email: string;
}

interface InvoiceFormProps {
    students: Student[];
    nextInvoiceNumber: string;
}

export default function InvoiceForm({ students, nextInvoiceNumber }: InvoiceFormProps) {
    const router = useRouter();
    const componentRef = useRef<HTMLDivElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [recipientType, setRecipientType] = useState<"student" | "custom">("student");
    const [studentId, setStudentId] = useState("");

    // Custom Recipient State
    const [customName, setCustomName] = useState("");
    const [customEmail, setCustomEmail] = useState("");
    const [customAddress, setCustomAddress] = useState("");

    const [date, setDate] = useState<Date | undefined>(new Date());
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
    const [notes, setNotes] = useState("");


    // Sender Details State
    const [senderName, setSenderName] = useState("Timesheet");
    const [senderAddress, setSenderAddress] = useState("123 Tutor Street\nEducation City, ED 10101");

    const [items, setItems] = useState<CreateInvoiceItem[]>([
        { description: "Tutoring Session", quantity: 1, rate: 50, amount: 50 },
    ]);

    // Computed
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const total = subtotal; // Add tax logic here if needed

    // Handlers
    const handleItemChange = (index: number, field: keyof CreateInvoiceItem, value: string | number) => {
        const newItems = [...items];
        const item = { ...newItems[index], [field]: value };

        // Recalculate amount if qty or rate changes
        if (field === "quantity" || field === "rate") {
            item.amount = (typeof item.quantity === 'number' ? item.quantity : 0) * (typeof item.rate === 'number' ? item.rate : 0);
        }

        newItems[index] = item;
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Invoice-${nextInvoiceNumber}`,
    });

    const handleSave = async () => {
        if (recipientType === "student" && !studentId) {
            toast.error("Please select a student");
            return;
        }
        if (recipientType === "custom" && !customName) {
            toast.error("Please enter a recipient name");
            return;
        }
        if (!date) {
            toast.error("Please select a date");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                date,
                dueDate,
                items,
                notes,
                studentId: recipientType === "student" ? studentId : undefined,
                recipientName: recipientType === "custom" ? customName : undefined,
                recipientEmail: recipientType === "custom" ? customEmail : undefined,
                recipientAddress: recipientType === "custom" ? customAddress : undefined,
            };

            const result = await createInvoice(payload);

            if (result.success) {
                toast.success("Invoice created successfully");
                router.push("/admin/invoices");
            } else {
                toast.error(result.error || "Failed to create invoice");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedStudent = students.find(s => s.id === studentId);

    return (
        <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold">New Invoice</h2>
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-md font-mono">
                        {nextInvoiceNumber}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button variant="secondary" onClick={() => handlePrint && handlePrint()}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print / PDF
                    </Button>
                    <Button onClick={handleSave} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Invoice
                    </Button>
                </div>
            </div>

            {/* The Invoice Paper */}
            <div className="flex justify-center">
                <div
                    ref={componentRef}
                    className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-lg p-8 md:p-12 print:shadow-none print:w-full print:max-w-none"
                    style={{ margin: "0 auto" }}
                >
                    {/* Invoice Header */}
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-2">INVOICE</h1>
                            <p className="text-slate-500 font-medium">{nextInvoiceNumber}</p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <Input
                                className="text-xl font-bold text-indigo-600 text-right border-none p-0 h-auto focus-visible:ring-0 w-[300px]"
                                value={senderName}
                                onChange={(e) => setSenderName(e.target.value)}
                            />
                            <Textarea
                                className="text-sm text-slate-500 mt-1 text-right border-none p-0 resize-none focus-visible:ring-0 min-h-[60px] w-[300px]"
                                value={senderAddress}
                                onChange={(e) => setSenderAddress(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Bill To & Details */}
                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Bill To</h3>
                                <div className="flex bg-slate-100 rounded-lg p-1">
                                    <button
                                        className={cn(
                                            "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                            recipientType === "student" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                        )}
                                        onClick={() => setRecipientType("student")}
                                    >
                                        Student
                                    </button>
                                    <button
                                        className={cn(
                                            "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                            recipientType === "custom" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                        )}
                                        onClick={() => setRecipientType("custom")}
                                    >
                                        Custom
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {recipientType === "student" ? (
                                    <StudentSelect
                                        value={studentId}
                                        onValueChange={setStudentId}
                                        students={students}
                                    />
                                ) : (
                                    <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                        <Input
                                            placeholder="Recipient Name"
                                            value={customName}
                                            onChange={(e) => setCustomName(e.target.value)}
                                            className="bg-white"
                                        />
                                        <Input
                                            placeholder="Email Address (Optional)"
                                            value={customEmail}
                                            onChange={(e) => setCustomEmail(e.target.value)}
                                            className="bg-white"
                                        />
                                        <Textarea
                                            placeholder="Billing Address (Optional)"
                                            value={customAddress}
                                            onChange={(e) => setCustomAddress(e.target.value)}
                                            className="bg-white resize-none"
                                            rows={2}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-600">Date Issued:</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-600">Due Date:</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal",
                                                !dueDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={dueDate}
                                            onSelect={setDueDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-12">
                        <div className="grid grid-cols-12 gap-4 mb-4 pb-2 border-b border-slate-200 text-sm font-semibold text-slate-500 uppercase tracking-wider">
                            <div className="col-span-5">Description</div>
                            <div className="col-span-2">Quantity</div>
                            <div className="col-span-2">Rate</div>
                            <div className="col-span-2">Amount</div>
                            <div className="col-span-1"></div>
                        </div>

                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <LineItemRow
                                    key={index}
                                    index={index}
                                    item={item}
                                    onChange={handleItemChange}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                        </div>

                        <div className="mt-4">
                            <Button variant="ghost" onClick={handleAddItem} className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                <Plus className="mr-2 h-4 w-4" /> Add Line Item
                            </Button>
                        </div>
                    </div>

                    {/* Footer / Totals */}
                    <div className="flex justify-end mb-12">
                        <div className="w-1/3 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Subtotal:</span>
                                <span className="font-medium">${subtotal.toFixed(2)}</span>
                            </div>
                            {/* Tax could go here */}
                            <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-3">
                                <span>Total:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="border-t border-slate-100 pt-8">
                        <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Notes / Terms</label>
                        <Textarea
                            placeholder="Thank you for your business. Payment is due within 14 days."
                            className="bg-transparent border-slate-200"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

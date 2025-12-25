"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateInvoiceItem } from "@/app/actions/invoices";
import { Trash2 } from "lucide-react";

interface LineItemRowProps {
    index: number;
    item: CreateInvoiceItem;
    onChange: (index: number, field: keyof CreateInvoiceItem, value: string | number) => void;
    onRemove: (index: number) => void;
}

export function LineItemRow({ index, item, onChange, onRemove }: LineItemRowProps) {
    return (
        <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-5">
                <Input
                    placeholder="Description (e.g. Tutoring Session)"
                    value={item.description}
                    onChange={(e) => onChange(index, "description", e.target.value)}
                />
            </div>
            <div className="col-span-2">
                <Input
                    type="number"
                    min="0"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => onChange(index, "quantity", parseFloat(e.target.value) || 0)}
                />
            </div>
            <div className="col-span-2">
                <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => onChange(index, "rate", parseFloat(e.target.value) || 0)}
                />
            </div>
            <div className="col-span-2">
                <div className="h-10 flex items-center px-3 text-sm font-medium border rounded-md bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                    ${item.amount.toFixed(2)}
                </div>
            </div>
            <div className="col-span-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(index)}
                    className="text-slate-400 hover:text-red-500"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

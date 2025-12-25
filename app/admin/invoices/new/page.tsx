import { getStudents } from "@/app/actions/students";
import { getNextInvoiceNumber } from "@/app/actions/invoices";
import InvoiceForm from "./components/invoice-form";

export default async function NewInvoicePage() {
    const students = await getStudents();
    const nextInvoiceNumber = await getNextInvoiceNumber();

    return <InvoiceForm students={students} nextInvoiceNumber={nextInvoiceNumber} />;
}

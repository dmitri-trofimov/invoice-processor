import { getDateSting } from "../../utils";
import { Invoice, ProcessedInvoice } from "../invoice-processor";

function processInvoice(invoice: Invoice): ProcessedInvoice | null {
    if (!isBalticMediaInvoice(invoice)) {
        return null;
    }

    const invoiceDate = getInvoiceDate(invoice);
    const invoiceNumber = getInvoiceNumber(invoice);
    const service = getInvoiceService(invoice);

    const processedFileName = `${invoiceDate} — Invoice ${invoiceNumber} — Baltic Media (${service}).pdf`;

    const processedInvoice: ProcessedInvoice = {
        ...invoice,
        processorName: "Happy Writer",
        processedFileName,
    };

    return processedInvoice;
}

export const balticMediaInvoiceProcessor = processInvoice;

function isBalticMediaInvoice(invoice: Invoice): boolean {
    return invoice.extractedText.includes("SIA Baltic Media Ltd") && invoice.extractedText.includes("LV40003172317");
}

function getInvoiceDate(invoice: Invoice): string {
    const match = invoice.extractedText.match(/Date Payment terms\n(\d*) (.*?) (\d\d\d\d)/);

    if (match === null) {
        throw Error("Invoice date not found");
    }

    const date = new Date(`${match[3]}-${match[2]}-${match[1]}`);
    return getDateSting(date);
}

function getInvoiceNumber(invoice: Invoice): string {
    const invoiceNumberMatch = invoice.extractedText.match(/INVOICE\n# (.*)/);

    if (!invoiceNumberMatch) {
        throw Error("Invoice number not found");
    }

    return invoiceNumberMatch[1].replaceAll("/", "-");
}

function getInvoiceService(invoice: Invoice): string {
    const serviceMatch = invoice.fileName.match(/\((.*)\)/);

    if (!serviceMatch) {
        return "TODO";
    }

    return serviceMatch[1];
}
import { getDateSting } from "../../utils";
import { Invoice, ProcessedInvoice } from "../invoice-processor";

function processInvoice(invoice: Invoice): ProcessedInvoice | null {
    if (!isOskarGruppInvoice(invoice)) {
        return null;
    }

    const invoiceDate = getInvoiceDate(invoice);
    const invoiceNumber = getInvoiceNumber(invoice);
    const service = getInvoiceService(invoice);

    const processedFileName = `${invoiceDate} — Invoice ${invoiceNumber} — Oskar Grupp (${service}).pdf`;

    const processedInvoice: ProcessedInvoice = {
        ...invoice,
        processorName: "Oskar Grupp",
        processedFileName,
    };

    return processedInvoice;
}

export const oskarGruppInvoiceProcessor = processInvoice;

function isOskarGruppInvoice(invoice: Invoice): boolean {
    return invoice.extractedText.includes("14113989") && invoice.extractedText.includes("EE101910507");
}

function getInvoiceDate(invoice: Invoice): string {
    const match = invoice.extractedText.match(/Kuupäev (\d\d)\.(\d\d)\.(\d\d\d\d)/);

    if (match === null) {
        throw Error("Invoice date not found");
    }

    const date = new Date(`${match[3]}-${match[2]}-${match[1]}`);
    return getDateSting(date);
}

function getInvoiceNumber(invoice: Invoice): string {
    const invoiceNumberMatch = invoice.extractedText.match(/Arve nr (.+)$/m);

    if (!invoiceNumberMatch) {
        throw Error("Invoice number not found");
    }

    return invoiceNumberMatch[1];
}

function getInvoiceService(invoice: Invoice): string {
    const serviceMatch = invoice.fileName.match(/\((.*)\)/);

    if (!serviceMatch) {
        return "TODO";
    }

    return serviceMatch[1];
}
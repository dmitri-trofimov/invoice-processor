import { getDateSting } from "../../utils";
import { Invoice, ProcessedInvoice } from "../invoice-processor";

function processInvoice(invoice: Invoice): ProcessedInvoice | null {
    if (!isPostimeesInvoice(invoice)) {
        return null;
    }

    const invoiceDate = getInvoiceDate(invoice);
    const invoiceNumber = getInvoiceNumber(invoice);
    const service = getInvoiceService(invoice);

    const processedFileName = `${invoiceDate} — Invoice ${invoiceNumber} — Postimees Grupp (${service}).pdf`;

    const processedInvoice: ProcessedInvoice = {
        ...invoice,
        processorName: "Postimees Grupp",
        processedFileName,
    };

    return processedInvoice;
}

export const postimeesInvoiceProcessor = processInvoice;

function isPostimeesInvoice(invoice: Invoice): boolean {
    return invoice.extractedText.includes("AS Postimees Grupp") && invoice.extractedText.includes("10184643");
}

function getInvoiceDate(invoice: Invoice): string {
    const match = invoice.extractedText.match(/Kuupäev: (\d\d)\.(\d\d)\.(\d\d\d\d)/);

    if (match === null) {
        throw Error("Invoice date not found");
    }

    const date = new Date(`${match[3]}-${match[2]}-${match[1]}`);
    return getDateSting(date);
}

function getInvoiceNumber(invoice: Invoice): string {
    const invoiceNumberMatch = invoice.extractedText.match(/ARVE (\d+)$/m);

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
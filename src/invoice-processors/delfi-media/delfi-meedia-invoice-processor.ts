import { getDateSting } from "../../utils";
import { Invoice, ProcessedInvoice } from "../invoice-processor";

function processInvoice(invoice: Invoice): ProcessedInvoice | null {
    if (!isDelfiMeediaInvoice(invoice)) {
        return null;
    }

    const invoiceDate = getInvoiceDate(invoice);
    const invoiceNumber = getInvoiceNumber(invoice);
    const service = getInvoiceService(invoice);

    const processedFileName = `${invoiceDate} — Invoice ${invoiceNumber} — Delfi Meedia (${service}).pdf`;

    const processedInvoice: ProcessedInvoice = {
        ...invoice,
        processorName: "Delfi Meedia",
        processedFileName,
    };

    return processedInvoice;
}

export const delfiMeediaInvoiceProcessor = processInvoice;

function isDelfiMeediaInvoice(invoice: Invoice): boolean {
    return invoice.extractedText.includes("10586863") && invoice.extractedText.includes("EE100576146");
}

function getInvoiceDate(invoice: Invoice): string {
    const match = invoice.extractedText.match(/Arve nr .*\n(\d\d)\.(\d\d)\.(\d\d\d\d)/);

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
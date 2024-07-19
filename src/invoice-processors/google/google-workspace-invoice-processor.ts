import { getDateSting } from "../../utils";
import { Invoice, ProcessedInvoice } from "../invoice-processor";

function processInvoice(invoice: Invoice): ProcessedInvoice | null {
    if (!isGoogleWorkspaceInvoice(invoice)) {
        return null;
    }

    const invoiceDate = getInvoiceDate(invoice);
    const invoiceNumber = getInvoiceNumber(invoice);

    const processedFileName = `${invoiceDate} — Invoice ${invoiceNumber} — Google (Workspace).pdf`;

    const processedInvoice: ProcessedInvoice = {
        ...invoice,
        processorName: "Google Ads",
        processedFileName,
    };

    return processedInvoice;
}

function isGoogleWorkspaceInvoice(invoice: Invoice): boolean {
    return invoice.extractedText.includes("Google Workspace");
}

export const googleWorkspaceInvoiceProcessor = processInvoice;

function getInvoiceDate(invoice: Invoice): string {
    const dateMatch = invoice.extractedText.match(/\.([a-zA-Z]* \d+, \d\d\d\d)Invoice/);

    if (!dateMatch || dateMatch.length < 2) {
        throw Error("Invoice date not found");
    }

    const date = new Date(dateMatch[1]);

    return getDateSting(date);
}

function getInvoiceNumber(invoice: Invoice): string {
    const invoiceNumberMatch = invoice.extractedText.match(/Invoice number: (\d+)Details\./);

    if (!invoiceNumberMatch || invoiceNumberMatch.length < 2) {
        throw Error("Invoice number not found");
    }

    return invoiceNumberMatch[1];
}

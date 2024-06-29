import { getDateSting } from "../../utils";
import { Invoice, ProcessedInvoice } from "../invoice-processor";

function processInvoice(invoice: Invoice): ProcessedInvoice | null {
    if (!isMicrosoftAppsForBusinessInvoice(invoice)) {
        return null;
    }

    const invoiceDate = getInvoiceDate(invoice);
    const invoiceNumber = getInvoiceNumber(invoice);

    const processedFileName = `${invoiceDate} — Invoice ${invoiceNumber} — Microsoft (Apps for Business).pdf`;

    const processedInvoice: ProcessedInvoice = {
        ...invoice,
        processorName: "Microsoft Apps for Business",
        processedFileName,
    };

    return processedInvoice;
}

function isMicrosoftAppsForBusinessInvoice(invoice: Invoice): boolean {
    return invoice.extractedText.includes("Microsoft 365 Apps for business");
}

export const microsoftAppsForBusinessInvoiceProcessor = processInvoice;

function getInvoiceDate(invoice: Invoice): string {
    const dateMatch = invoice.extractedText.match(/Invoice Date: (\d\d)\.(\d\d)\.(\d\d\d\d)/);

    if (!dateMatch || dateMatch.length < 2) {
        throw Error("Invoice date not found");
    }

    const date = new Date(parseInt(dateMatch[3]), parseInt(dateMatch[2]) - 1, parseInt(dateMatch[1]));

    return getDateSting(date);
}

function getInvoiceNumber(invoice: Invoice): string {
    const invoiceNumberMatch = invoice.extractedText.match(/Invoice Number: (.*?)Due Date/);

    if (!invoiceNumberMatch || invoiceNumberMatch.length < 2) {
        throw Error("Invoice number not found");
    }

    return invoiceNumberMatch[1];
}

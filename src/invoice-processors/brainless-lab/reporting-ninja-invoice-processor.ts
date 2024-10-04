import { getDateSting } from "../../utils";
import { Invoice, ProcessedInvoice } from "../invoice-processor";

function processInvoice(invoice: Invoice): ProcessedInvoice | null {
    if (!isReportingNinjaInvoice(invoice)) {
        return null;
    }

    const invoiceDate = getInvoiceDate(invoice);
    const invoiceNumber = getInvoiceNumber(invoice);

    const processedFileName = `${invoiceDate} - Invoice ${invoiceNumber} - Brainless Lab (Reporting Ninja).pdf`;

    const processedInvoice: ProcessedInvoice = {
        ...invoice,
        processorName: "Brainless Lab",
        processedFileName,
    };

    return processedInvoice;
}

export const reportingNinjaInvoiceProcessor = processInvoice;

function isReportingNinjaInvoice(invoice: Invoice): boolean {
    return invoice.extractedText.includes("Brainless Lab");
}

function getInvoiceDate(invoice: Invoice): string {
    const match = invoice.extractedText.match(/(\d\d)\/(\d\d)\/(\d\d\d\d)/);

    if (match === null) {
        throw Error("Invoice date not found");
    }

    const date = new Date(`${match[3]}-${match[2]}-${match[1]}`);
    return getDateSting(date);
}

function getInvoiceNumber(invoice: Invoice): string {
    const invoiceNumberMatch = invoice.extractedText.match(/^Invoice number: (.+)$/m);

    if (!invoiceNumberMatch) {
        throw Error("Invoice number not found");
    }

    return invoiceNumberMatch[1];
}

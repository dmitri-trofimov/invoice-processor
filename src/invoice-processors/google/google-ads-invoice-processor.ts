import { getDateSting } from "../../utils";
import { Invoice, ProcessedInvoice } from "../invoice-processor";

function processInvoice(invoice: Invoice): ProcessedInvoice | null {
    if (!isGoogleAdsInvoice(invoice)) {
        return null;
    }

    const invoiceDate = getInvoiceDate(invoice);
    const invoiceNumber = getInvoiceNumber(invoice);
    const invoiceAccount = getInvoiceAccount(invoice);

    const processedFileName = `${invoiceDate} — Invoice ${invoiceNumber} — Google (Ads, ${invoiceAccount}).pdf`;

    const processedInvoice: ProcessedInvoice = {
        ...invoice,
        processorName: "Google Ads",
        processedFileName,
    };

    return processedInvoice;
}

function isGoogleAdsInvoice(invoice: Invoice): boolean {
    return invoice.extractedText.includes("Google Ads") && invoice.extractedText.includes("Google Ireland");
}

export const googleAdsInvoiceProcessor = processInvoice;

function getInvoiceDate(invoice: Invoice): string {
    const account = getInvoiceAccount(invoice);

    if (account === "Tetris") {
        return getTetrisInvoiceDate(invoice);
    } else if (account === "Ellex") {
        return getEllexInvoiceDate(invoice);
    }

    const dateMatch = invoice.extractedText.match(/\.([a-zA-Z]* \d+, \d\d\d\d)Invoice/);

    if (!dateMatch || dateMatch.length < 2) {
        throw Error("Invoice date not found");
    }

    const date = new Date(dateMatch[1]);

    return getDateSting(date);
}

function getTetrisInvoiceDate(invoice: Invoice): string {
    const dateMatch = invoice.extractedText.match(/Invoice date[ \.]+(.+?) \./m);

    if (!dateMatch || dateMatch.length < 2) {
        throw Error("Invoice date not found");
    }

    const date = new Date(dateMatch[1]);

    return getDateSting(date);
}

function getEllexInvoiceDate(invoice: Invoice): string {
    const dateMatch = invoice.extractedText.match(/\.(\d\d [A-Za-z]+ \d\d\d\d)Invoice/);

    if (!dateMatch || dateMatch.length < 2) {
        throw Error("Invoice date not found");
    }

    const date = new Date(dateMatch[1]);

    return getDateSting(date);
}

function getInvoiceNumber(invoice: Invoice): string {
    const invoiceNumberMatch = invoice.extractedText.match(/Invoice number: (\d+)/);

    if (!invoiceNumberMatch || invoiceNumberMatch.length < 2) {
        throw Error("Invoice number not found");
    }

    return invoiceNumberMatch[1];
}

function getInvoiceAccount(invoice: Invoice): string {
    const str = invoice.extractedText.toLowerCase();

    if (str.includes("tetris")) {
        return "Tetris";
    } else if (str.includes("ellex")) {
        return "Ellex";
    }

    throw Error("Account not found");
}

import path from "path";

import { parsePdf } from "../pdf-parser";
import { isNotNil } from "../utils";

import { balticMediaInvoiceProcessor } from "./baltic-media/baltic-media-invoice-processor";
import { googleAdsInvoiceProcessor } from "./google/google-ads-invoice-processor";
import { googleWorkspaceInvoiceProcessor } from "./google/google-workspace-invoice-processor";
import { happyWriterInvoiceProcessor } from "./happy-writer/happy-writer-invoice-processor";
import { microsoftAppsForBusinessInvoiceProcessor } from "./microsoft/microsoft-apps-for-business-invoice-processor";
import { oskarGruppInvoiceProcessor } from "./oskar-grupp/oskar-grupp-invoice-processor";
import { postimeesInvoiceProcessor } from "./postimees-grupp/postimees-invoice-processor";
import { reportingNinjaInvoiceProcessor } from "./brainless-lab/reporting-ninja-invoice-processor";

export type Invoice = {
    extractedText: string;
    fileDirectoryPath: string;
    fileName: string;
};

export type ProcessedInvoice = Invoice & {
    processorName: string;
    processedFileName: string;
};

export type InvoiceProcessResult = {
    fileName: string;
    message: string;
    processedInvoice: ProcessedInvoice | null;
};

const invoiceProcessors = [
    balticMediaInvoiceProcessor,
    googleAdsInvoiceProcessor,
    googleWorkspaceInvoiceProcessor,
    happyWriterInvoiceProcessor,
    microsoftAppsForBusinessInvoiceProcessor,
    oskarGruppInvoiceProcessor,
    postimeesInvoiceProcessor,
    reportingNinjaInvoiceProcessor,
];

export async function processInvoice(invoiceFilePath: string): Promise<InvoiceProcessResult> {
    try {
        const parsedInvoice = await parseInvoice(invoiceFilePath);

        const processorResults = invoiceProcessors.map(processor => processor(parsedInvoice)).filter(isNotNil);

        let result: InvoiceProcessResult = {
            fileName: parsedInvoice.fileName,
            message: "Processed",
            processedInvoice: null,
        };

        if (processorResults.length === 0) {
            result.message = "No processor found";
        } else if (processorResults.length === 1) {
            result.processedInvoice = processorResults[0];
        } else {
            result.message = "Multiple processors found";
        }

        return result;
    } catch (error) {
        let message: string;

        if (error instanceof Error) {
            message = error.message;
        } else if (typeof error === "string") {
            message = error;
        } else {
            message = "An error occurred";
        }

        return {
            fileName: path.basename(invoiceFilePath),
            message: `Error: ${message}`,
            processedInvoice: null,
        };
    }
}

async function parseInvoice(invoiceFilePath: string): Promise<Invoice> {
    const pdfText = await parsePdf(invoiceFilePath);

    const fileDirectoryPath = path.dirname(invoiceFilePath);
    const fileName = path.basename(invoiceFilePath);

    const result: Invoice = {
        extractedText: pdfText,
        fileDirectoryPath,
        fileName,
    };

    return result;
}

import * as fs from "fs/promises";
import { glob } from "glob";
import { processInvoice } from "./invoice-processors/invoice-processor";
import path from "path";

(async () => {
    const pdfFiles = await glob("*.pdf", { cwd: "C:/Users/dmitr/Downloads", absolute: true });

    const displayResults: { Invoice: string; Result: string }[] = [];

    for (const pdfFile of pdfFiles) {
        const result = await processInvoice(pdfFile);
        displayResults.push({ Invoice: result.fileName, Result: result.message });

        if (result.processedInvoice !== null) {
            const i = result.processedInvoice;

            await fs.rename(pdfFile, path.join(i.fileDirectoryPath, i.processedFileName));
        }
    }

    console.table(displayResults);
})();

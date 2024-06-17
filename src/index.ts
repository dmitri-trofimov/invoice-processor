import * as fs from "fs/promises";
import { glob } from "glob";

(async () => {
    const pdfFiles = await glob("*.pdf");

    for (const pdfFile of pdfFiles) {
        const newName = pdfFile.replaceAll(" - ", " — ");
        await fs.rename(pdfFile, newName);
    }
})();

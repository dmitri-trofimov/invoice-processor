import PdfParser, { Text } from "pdf2json";

export async function parsePdf(pdfFilePath: string): Promise<string> {
    const parser = new PdfParser();

    const promise = new Promise<string>((resolve, reject) => {
        parser.on("pdfParser_dataError", reject);

        parser.on("pdfParser_dataReady", pdfData => {
            let text = "";

            for (const page of pdfData.Pages) {
                const lines = new Map<number, Text[]>();

                for (const text of page.Texts) {
                    const y = text.y;
                    const line = lines.get(y) || [];
                    line.push(text);
                    lines.set(y, line);
                }

                const sortedLineKeys = Array.from(lines.keys()).sort((a, b) => a - b);

                for (const key of sortedLineKeys) {
                    const line = lines.get(key)!;
                    const sortedTexts = line.sort((a, b) => a.x - b.x);
                        
                    text += sortedTexts.map(t => decodeURIComponent(t.R[0].T)).join(" ") + "\n";
                }
            }

            text = text.trim().replaceAll(/[ ]+/g, " ");

            resolve(text);
        });

        parser.loadPDF(pdfFilePath);
    });

    return await promise;
}

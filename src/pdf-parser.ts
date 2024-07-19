import PdfParser from "pdf2json";

export async function parsePdf(pdfFilePath: string): Promise<string> {
    const parser = new PdfParser();

    const promise = new Promise<string>((resolve, reject) => {
        parser.on("pdfParser_dataError", reject);

        parser.on("pdfParser_dataReady", pdfData => {
            const strings = pdfData.Pages.flatMap(page => page.Texts.flatMap(text => text.R.map(r => r.T)));
            const extractedText = strings.join("");
            const decodedText = decodeURIComponent(extractedText);

            resolve(decodedText);
        });

        parser.loadPDF(pdfFilePath);
    });

    return await promise;
}

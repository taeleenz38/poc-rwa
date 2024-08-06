import { Injectable } from "@nestjs/common";
import Docxtemplater from "docxtemplater";
import * as fs from 'fs';
import * as libre from 'libreoffice-convert';
import * as path from "path";
import PizZip from "pizzip";
import { promisify } from 'util';

const ext = '.pdf';
@Injectable()
export class DocGenService {



    public async generatePDF(docFillParam: any): Promise<Buffer> {
        const content = fs.readFileSync(path.resolve(__dirname, '../resources/contract.docx'), 'binary');
        // const outputPath = path.join(__dirname, `../resources/example${ext}`);
        const zip = new PizZip(content);

        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
        doc.render(docFillParam);

        const buf = doc.getZip().generate({
            type: "nodebuffer",
            // compression: DEFLATE adds a compression step.
            // For a 50MB output document, expect 500ms additional CPU time
            compression: "DEFLATE",
        });

        // fs.writeFileSync(path.resolve(__dirname, "output.docx"), buf);

        const convertAsync = promisify(libre.convert);
        const pdfBuf = await convertAsync(buf, ext, undefined);
        return pdfBuf;
        // await fs.writeFileSync(outputPath, pdfBuf);
    }
}
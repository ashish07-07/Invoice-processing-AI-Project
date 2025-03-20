// import { NextRequest, NextResponse } from 'next/server';
// import { pdfjs } from 'react-pdf';
// import { createWorker } from 'tesseract.js';
// import { createCanvas } from 'canvas';
// import path from 'path';

// // Server-side worker configuration
// pdfjs.GlobalWorkerOptions.workerSrc = path.resolve(
//   './node_modules/pdfjs-dist/legacy/build/pdf.worker.min.js'
// );

// export async function POST(req: NextRequest) {
//   try {
//     const pdfBuffer = await req.arrayBuffer();
//     const pdf = await pdfjs.getDocument({ data: new Uint8Array(pdfBuffer) }).promise;
//     const page = await pdf.getPage(1);
//     const viewport = page.getViewport({ scale: 2.0 });

//     const canvas:any = createCanvas(viewport.width, viewport.height);
//     const context = canvas.getContext('2d');
//     await page.render({ canvasContext: context, viewport }).promise;

//     const worker = await createWorker();
//     await worker.loadLanguage('eng');
//     await worker.initialize('eng');

//     const { data: { text } } = await worker.recognize(canvas.toBuffer());
//     await worker.terminate();

//     return NextResponse.json({ text }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Text extraction failed' }, { status: 500 });
//   }
// }

import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";
import Tesseract from "tesseract.js";

export const config = {
  api: {
    bodyParser: false, // Disables default body parser to handle file uploads
  },
};

const parsePDF = async (filePath: string) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text; // Extracted text from the PDF
};

const extractTextFromImage = async (filePath: string) => {
  const { data } = await Tesseract.recognize(filePath, "eng");
  return data.text; // Extracted text using OCR
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form:any = new formidable.IncomingForm();
  form.uploadDir = "/tmp"; // Store files temporarily
  form.keepExtensions = true;

  form.parse(req, async (err:any, fields:any, files:any) => {
    if (err) {
      return res.status(500).json({ error: "File upload failed" });
    }

    const uploadedFile = files.file as File;
    if (!uploadedFile) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const pdfText = await parsePDF(uploadedFile.filepath);
      const ocrText = await extractTextFromImage(uploadedFile.filepath);
      fs.unlinkSync(uploadedFile.filepath); // Cleanup uploaded file

      return res.json({
        pdfText, // Extracted text from selectable text in PDF
        ocrText, // Extracted text from scanned PDF using OCR
      });
    } catch (error) {
      return res.status(500).json({ error: "Error processing file" });
    }
  });
}

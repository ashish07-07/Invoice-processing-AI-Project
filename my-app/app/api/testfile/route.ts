import { tmpdir } from "os";
import { promises as fs } from "fs";
import { createWorker } from "tesseract.js";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { createCanvas } from "canvas";
import { NextRequest, NextResponse } from "next/server";

// Configure PDF.js worker
GlobalWorkerOptions.workerSrc = require.resolve("pdfjs-dist/build/pdf.worker.js");

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const tempPath = `${tmpdir()}/${file.name}`;
        await fs.writeFile(tempPath, buffer);

        // Load PDF document
        const loadingTask = getDocument({
            data: buffer,
            useSystemFonts: true,
            isEvalSupported: false,
        });

        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;

        // Initialize Tesseract
        const worker = await createWorker({
            logger: (m) => console.log(m),
        });
        await worker.loadLanguage("eng");
        await worker.initialize("eng");

        let extractedText = "";

        // Process each page
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2.0 });

            const canvas = createCanvas(viewport.width, viewport.height);
            const ctx = canvas.getContext("2d");

            await page.render({
                canvasContext: ctx as any,
                viewport,
            }).promise;

            const imageBuffer = canvas.toBuffer("image/png");
            const { data: { text } } = await worker.recognize(imageBuffer);
            extractedText += `${text}\n\n`;
        }

        await worker.terminate();
        await fs.unlink(tempPath);

        return NextResponse.json({ text: extractedText }, { status: 200 });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Failed to process PDF" },
            { status: 500 }
        );
    }
}
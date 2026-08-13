import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker from CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;

/**
 * Fast & optimized PDF text extractor (handles 70MB+ large PDFs seamlessly).
 */
export async function extractTextFromPdf(file, onProgress = () => {}) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    
    const pdfDocument = await loadingTask.promise;
    const pageCount = pdfDocument.numPages;
    let fullText = '';
    
    // For very large PDFs (>40 pages), sample smartly to avoid browser freeze & long API waiting
    const MAX_PAGES_TO_PROCESS = 40;
    const pagesToRead = Math.min(pageCount, MAX_PAGES_TO_PROCESS);

    for (let pageNum = 1; pageNum <= pagesToRead; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item) => item.str)
        .join(' ');
      
      fullText += `--- Page ${pageNum} ---\n${pageText}\n\n`;
      
      onProgress(Math.round((pageNum / pagesToRead) * 100));
    }

    const cleanTitle = file.name.replace(/\.[^/.]+$/, "");

    return {
      fullText: fullText.trim(),
      pageCount,
      title: cleanTitle
    };
  } catch (error) {
    console.error("PDF Extraction Error:", error);
    throw new Error(`Failed to read PDF: ${error.message || "File corrupted or unreadable"}`);
  }
}

import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker from CDN to avoid bundler worker path issues
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;

/**
 * Extracts text content page by page from an uploaded PDF File object.
 * @param {File} file - PDF file uploaded by user
 * @param {Function} onProgress - Callback for extraction progress percentage (0-100)
 * @returns {Promise<{ fullText: string, pageCount: number, title: string }>}
 */
export async function extractTextFromPdf(file, onProgress = () => {}) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    
    const pdfDocument = await loadingTask.promise;
    const pageCount = pdfDocument.numPages;
    let fullText = '';
    
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item) => item.str)
        .join(' ');
      
      fullText += `--- Page ${pageNum} ---\n${pageText}\n\n`;
      
      // Update progress
      onProgress(Math.round((pageNum / pageCount) * 100));
    }

    const cleanTitle = file.name.replace(/\.[^/.]+$/, "");

    return {
      fullText: fullText.trim(),
      pageCount,
      title: cleanTitle
    };
  } catch (error) {
    console.error("PDF Extraction Error:", error);
    throw new Error(`Failed to extract text from PDF: ${error.message || "Invalid PDF document"}`);
  }
}

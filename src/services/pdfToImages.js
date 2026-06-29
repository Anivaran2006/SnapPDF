import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { DPI_OPTIONS, IMAGE_QUALITY, OUTPUT_FORMATS } from '../utils/constants';
import { canvasToImageBlob } from '../utils/imageUtils';
import { sanitizeFileName } from '../utils/fileUtils';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

function getScaleForDpi(dpi) {
  return (DPI_OPTIONS[dpi]?.value || 150) / 72;
}

function getOutputFormat(formatName) {
  return OUTPUT_FORMATS[formatName] || OUTPUT_FORMATS.png;
}

export async function loadPdfFromFile(file) {
  const data = await file.arrayBuffer();
  const task = pdfjsLib.getDocument({ data });
  return task.promise;
}

export async function renderPdfPreviews(pdf, onProgress) {
  const previews = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const baseViewport = page.getViewport({ scale: 1 });
    const previewScale = Math.min(0.5, 320 / baseViewport.width);
    const viewport = page.getViewport({ scale: previewScale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { alpha: false });

    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: context, viewport }).promise;
    previews.push({
      pageNumber,
      src: canvas.toDataURL('image/jpeg', 0.76),
      width: Math.round(baseViewport.width),
      height: Math.round(baseViewport.height),
    });

    page.cleanup();
    onProgress?.(Math.round((pageNumber / pdf.numPages) * 100));
  }

  return previews;
}

export async function convertPdfToImages(pdf, sourceName, options, onProgress) {
  const outputFormat = getOutputFormat(options.format);
  const scale = getScaleForDpi(options.dpi);
  const quality = IMAGE_QUALITY[options.quality] || IMAGE_QUALITY.high;
  const baseName = sanitizeFileName(sourceName);
  const images = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { alpha: false });

    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: context, viewport }).promise;
    const blob = await canvasToImageBlob(canvas, outputFormat.mime, quality.label.toLowerCase());
    const name = `${baseName}-page-${String(pageNumber).padStart(2, '0')}.${outputFormat.extension}`;

    images.push({
      id: `${baseName}-${pageNumber}`,
      pageNumber,
      name,
      blob,
      url: URL.createObjectURL(blob),
      size: blob.size,
      width: canvas.width,
      height: canvas.height,
      type: outputFormat.mime,
    });

    page.cleanup();
    onProgress?.(Math.round((pageNumber / pdf.numPages) * 90));
  }

  onProgress?.(100);
  return images;
}

export async function createImagesZip(images, sourceName, onProgress) {
  const zip = new JSZip();
  const baseName = sanitizeFileName(sourceName);

  images.forEach((image) => {
    zip.file(image.name, image.blob);
  });

  return zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
      mimeType: 'application/zip',
    },
    (metadata) => onProgress?.(Math.round(metadata.percent)),
  ).then((blob) => ({
    blob,
    name: `${baseName}-images.zip`,
  }));
}

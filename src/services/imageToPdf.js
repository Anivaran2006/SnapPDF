import { PDFDocument } from 'pdf-lib';
import { IMAGE_FITS, MARGINS, PAPER_SIZES } from '../utils/constants';
import { imageFileToJpeg } from '../utils/imageUtils';

function getPageSize(paperSize, orientation) {
  const paper = PAPER_SIZES[paperSize] || PAPER_SIZES.A4;
  const portrait = { width: paper.width, height: paper.height };
  if (orientation === 'landscape') {
    return { width: Math.max(paper.width, paper.height), height: Math.min(paper.width, paper.height) };
  }
  return { width: Math.min(portrait.width, portrait.height), height: Math.max(portrait.width, portrait.height) };
}

function calculateImagePlacement(imageWidth, imageHeight, contentWidth, contentHeight, fitMode) {
  if (fitMode === 'fill') {
    const coverScale = Math.max(contentWidth / imageWidth, contentHeight / imageHeight);
    return {
      width: imageWidth * coverScale,
      height: imageHeight * coverScale,
    };
  }

  if (fitMode === 'original') {
    const originalScale = Math.min(1, contentWidth / imageWidth, contentHeight / imageHeight);
    return {
      width: imageWidth * originalScale,
      height: imageHeight * originalScale,
    };
  }

  const containScale = Math.min(contentWidth / imageWidth, contentHeight / imageHeight);
  return {
    width: imageWidth * containScale,
    height: imageHeight * containScale,
  };
}

export async function createPdfFromImages(images, options, onProgress) {
  const pdf = await PDFDocument.create();
  const pageSize = getPageSize(options.paperSize, options.orientation);
  const margin = (MARGINS[options.margin] || MARGINS.medium).value;
  const contentWidth = Math.max(1, pageSize.width - margin * 2);
  const contentHeight = Math.max(1, pageSize.height - margin * 2);

  for (let index = 0; index < images.length; index += 1) {
    const item = images[index];
    const processed = await imageFileToJpeg(item.file, item.rotation, options.quality);
    const embedded = await pdf.embedJpg(processed.bytes);
    const page = pdf.addPage([pageSize.width, pageSize.height]);
    const placement = calculateImagePlacement(
      processed.width,
      processed.height,
      contentWidth,
      contentHeight,
      options.fit || Object.keys(IMAGE_FITS)[0],
    );

    page.drawImage(embedded, {
      x: margin + (contentWidth - placement.width) / 2,
      y: margin + (contentHeight - placement.height) / 2,
      width: placement.width,
      height: placement.height,
    });

    onProgress?.(Math.round(((index + 1) / images.length) * 92));
  }

  const bytes = await pdf.save();
  onProgress?.(100);
  return new Blob([bytes], { type: 'application/pdf' });
}

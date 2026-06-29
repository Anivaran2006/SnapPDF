export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const PDF_MIME_TYPES = ['application/pdf'];

export const MAX_IMAGE_SIZE = 25 * 1024 * 1024;
export const MAX_PDF_SIZE = 100 * 1024 * 1024;
export const MAX_HISTORY_BLOB_SIZE = 3.5 * 1024 * 1024;

export const THEME_KEY = 'snappdf-theme';
export const HISTORY_KEY = 'snappdf-history-v1';

export const PAPER_SIZES = {
  A4: { label: 'A4', width: 595.28, height: 841.89 },
  Letter: { label: 'Letter', width: 612, height: 792 },
  Legal: { label: 'Legal', width: 612, height: 1008 },
};

export const MARGINS = {
  none: { label: 'None', value: 0 },
  small: { label: 'Small', value: 18 },
  medium: { label: 'Medium', value: 36 },
  large: { label: 'Large', value: 72 },
};

export const IMAGE_FITS = {
  fill: { label: 'Fill Page' },
  fit: { label: 'Fit Page' },
  original: { label: 'Original Size' },
};

export const IMAGE_QUALITY = {
  high: { label: 'High', value: 0.95, maxDimension: 3600 },
  medium: { label: 'Medium', value: 0.82, maxDimension: 2600 },
  low: { label: 'Low', value: 0.64, maxDimension: 1800 },
};

export const OUTPUT_FORMATS = {
  png: { label: 'PNG', mime: 'image/png', extension: 'png' },
  jpg: { label: 'JPG', mime: 'image/jpeg', extension: 'jpg' },
  webp: { label: 'WEBP', mime: 'image/webp', extension: 'webp' },
};

export const DPI_OPTIONS = {
  72: { label: '72 DPI', value: 72 },
  150: { label: '150 DPI', value: 150 },
  300: { label: '300 DPI', value: 300 },
};

export const ROUTES = {
  home: 'home',
  imageToPdf: 'image-to-pdf',
  pdfToImages: 'pdf-to-images',
  recent: 'recent',
};

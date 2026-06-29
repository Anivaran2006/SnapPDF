import { IMAGE_MIME_TYPES, MAX_IMAGE_SIZE, MAX_PDF_SIZE, PDF_MIME_TYPES } from './constants';

export function formatBytes(bytes = 0) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export function formatDate(isoDate) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoDate));
}

export function validateImageFile(file) {
  if (!IMAGE_MIME_TYPES.includes(file.type)) {
    return 'Only JPG, JPEG, PNG, and WEBP images are supported.';
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return `Image is too large. Keep each file under ${formatBytes(MAX_IMAGE_SIZE)}.`;
  }
  return '';
}

export function validatePdfFile(file) {
  const isPdf = PDF_MIME_TYPES.includes(file.type) || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) return 'Only PDF files are supported.';
  if (file.size > MAX_PDF_SIZE) {
    return `PDF is too large. Keep files under ${formatBytes(MAX_PDF_SIZE)}.`;
  }
  return '';
}

export function readImageDimensions(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => reject(new Error('The image could not be read.'));
    image.src = src;
  });
}

export function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not store the generated file.'));
    reader.readAsDataURL(blob);
  });
}

export function dataUrlToBlob(dataUrl) {
  const [header, payload] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
  const binary = atob(payload);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mime });
}

export function sanitizeFileName(name) {
  return name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'snappdf-file';
}

export function createId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

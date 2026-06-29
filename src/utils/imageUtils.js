import { IMAGE_QUALITY } from './constants';

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Could not create an image from this page.'));
      },
      mimeType,
      quality,
    );
  });
}

async function createBitmap(file) {
  if ('createImageBitmap' in window) {
    return createImageBitmap(file);
  }

  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error('This image could not be opened.'));
      element.src = url;
    });
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function imageFileToJpeg(file, rotation = 0, qualityName = 'high') {
  const bitmap = await createBitmap(file);
  const quality = IMAGE_QUALITY[qualityName] || IMAGE_QUALITY.high;
  const radians = (rotation * Math.PI) / 180;
  const sourceWidth = bitmap.width;
  const sourceHeight = bitmap.height;
  const scale = Math.min(1, quality.maxDimension / Math.max(sourceWidth, sourceHeight));
  const drawWidth = Math.max(1, Math.round(sourceWidth * scale));
  const drawHeight = Math.max(1, Math.round(sourceHeight * scale));
  const isSideways = Math.abs(rotation % 180) === 90;
  const canvas = document.createElement('canvas');

  canvas.width = isSideways ? drawHeight : drawWidth;
  canvas.height = isSideways ? drawWidth : drawHeight;

  const context = canvas.getContext('2d', { alpha: false });
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate(radians);
  context.drawImage(bitmap, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

  if ('close' in bitmap) bitmap.close();

  const blob = await canvasToBlob(canvas, 'image/jpeg', quality.value);
  return {
    bytes: await blob.arrayBuffer(),
    width: canvas.width,
    height: canvas.height,
    blob,
  };
}

export function canvasToImageBlob(canvas, mimeType, qualityName = 'high') {
  const quality = IMAGE_QUALITY[qualityName] || IMAGE_QUALITY.high;
  return canvasToBlob(canvas, mimeType, quality.value);
}

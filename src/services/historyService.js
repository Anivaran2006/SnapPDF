import { saveAs } from 'file-saver';
import { HISTORY_KEY, MAX_HISTORY_BLOB_SIZE } from '../utils/constants';
import { blobToDataUrl, createId, dataUrlToBlob } from '../utils/fileUtils';

export function getHistoryItems() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(items) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 12)));
}

export async function buildHistoryItem({
  fileName,
  conversionType,
  sourceSize,
  outputName,
  outputBlob,
}) {
  const canStoreOutput = outputBlob && outputBlob.size <= MAX_HISTORY_BLOB_SIZE;
  const dataUrl = canStoreOutput ? await blobToDataUrl(outputBlob) : '';

  return {
    id: createId(),
    fileName,
    conversionType,
    date: new Date().toISOString(),
    fileSize: sourceSize,
    outputName,
    outputType: outputBlob?.type || 'application/octet-stream',
    dataUrl,
    downloadable: Boolean(dataUrl),
  };
}

export function addHistoryItem(item) {
  const items = [item, ...getHistoryItems()].slice(0, 12);
  try {
    persist(items);
    return true;
  } catch {
    const compact = items.map((entry, index) => (index === 0 ? { ...entry, dataUrl: '', downloadable: false } : entry));
    try {
      persist(compact);
    } catch {
      persist(compact.map((entry) => ({ ...entry, dataUrl: '', downloadable: false })));
    }
    return false;
  }
}

export function deleteHistoryItem(id) {
  persist(getHistoryItems().filter((item) => item.id !== id));
}

export function clearHistoryItems() {
  persist([]);
}

export function downloadHistoryItem(item) {
  if (!item.dataUrl) throw new Error('This file was too large to store for repeat download.');
  const blob = dataUrlToBlob(item.dataUrl);
  saveAs(blob, item.outputName || item.fileName);
}

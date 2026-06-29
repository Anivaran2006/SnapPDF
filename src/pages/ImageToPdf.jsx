import { saveAs } from 'file-saver';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Download,
  Eraser,
  FileText,
  GripVertical,
  RefreshCw,
  RotateCw,
  Share2,
  SlidersHorizontal,
  Trash2,
  ZoomIn,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../components/Button';
import { DropZone } from '../components/DropZone';
import { IconButton } from '../components/IconButton';
import { OptionGroup } from '../components/OptionGroup';
import { PageHeader } from '../components/PageHeader';
import { ProgressBar } from '../components/ProgressBar';
import { useToast } from '../context/ToastContext';
import { addHistoryItem, buildHistoryItem } from '../services/historyService';
import { createPdfFromImages } from '../services/imageToPdf';
import { IMAGE_FITS, IMAGE_QUALITY, MARGINS, PAPER_SIZES } from '../utils/constants';
import { createId, formatBytes, readImageDimensions, sanitizeFileName, validateImageFile } from '../utils/fileUtils';

const defaultOptions = {
  paperSize: 'A4',
  orientation: 'portrait',
  margin: 'medium',
  fit: 'fit',
  quality: 'high',
};

function ImageCard({ item, index, zoom, onRemove, onRotate, onDragStart, onDrop }) {
  return (
    <motion.article
      layout
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDrop(index);
      }}
      className="tool-card overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-slate-200/70 px-3 py-2 dark:border-white/10">
        <div className="flex min-w-0 items-center gap-2">
          <GripVertical aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-400" />
          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{item.name}</p>
        </div>
        <div className="flex items-center gap-1">
          <IconButton label={`Rotate ${item.name}`} icon={RotateCw} onClick={() => onRotate(item.id)} className="h-9 w-9 border-0 bg-transparent" />
          <IconButton label={`Remove ${item.name}`} icon={Trash2} onClick={() => onRemove(item.id)} className="h-9 w-9 border-0 bg-transparent text-rose-600 dark:text-rose-300" />
        </div>
      </div>
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={item.url}
          alt={`Preview of ${item.name}`}
          className="max-h-full max-w-full object-contain transition-transform duration-200"
          style={{ transform: `rotate(${item.rotation}deg) scale(${zoom})` }}
        />
      </div>
      <dl className="grid grid-cols-2 gap-2 px-3 py-3 text-xs text-slate-600 dark:text-slate-300">
        <div>
          <dt className="font-bold text-slate-500 dark:text-slate-400">Dimensions</dt>
          <dd>{item.width} x {item.height}</dd>
        </div>
        <div>
          <dt className="font-bold text-slate-500 dark:text-slate-400">File Size</dt>
          <dd>{formatBytes(item.size)}</dd>
        </div>
      </dl>
    </motion.article>
  );
}

export default function ImageToPdf() {
  const { addToast } = useToast();
  const [images, setImages] = useState([]);
  const [options, setOptions] = useState(defaultOptions);
  const [previewZoom, setPreviewZoom] = useState(1);
  const [dragIndex, setDragIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfName, setPdfName] = useState('snappdf-images.pdf');
  const imagesRef = useRef([]);
  const pdfUrlRef = useRef('');

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    pdfUrlRef.current = pdfUrl;
  }, [pdfUrl]);

  useEffect(() => () => {
    imagesRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
  }, []);

  const totalSize = useMemo(() => images.reduce((sum, item) => sum + item.size, 0), [images]);

  const updateOption = (key, value) => {
    setOptions((current) => ({ ...current, [key]: value }));
  };

  const resetPdf = () => {
    if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
    setPdfBlob(null);
    setPdfUrl('');
    setProgress(0);
  };

  const addFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) {
      addToast({ type: 'warning', title: 'No images selected', message: 'Add at least one JPG, PNG, or WEBP image.' });
      return;
    }

    resetPdf();
    const accepted = [];

    for (const file of files) {
      const validationMessage = validateImageFile(file);
      if (validationMessage) {
        addToast({ type: 'error', title: 'Unsupported image', message: `${file.name}: ${validationMessage}` });
        continue;
      }

      const url = URL.createObjectURL(file);
      try {
        const dimensions = await readImageDimensions(url);
        accepted.push({
          id: createId(),
          file,
          url,
          name: file.name,
          size: file.size,
          rotation: 0,
          ...dimensions,
        });
      } catch {
        URL.revokeObjectURL(url);
        addToast({ type: 'error', title: 'Image could not be read', message: `${file.name} may be corrupted.` });
      }
    }

    if (accepted.length) {
      setImages((current) => [...current, ...accepted]);
      addToast({ type: 'success', title: 'Images added', message: `${accepted.length} image${accepted.length === 1 ? '' : 's'} ready for PDF conversion.` });
    }
  };

  const removeImage = (id) => {
    setImages((current) => {
      const item = current.find((image) => image.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return current.filter((image) => image.id !== id);
    });
    resetPdf();
  };

  const clearImages = () => {
    images.forEach((item) => URL.revokeObjectURL(item.url));
    setImages([]);
    resetPdf();
  };

  const rotateImage = (id) => {
    setImages((current) => current.map((image) => (
      image.id === id ? { ...image, rotation: (image.rotation + 90) % 360 } : image
    )));
    resetPdf();
  };

  const reorderImage = (toIndex) => {
    if (dragIndex === null || dragIndex === toIndex) return;
    setImages((current) => {
      const copy = [...current];
      const [moved] = copy.splice(dragIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
    setDragIndex(null);
    resetPdf();
  };

  const convert = async () => {
    if (!images.length) {
      addToast({ type: 'warning', title: 'Nothing to convert', message: 'Upload one or more images before creating a PDF.' });
      return;
    }

    resetPdf();
    setIsConverting(true);
    setProgress(4);

    try {
      const blob = await createPdfFromImages(images, options, (value) => setProgress(Math.max(4, value)));
      const url = URL.createObjectURL(blob);
      const outputName = `${images.length === 1 ? sanitizeFileName(images[0].name) : `snappdf-${images.length}-images`}.pdf`;

      setPdfBlob(blob);
      setPdfUrl(url);
      setPdfName(outputName);
      setProgress(100);

      const item = await buildHistoryItem({
        fileName: outputName,
        conversionType: 'Images to PDF',
        sourceSize: totalSize,
        outputName,
        outputBlob: blob,
      });
      const stored = addHistoryItem(item);
      addToast({
        type: 'success',
        title: 'PDF ready',
        message: stored ? 'Your converted PDF is ready to preview and download.' : 'PDF ready. It was too large to save for repeat download.',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Conversion failed',
        message: error.message || 'Something went wrong while building the PDF.',
      });
    } finally {
      setIsConverting(false);
    }
  };

  const downloadPdf = () => {
    if (!pdfBlob) return;
    saveAs(pdfBlob, pdfName);
  };

  const sharePdf = async () => {
    if (!pdfBlob) return;
    const file = new File([pdfBlob], pdfName, { type: 'application/pdf' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ title: 'SnapPDF conversion', files: [file] });
      return;
    }
    addToast({ type: 'info', title: 'Share not available', message: 'This browser cannot share files directly. Use Download PDF instead.' });
  };

  const startOver = () => {
    clearImages();
    setOptions(defaultOptions);
    setPreviewZoom(1);
  };

  return (
    <>
      <PageHeader
        eyebrow="Image to PDF"
        title="Build a polished PDF from multiple images"
        subtitle="Drop in JPG, PNG, or WEBP files, reorder pages, tune output settings, and export locally."
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
        <div className="space-y-6">
          <DropZone
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            multiple
            onFiles={addFiles}
            title="Drag and drop images"
            subtitle="Upload JPG, JPEG, PNG, and WEBP files. You can add more images at any time."
            actionLabel="Upload Images"
          />

          {images.length ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 rounded-lg border border-white/60 bg-white/60 p-4 backdrop-blur dark:border-white/10 dark:bg-white/10 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">{images.length} image{images.length === 1 ? '' : 's'} selected</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{formatBytes(totalSize)} total</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <ZoomIn aria-hidden="true" className="h-4 w-4" />
                    <span>Preview zoom</span>
                    <input
                      aria-label="Preview zoom"
                      type="range"
                      min="0.7"
                      max="1.8"
                      step="0.1"
                      value={previewZoom}
                      onChange={(event) => setPreviewZoom(Number(event.target.value))}
                      className="w-28 accent-cyan-600"
                    />
                  </label>
                  <Button variant="danger" icon={Eraser} onClick={clearImages}>
                    Clear All
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {images.map((item, index) => (
                  <ImageCard
                    key={item.id}
                    item={item}
                    index={index}
                    zoom={previewZoom}
                    onRemove={removeImage}
                    onRotate={rotateImage}
                    onDragStart={setDragIndex}
                    onDrop={reorderImage}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {isConverting ? <ProgressBar value={progress} label="Converting images to PDF" /> : null}

          {pdfUrl ? (
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="tool-card overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-black text-slate-950 dark:text-white">PDF created successfully</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{pdfName} · {formatBytes(pdfBlob?.size || 0)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="accent" icon={Download} onClick={downloadPdf}>Download PDF</Button>
                  <Button variant="secondary" icon={Share2} onClick={sharePdf}>Share PDF</Button>
                  <Button variant="ghost" icon={RefreshCw} onClick={startOver}>Start Over</Button>
                </div>
              </div>
              <iframe title="PDF preview" src={pdfUrl} className="h-[32rem] w-full bg-white" />
            </motion.section>
          ) : null}
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <section className="tool-card p-5">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
                <SlidersHorizontal aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-black text-slate-950 dark:text-white">PDF Options</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">Tune layout and compression.</p>
              </div>
            </div>

            <div className="space-y-5">
              <OptionGroup
                label="Paper Size"
                value={options.paperSize}
                onChange={(value) => updateOption('paperSize', value)}
                options={Object.entries(PAPER_SIZES).map(([value, item]) => ({ value, label: item.label }))}
                columns="grid-cols-3"
              />
              <OptionGroup
                label="Orientation"
                value={options.orientation}
                onChange={(value) => updateOption('orientation', value)}
                options={[
                  { value: 'portrait', label: 'Portrait' },
                  { value: 'landscape', label: 'Landscape' },
                ]}
              />
              <OptionGroup
                label="Margins"
                value={options.margin}
                onChange={(value) => updateOption('margin', value)}
                options={Object.entries(MARGINS).map(([value, item]) => ({ value, label: item.label }))}
                columns="grid-cols-2"
              />
              <OptionGroup
                label="Image Fit"
                value={options.fit}
                onChange={(value) => updateOption('fit', value)}
                options={Object.entries(IMAGE_FITS).map(([value, item]) => ({ value, label: item.label }))}
                columns="grid-cols-1"
              />
              <OptionGroup
                label="Image Quality"
                value={options.quality}
                onChange={(value) => updateOption('quality', value)}
                options={Object.entries(IMAGE_QUALITY).map(([value, item]) => ({ value, label: item.label }))}
                columns="grid-cols-3"
              />
              <Button className="w-full" size="lg" variant="accent" icon={FileText} disabled={isConverting} onClick={convert}>
                {isConverting ? 'Converting...' : 'Convert to PDF'}
              </Button>
            </div>
          </section>
        </aside>
      </section>
    </>
  );
}

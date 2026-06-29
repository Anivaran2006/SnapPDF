import { saveAs } from 'file-saver';
import { motion } from 'framer-motion';
import {
  Archive,
  CheckCircle2,
  Download,
  FileText,
  Images,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../components/Button';
import { DropZone } from '../components/DropZone';
import { OptionGroup } from '../components/OptionGroup';
import { PageHeader } from '../components/PageHeader';
import { ProgressBar } from '../components/ProgressBar';
import { useToast } from '../context/ToastContext';
import { addHistoryItem, buildHistoryItem } from '../services/historyService';
import { convertPdfToImages, createImagesZip, loadPdfFromFile, renderPdfPreviews } from '../services/pdfToImages';
import { DPI_OPTIONS, IMAGE_QUALITY, OUTPUT_FORMATS } from '../utils/constants';
import { formatBytes, validatePdfFile } from '../utils/fileUtils';

const defaultOptions = {
  format: 'png',
  quality: 'high',
  dpi: '150',
};

export default function PdfToImages() {
  const { addToast } = useToast();
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pdfInfo, setPdfInfo] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [options, setOptions] = useState(defaultOptions);
  const [extractedImages, setExtractedImages] = useState([]);
  const [zipBlob, setZipBlob] = useState(null);
  const [zipName, setZipName] = useState('');
  const [progress, setProgress] = useState(0);
  const [stageLabel, setStageLabel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const extractedRef = useRef([]);
  const pdfDocRef = useRef(null);

  useEffect(() => {
    extractedRef.current = extractedImages;
  }, [extractedImages]);

  useEffect(() => {
    pdfDocRef.current = pdfDoc;
  }, [pdfDoc]);

  useEffect(() => () => {
    extractedRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    pdfDocRef.current?.destroy?.();
  }, []);

  const clearExtracted = () => {
    extractedImages.forEach((item) => URL.revokeObjectURL(item.url));
    setExtractedImages([]);
    setZipBlob(null);
    setZipName('');
  };

  const resetAll = () => {
    clearExtracted();
    pdfDoc?.destroy?.();
    setPdfDoc(null);
    setPdfInfo(null);
    setPreviews([]);
    setProgress(0);
    setStageLabel('');
  };

  const updateOption = (key, value) => {
    setOptions((current) => ({ ...current, [key]: value }));
    if (extractedImages.length) clearExtracted();
  };

  const handlePdfFiles = async (fileList) => {
    const file = Array.from(fileList || [])[0];
    if (!file) {
      addToast({ type: 'warning', title: 'No PDF selected', message: 'Choose one PDF file to convert.' });
      return;
    }

    const validationMessage = validatePdfFile(file);
    if (validationMessage) {
      addToast({ type: 'error', title: 'Unsupported PDF', message: validationMessage });
      return;
    }

    resetAll();
    setIsLoading(true);
    setStageLabel('Opening PDF');
    setProgress(8);

    try {
      const loaded = await loadPdfFromFile(file);
      setPdfDoc(loaded);
      setPdfInfo({ name: file.name, size: file.size, pages: loaded.numPages });
      setStageLabel('Rendering page previews');
      const rendered = await renderPdfPreviews(loaded, setProgress);
      setPreviews(rendered);
      setProgress(100);
      addToast({ type: 'success', title: 'PDF loaded', message: `${loaded.numPages} page${loaded.numPages === 1 ? '' : 's'} ready to extract.` });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'PDF could not be opened',
        message: error.message || 'The file may be corrupted or password protected.',
      });
      setPdfDoc(null);
      setPdfInfo(null);
      setPreviews([]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setProgress(0);
        setStageLabel('');
      }, 500);
    }
  };

  const convert = async () => {
    if (!pdfDoc || !pdfInfo) {
      addToast({ type: 'warning', title: 'No PDF loaded', message: 'Upload a PDF before converting pages to images.' });
      return;
    }

    clearExtracted();
    setIsConverting(true);
    setStageLabel('Converting pages');
    setProgress(2);

    try {
      const images = await convertPdfToImages(pdfDoc, pdfInfo.name, options, setProgress);
      setExtractedImages(images);
      setStageLabel('Preparing ZIP download');
      const zip = await createImagesZip(images, pdfInfo.name, (value) => setProgress(90 + Math.round(value * 0.1)));
      setZipBlob(zip.blob);
      setZipName(zip.name);

      const item = await buildHistoryItem({
        fileName: pdfInfo.name,
        conversionType: 'PDF to Images',
        sourceSize: pdfInfo.size,
        outputName: zip.name,
        outputBlob: zip.blob,
      });
      const stored = addHistoryItem(item);

      addToast({
        type: 'success',
        title: 'Images extracted',
        message: stored ? 'Pages are ready as individual images and a ZIP file.' : 'Images ready. The ZIP was too large to save for repeat download.',
      });
      setProgress(100);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Conversion failed',
        message: error.message || 'Something went wrong while rendering PDF pages.',
      });
    } finally {
      setIsConverting(false);
      setStageLabel('');
    }
  };

  const downloadZip = async () => {
    if (zipBlob) {
      saveAs(zipBlob, zipName);
      return;
    }
    if (!extractedImages.length || !pdfInfo) return;
    const zip = await createImagesZip(extractedImages, pdfInfo.name);
    saveAs(zip.blob, zip.name);
  };

  return (
    <>
      <PageHeader
        eyebrow="PDF to Images"
        title="Extract every PDF page as a separate image"
        subtitle="Preview pages, choose format and resolution, then download individual images or a ZIP package."
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
        <div className="space-y-6">
          <DropZone
            accept=".pdf,application/pdf"
            onFiles={handlePdfFiles}
            title="Drag and drop a PDF"
            subtitle="Upload a PDF to render page previews and extract each page locally in your browser."
            actionLabel="Upload PDF"
          />

          {isLoading ? <ProgressBar value={progress} label={stageLabel || 'Loading PDF'} /> : null}

          {pdfInfo ? (
            <section className="rounded-lg border border-white/60 bg-white/60 p-4 backdrop-blur dark:border-white/10 dark:bg-white/10">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">File Name</p>
                  <p className="mt-1 truncate font-semibold text-slate-950 dark:text-white">{pdfInfo.name}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">File Size</p>
                  <p className="mt-1 font-semibold text-slate-950 dark:text-white">{formatBytes(pdfInfo.size)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Total Pages</p>
                  <p className="mt-1 font-semibold text-slate-950 dark:text-white">{pdfInfo.pages}</p>
                </div>
              </div>
            </section>
          ) : null}

          {previews.length ? (
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-black text-slate-950 dark:text-white">Page previews</h2>
                <Button variant="ghost" icon={RefreshCw} onClick={resetAll}>Convert another PDF</Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {previews.map((page) => (
                  <article key={page.pageNumber} className="tool-card overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2 text-sm font-bold dark:border-white/10">
                      <span>Page {page.pageNumber}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{page.width} x {page.height}</span>
                    </div>
                    <div className="bg-slate-100 p-3 dark:bg-slate-900">
                      <img src={page.src} alt={`Preview of PDF page ${page.pageNumber}`} className="mx-auto max-h-80 rounded bg-white object-contain shadow-sm" />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {isConverting ? <ProgressBar value={progress} label={stageLabel || 'Converting PDF pages'} /> : null}

          {extractedImages.length ? (
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-400/20 dark:bg-emerald-400/10 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-black text-emerald-950 dark:text-emerald-100">Images extracted successfully</h2>
                    <p className="text-sm text-emerald-800 dark:text-emerald-200">{extractedImages.length} image{extractedImages.length === 1 ? '' : 's'} ready</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="accent" icon={Archive} onClick={downloadZip}>Download All ZIP</Button>
                  <Button variant="secondary" icon={RefreshCw} onClick={resetAll}>Convert Another PDF</Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {extractedImages.map((image) => (
                  <article key={image.id} className="tool-card overflow-hidden">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-3 py-2 dark:border-white/10">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-950 dark:text-white">{image.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {image.width} x {image.height} · {formatBytes(image.size)}
                        </p>
                      </div>
                      <Button size="sm" variant="secondary" icon={Download} onClick={() => saveAs(image.blob, image.name)}>
                        Download
                      </Button>
                    </div>
                    <div className="bg-slate-100 p-3 dark:bg-slate-900">
                      <img src={image.url} alt={`Extracted page ${image.pageNumber}`} className="mx-auto max-h-80 rounded bg-white object-contain shadow-sm" />
                    </div>
                  </article>
                ))}
              </div>
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
                <h2 className="font-black text-slate-950 dark:text-white">Image Options</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">Format, quality, and resolution.</p>
              </div>
            </div>
            <div className="space-y-5">
              <OptionGroup
                label="Output Format"
                value={options.format}
                onChange={(value) => updateOption('format', value)}
                options={Object.entries(OUTPUT_FORMATS).map(([value, item]) => ({ value, label: item.label }))}
                columns="grid-cols-3"
              />
              <OptionGroup
                label="Image Quality"
                value={options.quality}
                onChange={(value) => updateOption('quality', value)}
                options={Object.entries(IMAGE_QUALITY).map(([value, item]) => ({ value, label: item.label }))}
                columns="grid-cols-3"
              />
              <OptionGroup
                label="Resolution"
                value={options.dpi}
                onChange={(value) => updateOption('dpi', value)}
                options={Object.entries(DPI_OPTIONS).map(([value, item]) => ({ value, label: item.label }))}
                columns="grid-cols-1"
              />
              <Button className="w-full" size="lg" variant="accent" icon={Images} disabled={isConverting || !pdfDoc} onClick={convert}>
                {isConverting ? 'Converting...' : 'Convert to Images'}
              </Button>
              <Button className="w-full" variant="secondary" icon={FileText} onClick={resetAll}>
                Convert Another PDF
              </Button>
            </div>
          </section>
        </aside>
      </section>
    </>
  );
}

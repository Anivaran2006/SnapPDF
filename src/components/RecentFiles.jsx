import { Download, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { formatBytes, formatDate } from '../utils/fileUtils';

export function RecentFiles({ items, onDownload, onDelete }) {
  if (!items.length) {
    return (
      <div className="tool-card p-8 text-center">
        <p className="text-lg font-semibold text-slate-950 dark:text-white">No recent conversions yet</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Converted files will appear here with repeat downloads when they fit in Local Storage.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white/80 shadow-soft dark:border-white/10 dark:bg-slate-950/60">
      <div className="hidden grid-cols-[1.5fr_1fr_1fr_.8fr_auto] gap-4 border-b border-slate-200 px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:border-white/10 dark:text-slate-400 md:grid">
        <span>File Name</span>
        <span>Conversion Type</span>
        <span>Date</span>
        <span>File Size</span>
        <span className="text-right">Actions</span>
      </div>
      <div className="divide-y divide-slate-200 dark:divide-white/10">
        {items.map((item) => (
          <div key={item.id} className="grid gap-3 px-4 py-4 md:grid-cols-[1.5fr_1fr_1fr_.8fr_auto] md:items-center">
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-950 dark:text-white">{item.fileName}</p>
              {!item.downloadable ? (
                <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">Repeat download unavailable for large output.</p>
              ) : null}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{item.conversionType}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{formatDate(item.date)}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{formatBytes(item.fileSize)}</p>
            <div className="flex items-center justify-start gap-2 md:justify-end">
              <Button size="sm" variant="secondary" icon={Download} disabled={!item.downloadable} onClick={() => onDownload(item)}>
                Download Again
              </Button>
              <Button size="sm" variant="danger" icon={Trash2} onClick={() => onDelete(item.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

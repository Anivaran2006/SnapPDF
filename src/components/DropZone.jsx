import { useRef, useState } from 'react';
import { FilePlus2, UploadCloud } from 'lucide-react';
import { Button } from './Button';

export function DropZone({
  accept,
  multiple = false,
  onFiles,
  title,
  subtitle,
  actionLabel = 'Choose files',
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    onFiles?.(event.dataTransfer.files);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={title}
      onClick={openPicker}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openPicker();
        }
      }}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsDragging(false);
      }}
      onDrop={handleDrop}
      className={[
        'focus-ring group flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition',
        isDragging
          ? 'border-cyan-500 bg-cyan-500/10'
          : 'border-slate-300/80 bg-white/50 hover:border-cyan-500 hover:bg-cyan-500/10 dark:border-white/15 dark:bg-white/10',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(event) => {
          onFiles?.(event.target.files);
          event.target.value = '';
        }}
      />
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-700 transition group-hover:scale-105 dark:text-cyan-300">
        <UploadCloud aria-hidden="true" className="h-7 w-7" />
      </span>
      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">{subtitle}</p>
      <Button className="mt-5" variant="accent" icon={FilePlus2}>
        {actionLabel}
      </Button>
    </div>
  );
}

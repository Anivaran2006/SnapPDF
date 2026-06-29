import { Trash2 } from 'lucide-react';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { RecentFiles } from '../components/RecentFiles';
import { useToast } from '../context/ToastContext';
import { useRecentHistory } from '../hooks/useRecentHistory';
import { downloadHistoryItem } from '../services/historyService';

export default function Recent() {
  const { items, deleteItem, clearAll } = useRecentHistory();
  const { addToast } = useToast();

  const download = (item) => {
    try {
      downloadHistoryItem(item);
    } catch (error) {
      addToast({
        type: 'warning',
        title: 'Download unavailable',
        message: error.message || 'This history item cannot be downloaded again.',
      });
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Recent Files"
        title="Conversion history stored locally"
        subtitle="SnapPDF keeps a compact Local Storage history for repeat downloads when outputs are small enough."
      >
        {items.length ? (
          <Button variant="danger" icon={Trash2} onClick={clearAll}>
            Delete History
          </Button>
        ) : null}
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <RecentFiles items={items} onDownload={download} onDelete={deleteItem} />
      </section>
    </>
  );
}

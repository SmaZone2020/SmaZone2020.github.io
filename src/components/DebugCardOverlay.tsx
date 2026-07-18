import { Pencil, TrashBin } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import { useI18n } from '../i18n';

interface DebugCardOverlayProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function DebugCardOverlay({ onEdit, onDelete }: DebugCardOverlayProps) {
  const { t } = useI18n();

  return (
    <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <Button
        isIconOnly
        size="sm"
        variant="secondary"
        aria-label={t('debug.editPost')}
        onPress={onEdit}
      >
        <Pencil className="w-4 h-4" />
      </Button>
      <Button
        isIconOnly
        size="sm"
        variant="danger"
        aria-label={t('debug.delete')}
        onPress={onDelete}
      >
        <TrashBin className="w-4 h-4" />
      </Button>
    </div>
  );
}

import { Plus } from '@gravity-ui/icons';
import { Button } from '@heroui/react';

interface DebugAddButtonProps {
  label: string;
  onPress: () => void;
}

export default function DebugAddButton({ label, onPress }: DebugAddButtonProps) {
  return (
    <Button
      isIconOnly
      variant="primary"
      size="lg"
      aria-label={label}
      onPress={onPress}
      className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg"
    >
      <Plus className="w-6 h-6" />
    </Button>
  );
}

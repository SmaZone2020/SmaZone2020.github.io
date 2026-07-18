import { useState, useEffect, useRef } from 'react';
import { Button } from '@heroui/react';
import { ArrowUpToLine, Picture } from '@gravity-ui/icons';
import { useI18n } from '../i18n';

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImagePicker({ value, onChange, label }: ImagePickerProps) {
  const { t } = useI18n();
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/images')
      .then(r => r.json())
      .then(setImages)
      .catch(() => {});
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      fetch('/api/images/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, data: reader.result }),
      })
        .then(r => r.json())
        .then(({ path }: { path: string }) => {
          setImages(prev => [path, ...prev.filter(i => i !== path)]);
          onChange(path);
          setUploading(false);
        })
        .catch(() => setUploading(false));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      {label && <span className="text-sm text-muted-foreground">{label}</span>}

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground truncate flex-1 min-w-0">
          {value || t('debug.image')}
        </span>
        <Button
          size="sm"
          variant="secondary"
          isDisabled={uploading}
          onPress={() => fileRef.current?.click()}
        >
          <ArrowUpToLine className="w-4 h-4" />
          {uploading ? '...' : 'Upload'}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
        <Button
          size="sm"
          variant="secondary"
          onPress={() => setShowGallery(!showGallery)}
        >
          <Picture className="w-4 h-4" />
          Select
        </Button>
      </div>

      {showGallery && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-default/20 rounded-xl">
          {images.map(img => (
            <button
              key={img}
              type="button"
              onClick={() => { onChange(img); setShowGallery(false); }}
              className={`relative rounded-lg overflow-hidden border-2 transition-colors ${
                value === img ? 'border-blue-500' : 'border-transparent hover:border-default'
              }`}
            >
              <img
                src={img}
                alt={img}
                className="w-full h-14 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="block text-[9px] text-muted-foreground truncate px-1 leading-tight">
                {img.split('/').pop()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

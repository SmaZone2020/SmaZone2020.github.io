import { useState, useEffect, useCallback } from 'react';
import { Modal, Button, TextField, Input, TextArea, Label } from '@heroui/react';
import { useI18n } from '../i18n';
import ImagePicker from './ImagePicker';

type DebugEntityType = 'post' | 'project' | 'friend' | 'site';

interface DebugFormModalProps {
  type: DebugEntityType;
  initialData: Record<string, any> | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Record<string, any>) => void;
}

export default function DebugFormModal({ type, initialData, isOpen, onOpenChange, onSave }: DebugFormModalProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {});
    }
  }, [isOpen, initialData]);

  const set = useCallback((key: string, value: string) => {
    setFormData(prev => {
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        return { ...prev, [parent]: { ...(prev[parent] || {}), [child]: value } };
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const handleSave = () => {
    const data = { ...formData };
    if ((type === 'post' || type === 'site') && typeof data.tags === 'string') {
      data.tags = (data.tags as string).split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    onSave(data);
  };

  const isEdit = initialData !== null;
  const getLabel = (suffix: string) => {
    if (suffix === 'post') return isEdit ? t('debug.editPost') : t('debug.addPost');
    if (suffix === 'project') return isEdit ? t('debug.editProject') : t('debug.addProject');
    if (suffix === 'site') return t('debug.editSite');
    return isEdit ? t('debug.editFriend') : t('debug.addFriend');
  };

  return (
    <Modal.Backdrop variant="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container placement="center">
        <Modal.Dialog className="max-w-lg max-h-[85vh] overflow-y-auto">
          <Modal.Header>
            <Modal.Heading>{getLabel(type)}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="flex flex-col gap-4">
            {type === 'post' && (
              <>
                <TextField value={formData.title || ''} onChange={(v) => set('title', v)} name="title" isRequired>
                  <Label>{t('debug.title')}</Label>
                  <Input />
                </TextField>
                <TextField value={formData.date || ''} onChange={(v) => set('date', v)} name="date" isRequired>
                  <Label>{t('debug.date')}</Label>
                  <Input type="date" />
                </TextField>
                <TextField value={Array.isArray(formData.tags) ? formData.tags.join(', ') : (formData.tags || '')} onChange={(v) => set('tags', v)} name="tags">
                  <Label>{t('debug.tags')}</Label>
                  <Input placeholder="tag1, tag2, tag3" />
                </TextField>
                <TextField value={formData.description || ''} onChange={(v) => set('description', v)} name="description">
                  <Label>{t('debug.description')}</Label>
                  <TextArea rows={3} />
                </TextField>
                <ImagePicker value={formData.image || ''} onChange={(v) => set('image', v)} />
                <TextField value={formData.content || ''} onChange={(v) => set('content', v)} name="content">
                  <Label>{t('debug.content')}</Label>
                  <TextArea rows={10} />
                </TextField>
              </>
            )}
            {type === 'project' && (
              <>
                <TextField value={formData.title || ''} onChange={(v) => set('title', v)} name="title" isRequired>
                  <Label>{t('debug.title')}</Label>
                  <Input />
                </TextField>
                <TextField value={formData.href || ''} onChange={(v) => set('href', v)} name="href" isRequired>
                  <Label>{t('debug.href')}</Label>
                  <Input placeholder="https://..." />
                </TextField>
                <ImagePicker value={formData.image || ''} onChange={(v) => set('image', v)} />
                <TextField value={formData.description || ''} onChange={(v) => set('description', v)} name="description">
                  <Label>{t('debug.description')}</Label>
                  <TextArea rows={3} />
                </TextField>
                <TextField value={formData.platform || ''} onChange={(v) => set('platform', v)} name="platform">
                  <Label>{t('debug.platform')}</Label>
                  <Input placeholder="github" />
                </TextField>
              </>
            )}
            {type === 'friend' && (
              <>
                <TextField value={formData.name || ''} onChange={(v) => set('name', v)} name="name" isRequired>
                  <Label>{t('debug.name')}</Label>
                  <Input />
                </TextField>
                <TextField value={formData.url || ''} onChange={(v) => set('url', v)} name="url" isRequired>
                  <Label>{t('debug.url')}</Label>
                  <Input placeholder="https://..." />
                </TextField>
                <ImagePicker value={formData.avatar || ''} onChange={(v) => set('avatar', v)} label={t('debug.avatar')} />
                <TextField value={formData.description || ''} onChange={(v) => set('description', v)} name="description">
                  <Label>{t('debug.description')}</Label>
                  <TextArea rows={3} />
                </TextField>
              </>
            )}
            {type === 'site' && (
              <>
                <TextField value={formData.name || ''} onChange={(v) => set('name', v)} name="name" isRequired>
                  <Label>{t('debug.siteName')}</Label>
                  <Input />
                </TextField>
                <TextField value={formData.title || ''} onChange={(v) => set('title', v)} name="title">
                  <Label>{t('debug.siteTitle')}</Label>
                  <Input />
                </TextField>
                <TextField value={formData.author || ''} onChange={(v) => set('author', v)} name="author" isRequired>
                  <Label>{t('debug.author')}</Label>
                  <Input />
                </TextField>
                <TextField value={formData.handle || ''} onChange={(v) => set('handle', v)} name="handle">
                  <Label>{t('debug.handle')}</Label>
                  <Input />
                </TextField>
                <TextField value={formData.email || ''} onChange={(v) => set('email', v)} name="email">
                  <Label>{t('debug.email')}</Label>
                  <Input />
                </TextField>
                <TextField value={formData.siteUrl || ''} onChange={(v) => set('siteUrl', v)} name="siteUrl">
                  <Label>{t('debug.siteUrl')}</Label>
                  <Input />
                </TextField>
                <TextField value={Array.isArray(formData.tags) ? formData.tags.join(', ') : (formData.tags || '')} onChange={(v) => set('tags', v)} name="tags">
                  <Label>{t('debug.tags')}</Label>
                  <Input placeholder="tag1, tag2, tag3" />
                </TextField>
                <ImagePicker value={formData.avatar || ''} onChange={(v) => set('avatar', v)} label={t('debug.avatar')} />
                <ImagePicker value={formData.heroImage || ''} onChange={(v) => set('heroImage', v)} label={t('debug.heroImage')} />
                <TextField value={formData.social?.github || ''} onChange={(v) => set('social.github', v)} name="social.github">
                  <Label>GitHub</Label>
                  <Input placeholder="https://github.com/..." />
                </TextField>
                <TextField value={formData.social?.bili || ''} onChange={(v) => set('social.bili', v)} name="social.bili">
                  <Label>Bilibili</Label>
                  <Input placeholder="https://space.bilibili.com/..." />
                </TextField>
                <TextField value={formData.social?.email || ''} onChange={(v) => set('social.email', v)} name="social.email">
                  <Label>Email</Label>
                  <Input placeholder="mailto:..." />
                </TextField>
                <TextField value={formData.social?.bonjour || ''} onChange={(v) => set('social.bonjour', v)} name="social.bonjour">
                  <Label>Bonjour</Label>
                  <Input placeholder="https://bonjour.bio/..." />
                </TextField>
                <TextField value={formData.social?.wecom || ''} onChange={(v) => set('social.wecom', v)} name="social.wecom">
                  <Label>WeChat Work</Label>
                  <Input placeholder="https://work.weixin.qq.com/..." />
                </TextField>
              </>
            )}
          </Modal.Body>
          <Modal.Footer className="gap-2">
            <Button variant="secondary" onPress={() => onOpenChange(false)}>
              {t('debug.cancel')}
            </Button>
            <Button variant="primary" onPress={handleSave}>
              {t('debug.save')}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

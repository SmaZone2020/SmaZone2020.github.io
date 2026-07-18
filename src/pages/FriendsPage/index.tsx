import { useEffect, useState } from 'react';
import { ArrowUpRightFromSquare } from '@gravity-ui/icons';
import { Card } from '@heroui/react';
import DefaultLayout from '../../layout/DefaultLayout';
import { useI18n } from '../../i18n';
import { setTitle } from '../../App';
import { friends } from '../../lib/data';
import type { FriendLink } from '../../config/site';
import DebugCardOverlay from '../../components/DebugCardOverlay';
import DebugAddButton from '../../components/DebugAddButton';
import DebugFormModal from '../../components/DebugFormModal';

type FormMode = { mode: 'add' } | { mode: 'edit'; data: FriendLink } | null;

function FriendsPage() {
  const IS_DEV = import.meta.env.DEV;
  const { t } = useI18n();
  const [formMode, setFormMode] = useState<FormMode>(null);

  useEffect(() => {
    setTitle(t('nav.friends'));
  }, [t]);

  const renderCard = (friend: FriendLink) => (
    <a href={friend.url} target="_blank" rel="noopener noreferrer">
      <Card className="h-full bg-white/40 dark:bg-surface/50 backdrop-blur-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-2xl">
        <Card.Content className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-default/50 flex items-center justify-center shrink-0 overflow-hidden">
              {friend.avatar ? (
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">
                  {friend.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="font-semibold truncate libre">{friend.name}</h3>
                <ArrowUpRightFromSquare className="w-3 h-3 shrink-0 text-muted-foreground" />
              </div>
              {friend.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {friend.description}
                </p>
              )}
            </div>
          </div>
        </Card.Content>
      </Card>
    </a>
  );

  const handleSave = async (data: Record<string, any>) => {
    let updated: FriendLink[];
    if (formMode?.mode === 'edit' && formMode.data) {
      updated = friends.map(f => f.url === formMode.data.url ? { ...f, ...data } : f);
    } else {
      updated = [data as FriendLink, ...friends];
    }
    await fetch('/api/data/friends', { method: 'PUT', body: JSON.stringify(updated) });
    window.location.reload();
  };

  const handleDelete = async (url: string) => {
    if (!window.confirm(t('debug.confirmDelete'))) return;
    const updated = friends.filter(f => f.url !== url);
    await fetch('/api/data/friends', { method: 'PUT', body: JSON.stringify(updated) });
    window.location.reload();
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold libre mb-2">{t('friends.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 libre">
              {t('friends.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {friends.map((friend) => (
            <div key={friend.url} className="relative group">
              {renderCard(friend)}
              {IS_DEV && (
                <DebugCardOverlay
                  onEdit={() => setFormMode({ mode: 'edit', data: friend })}
                  onDelete={() => handleDelete(friend.url)}
                />
              )}
            </div>
          ))}
        </div>

        {friends.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">{t('friends.subtitle')}</p>
            <p className="text-sm mt-2">{t('friends.comingSoon')}</p>
          </div>
        )}

        {IS_DEV && (
          <>
            <DebugAddButton label={t('debug.addFriend')} onPress={() => setFormMode({ mode: 'add' })} />
            <DebugFormModal
              type="friend"
              initialData={formMode?.mode === 'edit' ? formMode.data : null}
              isOpen={formMode !== null}
              onOpenChange={(open) => { if (!open) setFormMode(null); }}
              onSave={handleSave}
            />
          </>
        )}
      </div>
    </DefaultLayout>
  );
}

export default FriendsPage;

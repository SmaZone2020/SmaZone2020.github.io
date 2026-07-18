import { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { useI18n } from '../../i18n';
import { setTitle } from '../../App';
import { siteData } from '../../lib/data';
import ProfileCard from './ProfileCard';
import InterestsCard from './InterestsCard';
import SocialLinksCard from './SocialLinksCard';
import GolaList from '../../components/GoalList';
import TechStack from '../../components/TechStack';
import DebugFormModal from '../../components/DebugFormModal';
import { Button } from '@heroui/react';
import { Pencil } from '@gravity-ui/icons';

function About() {
    const IS_DEV = import.meta.env.DEV;
    const { t } = useI18n();
    const [formOpen, setFormOpen] = useState(false);

    useEffect(() => {
        setTitle(t('nav.about'));
    }, [t]);

    const handleSave = async (data: Record<string, any>) => {
        const updated = { ...data };
        if (typeof updated.tags === 'string') {
            updated.tags = (updated.tags as string).split(',').map((s: string) => s.trim()).filter(Boolean);
        }
        await fetch('/api/data/site', { method: 'PUT', body: JSON.stringify(updated) });
        window.location.reload();
    };

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 py-6 max-w-3xl">
                {IS_DEV && (
                    <div className="flex justify-end mb-2">
                        <Button
                            size="sm"
                            variant="secondary"
                            onPress={() => setFormOpen(true)}
                        >
                            <Pencil className="w-4 h-4" />
                            {t('debug.editSite')}
                        </Button>
                    </div>
                )}
                <ProfileCard />
                <InterestsCard />
                <SocialLinksCard />
                <div>
                    <TechStack />
                    <GolaList />
                </div>
                {IS_DEV && (
                    <DebugFormModal
                        type="site"
                        initialData={siteData as any}
                        isOpen={formOpen}
                        onOpenChange={(open) => { if (!open) setFormOpen(false); }}
                        onSave={handleSave}
                    />
                )}
            </div>
        </DefaultLayout>
    );
}

export default About;

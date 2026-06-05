import { Card, Chip } from '@heroui/react';
import { siteConfig } from '../../config/site';
import { useI18n } from '../../i18n';

function InterestsCard() {
    const { t } = useI18n();

    return (
        <Card className="bg-white/40 dark:bg-surface/50 backdrop-blur-sm mb-6 rounded-2xl w-full">
            <Card.Header>
                <Card.Title>{t('about.interests')}</Card.Title>
            </Card.Header>
            <Card.Content>
                <div className="flex flex-wrap gap-2">
                    {siteConfig.tags.map((tag) => (
                        <Chip key={tag} size="lg" variant="soft">
                            {tag}
                        </Chip>
                    ))}
                </div>
            </Card.Content>
        </Card>
    );
}

export default InterestsCard;

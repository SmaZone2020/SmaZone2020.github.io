import { Card } from '@heroui/react';
import { siteConfig } from '../../config/site';
import { useI18n } from '../../i18n';
import AdaptiveAvatar from '../../components/AdaptiveAvatar';

function ProfileCard() {
    const { t } = useI18n();

    return (
        <Card className="mb-6 rounded-2xl">
            <Card.Content className="p-6">
                <div className="flex flex-col items-center text-center">
                    <AdaptiveAvatar
                        src={siteConfig.avatar}
                        alt={siteConfig.author}
                        size="xl"
                        className="mb-4 shadow-lg"
                    />
                    <h1 className="text-2xl font-bold libre mb-1">{siteConfig.author}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {siteConfig.handle}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 max-w-md leading-relaxed">
                        {t('site.description')}
                    </p>
                </div>
            </Card.Content>
        </Card>
    );
}

export default ProfileCard;

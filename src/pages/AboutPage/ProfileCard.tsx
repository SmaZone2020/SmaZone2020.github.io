import { Card } from '@heroui/react';
import { siteConfig } from '../../config/site';
import { useI18n } from '../../i18n';
import AdaptiveAvatar from '../../components/AdaptiveAvatar';

function ProfileCard() {
    const { t } = useI18n();

    return (
        <Card className="mb-6 rounded-2xl">
            <Card.Content className="p-4">
                <div className="flex flex-row items-center text-left">
                    <AdaptiveAvatar
                        src={siteConfig.avatar}
                        alt={siteConfig.author}
                        size="lg"
                        className="mr-4"
                    />
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold libre mb-1">{siteConfig.author}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            {siteConfig.handle}
                        </p>
                    </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 max-w-md leading-relaxed">
                    {t('site.description')}
                </p>
            </Card.Content>
        </Card>
    );
}

export default ProfileCard;

import { Card } from '@heroui/react';
import { siteData } from '../../lib/data';
import { useI18n } from '../../i18n';
import AdaptiveAvatar from '../../components/AdaptiveAvatar';
import React from 'react';

function ProfileCard() {
    const { t } = useI18n();

    return (
        <Card className="bg-white/40 dark:bg-surface/50 backdrop-blur-sm mb-6 rounded-2xl">
            <Card.Content className="p-4">
                <div className="flex flex-row items-center text-left">
                    <AdaptiveAvatar
                        src={siteData.avatar}
                        alt={siteData.author}
                        size="lg"
                        className="mr-4"
                    />
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold libre mb-1">{siteData.author}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            {siteData.handle}
                        </p>
                    </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t('site.description').replace(/<br\/>/g, '\n').split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <br />}
                            {line}
                        </React.Fragment>
                    ))}
                </p>
            </Card.Content>
        </Card>
    );
}

export default ProfileCard;

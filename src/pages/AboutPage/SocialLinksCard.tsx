import { Card } from '@heroui/react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/site';
import { useI18n } from '../../i18n';
import { Comments, Envelope, Hand, LogoGithub, TvRetro } from '@gravity-ui/icons';

function SocialLinksCard() {
    const { t } = useI18n();

    return (
        <Card className="mb-6 rounded-2xl w-full">
            <Card.Header>
                <Card.Title>{t('about.socialLinks')}</Card.Title>
            </Card.Header>
            <Card.Content>
                <div className="flex items-center gap-4">
                    {siteConfig.social.github && (
                        <Link
                            to={siteConfig.social.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <LogoGithub className="w-5 h-5" />
                        </Link>
                    )}
                    {siteConfig.social.bili && (
                        <Link
                            to={siteConfig.social.bili}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <TvRetro className="w-5 h-5" />
                        </Link>
                    )}
                    {siteConfig.social.email && (
                        <Link
                            to={siteConfig.social.email}
                            className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <Envelope className="w-5 h-5" />
                        </Link>
                    )}
                    {siteConfig.social.bonjour && (
                        <Link
                            to={siteConfig.social.bonjour}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <Hand className="w-5 h-5 transform rotate-330" />
                        </Link>
                    )}
                    {siteConfig.social.wecom && (
                        <Link
                            to={siteConfig.social.wecom}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <Comments className="w-5 h-5" />
                        </Link>
                    )}
                </div>
            </Card.Content>
        </Card>
    );
}

export default SocialLinksCard;

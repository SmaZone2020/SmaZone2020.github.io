import { Button, Card, Tooltip } from '@heroui/react';
import { siteConfig } from '../../config/site';
import { useI18n } from '../../i18n';
import { Comments, Envelope, Hand, LogoGithub, TvRetro } from '@gravity-ui/icons';

function SocialLinksCard() {
    const { t } = useI18n();

    return (
        <Card className="bg-white/40 dark:bg-surface/50 backdrop-blur-sm mb-6 rounded-2xl w-full">
            <Card.Header>
                <Card.Title>{t('about.socialLinks')}</Card.Title>
            </Card.Header>
            <Card.Content>
                <div className="flex items-center gap-4">
                    {siteConfig.social.github && (
                        <Tooltip delay={0}>
                            <Button
                                isIconOnly
                                variant="tertiary"
                                onPress={() => window.open(siteConfig.social.github, '_blank')}
                            >
                                <LogoGithub className="w-5 h-5" />
                            </Button>
                            <Tooltip.Content>
                                <p>GitHub</p>
                            </Tooltip.Content>
                        </Tooltip>
                    )}
                    {siteConfig.social.bili && (
                        <Tooltip delay={0}>
                            <Button
                                isIconOnly
                                variant="tertiary"
                                onPress={() => window.open(siteConfig.social.bili, '_blank')}
                            >
                                <TvRetro className="w-5 h-5" />
                            </Button>
                            <Tooltip.Content>
                                <p>Bilibili</p>
                            </Tooltip.Content>
                        </Tooltip>
                    )}
                    {siteConfig.social.email && (
                        <Tooltip delay={0}>
                            <Button
                                isIconOnly
                                variant="tertiary"
                                onPress={() => window.location.href = siteConfig.social.email}
                            >
                                <Envelope className="w-5 h-5" />
                            </Button>
                            <Tooltip.Content>
                                <p>Email</p>
                            </Tooltip.Content>
                        </Tooltip>
                    )}
                    {siteConfig.social.bonjour && (
                        <Tooltip delay={0}>
                            <Button
                                isIconOnly
                                variant="tertiary"
                                onPress={() => window.open(siteConfig.social.bonjour, '_blank')}
                            >
                                <Hand className="w-5 h-5 transform rotate-330" />
                            </Button>
                            <Tooltip.Content>
                                <p>Bonjour</p>
                            </Tooltip.Content>
                        </Tooltip>
                    )}
                    {siteConfig.social.wecom && (
                        <Tooltip delay={0}>
                            <Button
                                isIconOnly
                                variant="tertiary"
                                onPress={() => window.open(siteConfig.social.wecom, '_blank')}
                            >
                                <Comments className="w-5 h-5" />
                            </Button>
                            <Tooltip.Content>
                                <p>WeChat</p>
                            </Tooltip.Content>
                        </Tooltip>
                    )}
                </div>
            </Card.Content>
        </Card>
    );
}

export default SocialLinksCard;

import { useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { useI18n } from '../../i18n';
import { setTitle } from '../../App';
import ProfileCard from './ProfileCard';
import InterestsCard from './InterestsCard';
import SocialLinksCard from './SocialLinksCard';

function About() {
    const { t } = useI18n();

    useEffect(() => {
        setTitle(t('nav.about'));
    }, [t]);

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 py-6 max-w-3xl">
                <ProfileCard />
                <InterestsCard />
                <SocialLinksCard />
            </div>
        </DefaultLayout>
    );
}

export default About;

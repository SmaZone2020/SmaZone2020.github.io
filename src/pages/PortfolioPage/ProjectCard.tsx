import { Card } from '@heroui/react';
import { LogoGithub, Globe, ArrowUpRightFromSquare, CirclePlay, TvRetro, CircleTree } from '@gravity-ui/icons';
import type { ProjectConfig } from '../../config/site';
import FadeImg from '../../components/FadeImg';

const platformIcon: Record<string, React.ReactNode> = {
    github: <LogoGithub className="w-4 h-4" />,
    web: <Globe className="w-4 h-4" />,
    douyin: <CirclePlay className="w-4 h-4" />,
    bilibili: <TvRetro className="w-4 h-4" />,
};

const platformLabel: Record<string, string> = {
    github: 'GitHub',
    web: 'Web',
    douyin: '抖音',
    bilibili: 'Bilibili',
};

interface ProjectCardProps {
    project: ProjectConfig;
}

function ProjectCard({ project }: ProjectCardProps) {
    return (
        <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
        >
            <Card className="h-full overflow-hidden rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className="h-40 overflow-hidden">
                    <FadeImg
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover rounded-none"
                        imgClassName="group-hover:scale-105 transition-transform duration-300"
                    />
                </div>

                <Card.Content className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-base line-clamp-1">
                            {project.title}
                        </h3>
                        <ArrowUpRightFromSquare className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                        {project.description}
                    </p>

                    <div className='flex items-center justify-between'>
                        <span className="flex items-center gap-1.5">
                            {platformIcon[project.platform] || <Globe className="w-4 h-4" />}
                            {platformLabel[project.platform] || project.platform}
                        </span>

                        {(project.platform === 'github') && (
                            <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-0.5">
                                <CircleTree className="w-4 h-4" />
                                {project.href?.split('/')[3]}/
                                {project.href?.split('/')[4]}
                            </span>
                        )}
                    </div>
                </Card.Content>
            </Card>
        </a>
    );
}

export default ProjectCard;


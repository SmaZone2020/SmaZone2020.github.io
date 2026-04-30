import FadeImg from './FadeImg';

interface AdaptiveAvatarProps {
    src: string;
    alt?: string;
    fallback?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeMap = {
    sm: 'w-11 h-11',
    md: 'w-14 h-14',
    lg: 'w-26 h-26',
    xl: 'w-34 h-34',
};

export default function AdaptiveAvatar({
    src,
    alt = '',
    fallback,
    size = 'md',
    className = '',
}: AdaptiveAvatarProps) {
    return (
        <div
            className={`${sizeMap[size]} rounded-[45px] overflow-hidden flex-shrink-0 ${className}`}
        >
            {src ? (
                <FadeImg
                    shimmer={false}
                    src={src}
                    alt={alt}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-lg">
                    {fallback || alt?.charAt(0) || '?'}
                </div>
            )}
        </div>
    );
}

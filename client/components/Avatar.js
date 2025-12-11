import Image from 'next/image';

const Avatar = ({ src, alt, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    return (
        <div className={`relative rounded-full overflow-hidden bg-gray-300 ${sizeClasses[size]} flex-shrink-0`}>
            {src ? (
                <Image
                    src={src}
                    alt={alt || 'User Avatar'}
                    fill
                    className="object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                    {alt ? alt.charAt(0).toUpperCase() : '?'}
                </div>
            )}
        </div>
    );
};

export default Avatar;

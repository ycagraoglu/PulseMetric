import Avatar from 'boring-avatars';
import { useEffect, useState } from 'react';

type AvatarVariant = 'marble' | 'beam' | 'pixel' | 'sunset' | 'ring' | 'bauhaus';

export function getGeneratedName(seed: string): string {
    if (!seed) {
        return 'Anonymous';
    }
    const numericSeed = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const adjectives = ['Swift', 'Bright', 'Calm', 'Deep', 'Epic', 'Fast', 'Grand', 'Hazy', 'Antique', 'Brave'];
    const firstNames = ['Phoenix', 'Falcon', 'Tiger', 'Alex', 'Jordan', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery'];

    const adjective = adjectives[numericSeed % adjectives.length];
    const firstName = firstNames[(numericSeed * 7) % firstNames.length];

    return `${adjective} ${firstName}`;
}

type UserAvatarProps = {
    seed: string;
    size?: number;
    variant?: AvatarVariant;
    colors?: string[];
};

export function UserAvatar({
    seed,
    size = 32,
    variant = 'marble',
    colors,
}: UserAvatarProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div
                style={{
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    backgroundColor: '#e5e7eb',
                }}
            />
        );
    }

    return (
        <Avatar
            colors={colors}
            name={seed || 'anonymous'}
            size={size}
            variant={variant}
        />
    );
}

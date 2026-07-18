import { House, TextAlignLeft, Archive, CircleInfo, Briefcase, Link } from "@gravity-ui/icons";
import { ComponentType, SVGProps } from "react";
import navJson from '../data/navigation.json';

export interface ProjectConfig {
    title: string;
    href: string;
    image: string;
    description: string;
    platform: 'github' | 'web' | 'douyin' | 'bilibili' | string;
}

export interface FriendLink {
    name: string;
    url: string;
    avatar?: string;
    description?: string;
}

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
    House, TextAlignLeft, Archive, CircleInfo, Briefcase, Link,
};

export const navItems = navJson.map(item => ({
    ...item,
    icon: iconMap[item.icon] || CircleInfo,
})) as {
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    label?: string;
    url: string;
    showInBottomNav?: boolean;
}[];

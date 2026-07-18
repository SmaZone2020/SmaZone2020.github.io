import { House, TextAlignLeft, Archive, CircleInfo, Briefcase, Link } from "@gravity-ui/icons";
import { ComponentType, SVGProps } from "react";

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

export const navItems: {
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    label?: string;
    url: string;
    showBottomNav?: boolean;
    showInBottomNav?: boolean;
}[] = [
    { icon: House, label: "Home", url: "/" },
    { icon: TextAlignLeft, label: "Blog", url: "/blog" },
    { icon: Briefcase, label: "Portfolio", url: "/portfolio" },
    { icon: Archive, label: "Archive", url: "/archive" },
    { icon: CircleInfo, label: "About", url: "/about", showInBottomNav: false },
    { icon: Link, label: "Friends", url: "/friends" },
];

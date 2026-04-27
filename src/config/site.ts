import { House, TextAlignLeft, Archive, CircleInfo, Briefcase } from "@gravity-ui/icons";
import { ComponentType, SVGProps } from "react";

export interface ProjectConfig {
    title: string;
    href: string;
    image: string;
    description: string;
    platform: 'github' | 'web' | 'douyin' | 'bilibili' | string;
}

export const siteConfig = {
    name: "Sma.Zone",
    title: "Sma.Zone",
    author: "Maxwell Ma",
    email: "smazone@yuxiit.cn",
    siteUrl: "sma.zone",
    handle: "@Maxwell·Ma",
    avatar: "/avatar.jpg",
    heroImage: "/bg1.jpg",
    tags: [".NET", "TypeScript", "PM", "摄影", "骑行", "音乐", "旅游"],
    social: {
        github: "https://github.com/SmaZone2020",
        bili: "https://space.bilibili.com/523293679",
        email: "mailto:smazone@yuxiit.cn",
        bonjour: "https://bonjour.bio/8tozg1",
        wecom: "https://work.weixin.qq.com/ca/cawcde19a5eede7ba5",
    },
    goals:[
        { name: "事业", description: "拿到首次融资(Seed轮)", isOk: false },
        { name: "骑行", description: "单次骑行100KM以上", isOk: true },
        { name: "摄影", description: "拍摄高质量照片", isOk: true },
    ],
    tech: [
        { name: "C#", proficiency: 90, color: "default" },
        { name: "TypeScript/JS", proficiency: 85, color: "accent" },
        { name: "React", proficiency: 80, color: "success" },
        { name: "Java", proficiency: 40, color: "warning" },
        { name: "C++", proficiency: 35, color: "danger" },
    ] as { name: string; proficiency: number; color: "default" | "accent" | "success" | "warning" | "danger" | undefined }[],
    projects: [
        {
            title: "VirgoBot",
            platform: "github",
            href: "https://github.com/Yuxi-IT/VirgoBot",
            image: "/images/75018f3ea271fec03664b2fb9748333b.webp",
            description: "基于 .NET 的AI Agent框架, 可通过Telegram、Douyin、WeChat等平台交互",
        },
        {
            title: "iLink4NET",
            platform: "github",
            href: "https://github.com/Yuxi-IT/iLink4NET",
            image: "/images/951d3885-6690-438d-bf52-ad8728f301e3.webp",
            description: "基于.NET平台的iLinkBot SDK, 支持多平台接入和丰富的功能扩展",
        },
        {
            title: "Libra",
            platform: "github",
            href: "https://github.com/SmaZone2020/Libra",
            image: "/images/eff71c4a-1b55-4064-bc59-5fe8e9db0107.webp",
            description: ".NET + React 打造的轻量远程控制框架, 可通过Web端面板管理Windows设备",
        },
        {
            title: "QwenApi",
            platform: "github",
            href: "https://github.com/SmaZone2020/QwenApi",
            image: "/images/622bf149-2320-4d0d-9fa0-d96b0d981810.webp",
            description: "Qwen 网页版部分 API 封装库",
        },
        {
            title: "HeroUI4Blazor",
            platform: "github",
            href: "https://github.com/Yuxi-IT/HeroUI4Blazor",
            image: "/images/ah89a3f-3hfa-f92f-h8a9-ah9fh923h8f9sh.webp",
            description: "HeroUI 的 Blazor 移植组件库",
        },
    ] as ProjectConfig[],
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
];

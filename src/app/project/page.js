'use client'
import React, { useState } from 'react';
import { Heart, ExternalLink } from 'lucide-react';

const ProjectCard = ({ project }) => {
    const [liked, setLiked] = useState(project.liked);
    const [likeCount, setLikeCount] = useState(project.likeCount);

    const handleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (liked) {
            setLikeCount(prev => prev - 1);
        } else {
            setLikeCount(prev => prev + 1);
        }
        setLiked(!liked);
    };

    return (
        <div className="relative bg-white dark:bg-[#1e1e2e] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
            {/* 图片区域 */}
            <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-900">
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                {/* 悬停遮罩 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                {/* 源码标签 */}
                <a
                    href={project.sourceUrl}
                    className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-black/50 backdrop-blur-sm text-white rounded group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-600"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    源码
                </a>
            </div>

            {/* 内容区域 */}
            <div className="p-5">
                <h3 onClick={() => window.open(project.link, '_blank', 'noopener,noreferrer')} className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2 cursor-pointer">
                    {project.title}
                    <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                    {project.description}
                </p>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                        <div
                            key={index}
                            className="group relative px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-700"
                        >
                            {tag}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                          px-2 py-1 text-xs text-white bg-gray-900 dark:bg-black
                          rounded opacity-0 group-hover:opacity-100 
                          transition-opacity duration-200 whitespace-nowrap
                          pointer-events-none z-10 shadow-lg">
                                {project.caption}
                                {/* 小三角箭头 */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 
                              border-4 border-transparent border-t-gray-900 
                              dark:border-t-black" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* 底部操作栏 */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1.5 text-sm transition-colors ${liked
                            ? 'text-red-500'
                            : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                            }`}
                    >
                        <Heart
                            className={`w-4 h-4 transition-all ${liked ? 'fill-current scale-110' : ''}`}
                        />
                        <span>{likeCount}</span>
                    </button>

                    <span className="text-xs text-gray-400 dark:text-gray-500">
                        {project.date}
                    </span>
                </div>
            </div>
        </div>
    );
};

const ProjectsPage = () => {
    const projects = [
        {
            id: 1,
            title: 'charlie_blog',
            description: '🦖 charlie的个人博客',
            image: '/charlie_blog.jpg',
            sourceUrl: 'https://github.com/ugjjffu/blog',
            link: "https://htb-three.vercel.app/",
            tags: ['喜爱', '开源', '设计'],
            caption: "测试caption",
            liked: true,
            likeCount: 128,
            date: '2023'
        },
        {
            id: 2,
            title: '订票网站',
            description: '基于 Babel 对 JavaScript 混淆代码还原的工具',
            image: '/ticket_booker.jpg',
            sourceUrl: 'https://github.com/ugjjffu/htb',
            link: "https://htb-three.vercel.app/",
            tags: ['喜爱', '开源'],
            caption: "测试caption",
            liked: false,
            likeCount: 256,
            date: '2023'
        },
        {
            id: 3,
            title: 'offical website',
            description: 'official website of vertex studio',
            image: '/official_website.png',
            sourceUrl: 'https://github.com/ugjjffu/official_website',
            link: "https://vertex-studio-psi.vercel.app/",
            tags: ['喜爱', '开源'],
            caption: "测试caption",
            liked: false,
            likeCount: 256,
            date: '2023'
        },
    ];

    return (
        <div style={{ backgroundColor: "#f5f0eb" }} className="min-h-screen bg-gray-50 dark:bg-[#0f0f1a] transition-colors duration-300">
            {/* 主容器 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* 标题区域 */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                        项目
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        学而无用，不如学而用之。这里是我在技术领域中努力实践和应用的最佳证明。
                    </p>
                    <div className="mt-4 w-24 h-1 bg-blue-500 mx-auto rounded-full opacity-80" />
                </div>

                {/* 分类标题 - 网站 */}
                <div className="mb-8 w-full flex items-center justify-center">
                    <div className="flex text-2xl font-bold text-gray-900 dark:text-white gap-2">
                        <span className="text-2xl">🖥️</span>
                        <span>网站</span>
                    </div>
                </div>

                {/* 项目网格 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {projects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>

                {/* 分类标题 - 应用 */}
                {/* <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="text-2xl">📱</span>
                        <span>应用</span>
                    </h2>
                    <div className="mt-2 h-0.5 w-full bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent" />
                </div> */}

                {/* 第二行项目（示例） */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.slice(0, 3).map(project => (
                        <ProjectCard
                            key={`second-${project.id}`}
                            project={{ ...project, id: `second-${project.id}` }}
                        />
                    ))}
                </div> */}
            </div>
        </div>
    );
};

export default ProjectsPage;
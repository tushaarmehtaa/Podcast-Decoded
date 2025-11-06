import React, { useState, useEffect } from 'react';
import { PodcastDecodedLogo, SearchIcon, MenuIcon, CloseIcon } from './icons';

const NavLink: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} className="text-gray-600 hover:text-primary transition-colors duration-200">
        {children}
    </a>
);

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Browse', href: '#' },
        { name: 'Trending', href: '#' },
        { name: 'Request', href: '#' },
    ];

    return (
        <header className={`sticky top-0 z-50 transition-shadow duration-300 ${isScrolled || isMenuOpen ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-white'}`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-8">
                        <a href="#" aria-label="Homepage">
                            <PodcastDecodedLogo />
                        </a>
                        <nav className="hidden md:flex items-center gap-6">
                            {navItems.map(item => <NavLink key={item.name} href={item.href}>{item.name}</NavLink>)}
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:text-primary">
                            <SearchIcon className="w-5 h-5" />
                        </button>
                         <a href="#" className="hidden sm:block px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-md hover:bg-purple-700 transition-all duration-300">
                            Newsletter Signup
                        </a>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2" aria-label="Toggle menu">
                            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden bg-white pb-6 px-4 border-b border-gray-200">
                    <nav className="flex flex-col gap-4 pt-4">
                       {navItems.map(item => <NavLink key={item.name} href={item.href}>{item.name}</NavLink>)}
                    </nav>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <a href="#" className="block w-full text-center px-6 py-3 text-md font-semibold text-white bg-primary rounded-md hover:bg-purple-700 transition-all duration-300">
                            Newsletter Signup
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;

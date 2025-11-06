import React from 'react';
import { PodcastDecodedLogo, TwitterIcon, LinkedInIcon, GitHubIcon, RssIcon } from './icons';

const FooterLink: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} className="text-gray-500 hover:text-primary transition-colors">{children}</a>
);

interface SocialLinkProps {
    href: string;
    children: React.ReactNode;
}

// FIX: Changed SocialLink to be an explicitly typed React.FC to potentially resolve a type inference issue with children props.
const SocialLink: React.FC<SocialLinkProps> = ({ href, children }) => (
    <a href={href} className="text-gray-400 hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
        {children}
    </a>
);


const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-2">
            <PodcastDecodedLogo />
            <p className="mt-4 text-gray-600 max-w-sm">Key insights from the world's best podcasts, curated and summarized for you.</p>
          </div>
          
          <div className="md:col-start-1 lg:col-start-3">
            <h4 className="font-semibold text-richblack">Platform</h4>
            <ul className="mt-4 space-y-3">
                <li><FooterLink href="#">Browse</FooterLink></li>
                <li><FooterLink href="#">Trending</FooterLink></li>
                <li><FooterLink href="#">Request a Podcast</FooterLink></li>
                <li><FooterLink href="#">Search</FooterLink></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-richblack">Project</h4>
            <ul className="mt-4 space-y-3">
                <li><FooterLink href="#">About</FooterLink></li>
                <li><FooterLink href="#">Newsletter Archive</FooterLink></li>
                <li><FooterLink href="#">RSS Feed</FooterLink></li>
                <li><FooterLink href="#">Contact</FooterLink></li>
            </ul>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Podcast Decoded. All rights reserved.</p>
          <div className="flex gap-5 mt-4 sm:mt-0">
            <SocialLink href="#"><RssIcon className="w-5 h-5"/></SocialLink>
            <SocialLink href="#"><TwitterIcon className="w-5 h-5"/></SocialLink>
            <SocialLink href="#"><LinkedInIcon className="w-5 h-5"/></SocialLink>
            <SocialLink href="#"><GitHubIcon className="w-5 h-5"/></SocialLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
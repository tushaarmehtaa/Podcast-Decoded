import React from 'react';
import { Link } from 'react-router-dom';
import { PodcastDecodedLogo, TwitterIcon, LinkedInIcon, GitHubIcon, RssIcon } from './icons';

const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link to={to} className="text-gray-500 hover:text-primary transition-colors">
    {children}
  </Link>
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
                <li><FooterLink to="/browse">Browse</FooterLink></li>
                <li><FooterLink to="/browse?sort=trending">Trending</FooterLink></li>
                <li><FooterLink to="/request">Request a Podcast</FooterLink></li>
                <li><FooterLink to="/browse?view=search">Search</FooterLink></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-richblack">Project</h4>
            <ul className="mt-4 space-y-3">
                <li><FooterLink to="/">About</FooterLink></li>
                <li><FooterLink to="/browse">Newsletter Archive</FooterLink></li>
                <li><FooterLink to="/browse">RSS Feed</FooterLink></li>
                <li><FooterLink to="/request">Contact</FooterLink></li>
            </ul>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Podcast Decoded. All rights reserved.</p>
          <div className="flex gap-5 mt-4 sm:mt-0">
            <SocialLink href="https://podcastdecoded.example/rss"><RssIcon className="w-5 h-5"/></SocialLink>
            <SocialLink href="https://twitter.com"><TwitterIcon className="w-5 h-5"/></SocialLink>
            <SocialLink href="https://www.linkedin.com"><LinkedInIcon className="w-5 h-5"/></SocialLink>
            <SocialLink href="https://github.com"><GitHubIcon className="w-5 h-5"/></SocialLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

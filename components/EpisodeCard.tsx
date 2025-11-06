import React from 'react';
import type { Episode } from '../types';

interface EpisodeCardProps {
  episode: Episode;
  className?: string;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, className }) => {
  return (
    <article className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 p-6 cursor-pointer border border-gray-100 overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-secondary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" aria-hidden="true"></div>
      
      <div className="relative z-10 flex gap-4">
        <img src={episode.imageUrl} alt={episode.episodeTitle} className="w-20 h-20 rounded-xl object-cover shadow-md" loading="lazy" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-primary uppercase tracking-wider truncate">{episode.podcastTitle}</p>
          <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors mt-1 text-lg">
            <a href="#" className="stretched-link">{episode.episodeTitle}</a>
          </h3>
          <p className="text-sm text-gray-600 mt-2 flex items-center gap-3">
            <span>{episode.guestName}</span>
            <span className="text-gray-400">•</span>
            <span title={`Original duration: ${episode.duration}`}>{episode.readTime}</span>
          </p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 relative z-10">
        <p className="text-sm text-gray-700 line-clamp-2">
          {episode.quotePreview}
        </p>
        <div className="flex gap-2 mt-3">
          {episode.tags.slice(0, 2).map(tag => (
            <span key={tag} className="px-2.5 py-1 bg-purple-50 text-primary text-xs font-medium rounded-full">{tag}</span>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" aria-hidden="true"></div>
    </article>
  );
};

import React from 'react';
import { EpisodeCard } from './EpisodeCard';
import type { Episode } from '../types';

const mockEpisodes: Episode[] = [
  { id: 2, podcastTitle: 'Acquired', episodeTitle: 'The Complete History of NVIDIA', guestName: 'Ben & David', duration: '4h 30m', durationSaved: '4h 18m', date: 'Nov 5, 2024', imageUrl: 'https://picsum.photos/seed/ep2/400', tags: ['Technology', 'Business'], summary: 'Exploring the story of NVIDIA from its founding to becoming an AI powerhouse.', quotePreview: '"The secret to happiness is not in seeking more, but in developing the capacity to enjoy less..."', readTime: '12 min read' },
  { id: 3, podcastTitle: 'Lex Fridman Podcast', episodeTitle: 'Sam Altman: OpenAI and the Future of AI', guestName: 'Sam Altman', duration: '3h 5m', durationSaved: '2h 56m', date: 'Nov 3, 2024', imageUrl: 'https://picsum.photos/seed/ep3/400', tags: ['AI', 'Future'], summary: 'A conversation about the development of AGI, ethics, and the vision for OpenAI.', quotePreview: '"The most important thing is to be a learning machine. That\'s the key to long-term success."', readTime: '9 min read' },
  { id: 4, podcastTitle: 'Huberman Lab', episodeTitle: 'The Science of Setting & Achieving Goals', guestName: 'Andrew Huberman', duration: '2h 45m', durationSaved: '2h 34m', date: 'Nov 1, 2024', imageUrl: 'https://picsum.photos/seed/ep4/400', tags: ['Science', 'Productivity'], summary: 'Neuroscience-backed protocols for effective goal setting and motivation.', quotePreview: '"Your nervous system is built for action. It wants to move and engage with the world."', readTime: '11 min read' },
  { id: 7, podcastTitle: 'The Tim Ferriss Show', episodeTitle: 'Dr. Peter Attia: The Science of Longevity', guestName: 'Peter Attia', duration: '3h 10m', durationSaved: '3h', date: 'Nov 4, 2024', imageUrl: 'https://picsum.photos/seed/pop1/400', tags: ['Health', 'Longevity'], summary: 'A deep dive into the frameworks and tactics for extending lifespan and healthspan.', quotePreview: '"The three pillars of health are sleep, nutrition, and exercise. You can\'t out-train a bad diet."', readTime: '10 min read' },
  { id: 8, podcastTitle: 'My First Million', episodeTitle: 'How to Build a $100M Company with No-Code', guestName: 'Sahil Lavingia', duration: '1h 5m', durationSaved: '59m', date: 'Nov 2, 2024', imageUrl: 'https://picsum.photos/seed/pop2/400', tags: ['Startup', 'Business'], summary: 'The story of Gumroad and the principles of building a profitable, sustainable business.', quotePreview: '"Don\'t be afraid to charge for your work. Your time and expertise are valuable."', readTime: '6 min read' },
  { id: 9, podcastTitle: 'Invest Like the Best', episodeTitle: 'The Art of Venture Capital', guestName: 'Bill Gurley', duration: '1h 45m', durationSaved: '1h 38m', date: 'Oct 29, 2024', imageUrl: 'https://picsum.photos/seed/pop3/400', tags: ['Investing', 'VC'], summary: 'Legendary VC Bill Gurley shares his insights on what makes a great investment and founder.', quotePreview: '"The best founders are missionaries, not mercenaries. They are driven by a deep sense of purpose."', readTime: '7 min read' },
];


const RecentEpisodes: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-richblack">Recent Episodes</h2>
            <a href="#" className="font-semibold text-primary hover:text-purple-700 transition-colors group flex items-center gap-1">
              View All <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
        </div>
        
        <div className="flex overflow-x-auto space-x-8 pb-8 -mx-4 px-4 scrollbar-hide">
          {mockEpisodes.map((ep, index) => (
            <div key={ep.id} className="flex-shrink-0 w-[360px] animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <EpisodeCard episode={ep} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentEpisodes;

import React from 'react';
import { Link } from 'react-router-dom';
import type { Episode, Topic, RequestedPodcast } from '../types';

// FIX: Added missing durationSaved and quotePreview properties to episodes to match the Episode type.
const mockPopularEpisodes: Episode[] = [
  { id: '7', podcastTitle: 'The Tim Ferriss Show', episodeTitle: 'Dr. Peter Attia: The Science of Longevity', guestName: 'Peter Attia', duration: '3h 10m', durationSaved: '3h', date: 'Nov 4, 2024', imageUrl: 'https://picsum.photos/seed/pop1/200', tags: ['Health', 'Longevity'], summary: '', quotePreview: '"The three pillars of health are sleep, nutrition, and exercise. You can\'t out-train a bad diet."', readTime: '10 min read' },
  { id: '8', podcastTitle: 'My First Million', episodeTitle: 'How to Build a $100M Company with No-Code', guestName: 'Sahil Lavingia', duration: '1h 5m', durationSaved: '59m', date: 'Nov 2, 2024', imageUrl: 'https://picsum.photos/seed/pop2/200', tags: ['Startup', 'Business'], summary: '', quotePreview: '"Don\'t be afraid to charge for your work. Your time and expertise are valuable."', readTime: '6 min read' },
  { id: '2', podcastTitle: 'Acquired', episodeTitle: 'The Complete History of NVIDIA', guestName: 'Ben & David', duration: '4h 30m', durationSaved: '4h 18m', date: 'Nov 5, 2024', imageUrl: 'https://picsum.photos/seed/ep2/200', tags: ['Technology', 'Business'], summary: '', quotePreview: '"The secret to happiness is not in seeking more, but in developing the capacity to enjoy less..."', readTime: '12 min read' },
  { id: '3', podcastTitle: 'Lex Fridman Podcast', episodeTitle: 'Sam Altman: OpenAI and the Future of AI', guestName: 'Sam Altman', duration: '3h 5m', durationSaved: '2h 56m', date: 'Nov 3, 2024', imageUrl: 'https://picsum.photos/seed/ep3/200', tags: ['AI', 'Future'], summary: '', quotePreview: '"The most important thing is to be a learning machine. That\'s the key to long-term success."', readTime: '9 min read' },
  { id: '9', podcastTitle: 'Invest Like the Best', episodeTitle: 'The Art of Venture Capital', guestName: 'Bill Gurley', duration: '1h 45m', durationSaved: '1h 38m', date: 'Oct 29, 2024', imageUrl: 'https://picsum.photos/seed/pop3/200', tags: ['Investing', 'VC'], summary: '', quotePreview: '"The best founders are missionaries, not mercenaries. They are driven by a deep sense of purpose."', readTime: '7 min read' },
  { id: '10', podcastTitle: 'The Prof G Pod', episodeTitle: 'The State of Higher Education and Gen Z', guestName: 'Scott Galloway', duration: '55m', durationSaved: '50m', date: 'Oct 27, 2024', imageUrl: 'https://picsum.photos/seed/pop4/200', tags: ['Culture', 'Education'], summary: '', quotePreview: '"Gen Z is the most educated and most anxious generation in history."', readTime: '5 min read' },
];

const trendingTopics: Topic[] = [
    {id: 1, name: 'Artificial Intelligence', count: 124},
    {id: 2, name: 'Longevity & Healthspan', count: 98},
    {id: 3, name: 'Venture Capital', count: 77},
    {id: 4, name: 'Geopolitics', count: 62},
    {id: 5, name: 'Creator Economy', count: 51},
];

const requestedPodcasts: RequestedPodcast[] = [
    {id: 1, title: 'Founders', imageUrl: 'https://picsum.photos/seed/req1/100', upvotes: 402},
    {id: 2, title: 'The Diary of a CEO', imageUrl: 'https://picsum.photos/seed/req2/100', upvotes: 359},
];

const PopularEpisodeCard: React.FC<{episode: Episode}> = ({episode}) => (
    <Link
      to={`/episode/${episode.id}`}
      className="group flex gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-shadow duration-200"
    >
      <img src={episode.imageUrl} alt={episode.episodeTitle} className="w-16 h-16 rounded-md object-cover flex-shrink-0" loading="lazy" />
      <div className="min-w-0">
        <h4 className="font-semibold text-richblack line-clamp-2 group-hover:text-primary-600">
          {episode.episodeTitle}
        </h4>
        <p className="text-sm text-gray-500 mt-1">{episode.podcastTitle}</p>
      </div>
    </Link>
);

const PopularThisWeek: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-stone-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <span className="text-primary-600 font-semibold">WHAT'S HOT</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-richblack mt-2">Popular This Week</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockPopularEpisodes.map(ep => <PopularEpisodeCard key={ep.id} episode={ep} />)}
          </div>
          
          <aside className="lg:col-span-1 space-y-8">
            <div>
                <h3 className="text-xl font-bold font-display text-richblack">Trending Topics</h3>
                <ul className="mt-4 space-y-3">
                    {trendingTopics.map((topic, index) => (
                        <li key={topic.id} className="flex items-center justify-between text-gray-700">
                           <Link to={`/category/${encodeURIComponent(topic.name.toLowerCase().replace(/\s+/g, '-'))}`} className="hover:text-primary-600 transition-colors"> <span className="mr-2 text-gray-400">{index + 1}.</span>{topic.name}</Link>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">{topic.count}</span>
                        </li>
                    ))}
                </ul>
            </div>
             <div>
                <h3 className="text-xl font-bold font-display text-richblack">Most Requested</h3>
                <div className="mt-4 space-y-4">
                    {requestedPodcasts.map(podcast => (
                        <div key={podcast.id} className="flex items-center gap-4">
                            <img src={podcast.imageUrl} alt={podcast.title} className="w-12 h-12 rounded-md object-cover" loading="lazy"/>
                            <div>
                                <h4 className="font-semibold text-richblack">{podcast.title}</h4>
                                <p className="text-sm text-gray-500">{podcast.upvotes} upvotes</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default PopularThisWeek;

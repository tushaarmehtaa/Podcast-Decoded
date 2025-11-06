import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EpisodeCard } from './EpisodeCard';
import type { EpisodeSummary } from '@/lib/api';
import { getRecentEpisodes } from '@/lib/api';

const RecentEpisodes: React.FC = () => {
  const [episodes, setEpisodes] = useState<EpisodeSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEpisodes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getRecentEpisodes(6);
      setEpisodes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recent episodes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadEpisodes();
  }, []);

  const skeletonCards = Array.from({ length: 4 }).map((_, index) => (
    <div
      key={index}
      className="flex-shrink-0 w-[360px] animate-pulse bg-white rounded-2xl border border-gray-100 p-6"
    >
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-3">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="mt-6 space-y-2">
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-2/3 bg-gray-200 rounded" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
      </div>
    </div>
  ));

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-richblack">
            Recent Episodes
          </h2>
          <Link
            to="/browse"
            className="font-semibold text-primary hover:text-purple-700 transition-colors group flex items-center gap-1"
          >
            View All <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="flex overflow-x-auto space-x-8 pb-8 -mx-4 px-4 scrollbar-hide">
          {isLoading && skeletonCards}
          {!isLoading &&
            !error &&
            episodes.map((ep, index) => (
              <div
                key={ep.id}
                className="flex-shrink-0 w-[360px] animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <EpisodeCard episode={ep} />
              </div>
            ))}
          {!isLoading && !error && episodes.length === 0 && (
            <div className="text-gray-500">No episodes available yet. Check back soon!</div>
          )}
        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
            <p className="font-semibold">We couldn&apos;t load the latest episodes.</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={loadEpisodes}
              className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentEpisodes;

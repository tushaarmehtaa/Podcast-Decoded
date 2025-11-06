import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EpisodeCard } from '../components/EpisodeCard';
import type { EpisodeSummary, CategorySummary } from '@/lib/api';
import { getCategories, getEpisodesByCategory } from '@/lib/api';

const EPISODES_PER_PAGE = 12;

const slugify = (name: string) => encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'));

const CategoryPage: React.FC = () => {
  const { category: categoryParam } = useParams();
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMore = useMemo(
    () => (page + 1) * EPISODES_PER_PAGE < total,
    [page, total]
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };

    void loadCategories();
  }, []);

  useEffect(() => {
    if (!categoryParam) return;
    const decoded = decodeURIComponent(categoryParam);
    const match = categories.find((item) => slugify(item.name) === decoded);
    if (match) {
      setCategoryName(match.name);
    } else if (categories.length > 0) {
      setCategoryName(null);
      setError('Category not found.');
    }
  }, [categories, categoryParam]);

  useEffect(() => {
    const loadEpisodes = async () => {
      if (!categoryName) return;
      try {
        setIsLoading(true);
        setError(null);
        const { episodes: data, total: count } = await getEpisodesByCategory(
          categoryName,
          EPISODES_PER_PAGE,
          0
        );
        setEpisodes(data);
        setTotal(count);
        setPage(0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load category.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadEpisodes();
  }, [categoryName]);

  const loadMore = async () => {
    if (!categoryName) return;
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const { episodes: data } = await getEpisodesByCategory(
        categoryName,
        EPISODES_PER_PAGE,
        nextPage * EPISODES_PER_PAGE
      );
      setEpisodes((prev) => [...prev, ...data]);
      setPage(nextPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more episodes.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const displayName = categoryName ?? (categoryParam ? decodeURIComponent(categoryParam) : '');
  const formattedDisplayName = displayName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <section className="container mx-auto px-4 py-16">
      <header className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">Category</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-display font-bold text-richblack">
          {formattedDisplayName}
        </h1>
        <p className="mt-4 text-gray-600">
          Curated episodes focused on {formattedDisplayName.toLowerCase()}.
        </p>
      </header>

      {error && (
        <div className="mt-10 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          <p className="font-semibold">We couldn&apos;t load this category.</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-64 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-pulse"
            >
              <div className="flex gap-4">
                <div className="h-20 w-20 rounded-xl bg-gray-200" />
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
          ))}

        {!isLoading &&
          episodes.map((episode) => <EpisodeCard key={episode.id} episode={episode} />)}
      </div>

      {!isLoading && episodes.length === 0 && !error && (
        <div className="mt-12 rounded-xl border border-gray-200 bg-white px-6 py-10 text-center text-gray-500">
          No episodes have been decoded for this category yet.
        </div>
      )}

      {hasMore && !error && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-richblack shadow-sm transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </section>
  );
};

export default CategoryPage;

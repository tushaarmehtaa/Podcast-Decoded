import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EpisodeCard } from '../components/EpisodeCard';
import type { EpisodeSummary, CategorySummary } from '@/lib/api';
import { getAllEpisodes, getCategories } from '@/lib/api';

const EPISODES_PER_PAGE = 12;

const BrowsePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [episodes, setEpisodes] = useState<EpisodeSummary[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(searchParams.get('q') ?? '');

  const sort = (searchParams.get('sort') as 'recent' | 'popular') ?? 'recent';
  const categoryParam = searchParams.get('category') ?? '';
  const searchQuery = searchParams.get('q') ?? '';

  const hasMore = useMemo(
    () => (page + 1) * EPISODES_PER_PAGE < total,
    [page, total]
  );

  const updateSearchParams = (next: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  const loadEpisodes = async (pageNumber: number, replace = false) => {
    try {
      if (replace) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);
      const { episodes: data, total: count } = await getAllEpisodes({
        sort,
        category: categoryParam || undefined,
        search: searchQuery || undefined,
        limit: EPISODES_PER_PAGE,
        offset: pageNumber * EPISODES_PER_PAGE,
      });
      setEpisodes((prev) => (replace ? data : [...prev, ...data]));
      setTotal(count);
      setPage(pageNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load episodes.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    void loadEpisodes(page + 1);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateSearchParams({ sort: event.target.value, category: categoryParam || undefined });
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    updateSearchParams({ category: value || undefined });
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateSearchParams({ q: searchValue || undefined });
  };

  useEffect(() => {
    void loadEpisodes(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, categoryParam, searchQuery]);

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

  return (
    <section className="container mx-auto px-4 py-16">
      <header className="max-w-3xl space-y-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-richblack">
            Browse Episodes
          </h1>
          <p className="mt-2 text-gray-600">
            Explore every decoded episode. Filter by category, sort by what&apos;s fresh or popular,
            and search by guest, show, or topic.
          </p>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6"
        >
          <div className="flex-1">
            <label htmlFor="episode-search" className="sr-only">
              Search episodes
            </label>
            <input
              id="episode-search"
              type="search"
              placeholder="Search by guest, show, or keyword"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Search
          </button>
        </form>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          <label className="flex items-center gap-3 text-sm text-gray-600">
            Sort
            <select
              value={sort}
              onChange={handleSortChange}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="recent">Most recent</option>
              <option value="popular">Most popular</option>
            </select>
          </label>

          <label className="flex items-center gap-3 text-sm text-gray-600">
            Category
            <select
              value={categoryParam}
              onChange={handleCategoryChange}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </label>

          <span className="text-sm text-gray-500">
            Showing {episodes.length} of {total} episodes
          </span>
        </div>
      </header>

      {error && (
        <div className="mt-10 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          <p className="font-semibold">We couldn&apos;t fetch the episodes.</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={() => void loadEpisodes(0, true)}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Try again
          </button>
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
          No episodes match your filters yet. Try adjusting the search or category.
        </div>
      )}

      {hasMore && !error && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleLoadMore}
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

export default BrowsePage;

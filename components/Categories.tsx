import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { CategorySummary } from '@/lib/api';
import { getCategories } from '@/lib/api';

const gradients = [
  'from-blue-400 to-cyan-400',
  'from-purple-500 to-indigo-500',
  'from-green-400 to-emerald-500',
  'from-yellow-400 to-amber-500',
  'from-rose-400 to-pink-500',
  'from-orange-400 to-red-500',
  'from-slate-500 to-slate-700',
  'from-teal-400 to-teal-600',
];

const slugify = (name: string) => encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'));

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const enrichedCategories = useMemo(
    () =>
      categories.map((category, index) => ({
        ...category,
        gradient: gradients[index % gradients.length],
      })),
    [categories]
  );

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-richblack">
          Explore by Category
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Dive into topics that matter to you. Find curated summaries in everything from AI to
          longevity.
        </p>

        {error && (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
            <p className="font-semibold">We hit a snag loading categories.</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={loadCategories}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Try again
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-12">
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-xl bg-white p-6 border border-gray-100 text-left"
              >
                <div className="h-5 w-24 bg-gray-200 rounded" />
                <div className="mt-3 h-4 w-16 bg-gray-200 rounded" />
              </div>
            ))}

          {!isLoading &&
            !error &&
            enrichedCategories.map((category, index) => (
              <div
                key={category.name}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <Link
                  to={`/category/${slugify(category.name)}`}
                  className="group relative block p-6 rounded-xl bg-gradient-to-br transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden text-white"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.gradient} transition-opacity duration-300 group-hover:opacity-90`}
                  ></div>
                  <div className="relative text-left">
                    <h3 className="font-bold text-xl capitalize">{category.name}</h3>
                    <p className="text-sm opacity-80 mt-1">{category.count} episodes</p>
                  </div>
                </Link>
              </div>
            ))}

          {!isLoading && !error && enrichedCategories.length === 0 && (
            <div className="col-span-full text-gray-500">
              No categories yet. Create a request to kick things off!
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Categories;

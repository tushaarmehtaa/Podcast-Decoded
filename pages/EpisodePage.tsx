import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EpisodeCard } from '../components/EpisodeCard';
import type { EpisodeSummary } from '@/lib/api';
import { getEpisodeById, getEpisodesByCategory } from '@/lib/api';

const EpisodePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [episode, setEpisode] = useState<EpisodeSummary | null>(null);
  const [related, setRelated] = useState<EpisodeSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await getEpisodeById(id);
        if (!data) {
          setError('Episode not found.');
          return;
        }
        setEpisode(data);

        if (data.categories.length > 0) {
          const { episodes } = await getEpisodesByCategory(data.categories[0], 4);
          setRelated(episodes.filter((item) => item.id !== data.id).slice(0, 3));
        } else {
          setRelated([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load this episode.');
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const formattedDuration = useMemo(() => {
    if (!episode?.durationMinutes) return null;
    const minutes = episode.durationMinutes;
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    if (hours === 0) return `${minutes} minutes`;
    if (remainder === 0) return `${hours} hours`;
    return `${hours}h ${remainder}m`;
  }, [episode]);

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-4 w-full animate-pulse rounded bg-gray-200" />
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-4 w-full animate-pulse rounded bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-red-600">
          <h1 className="text-2xl font-display font-bold">Episode unavailable</h1>
          <p className="mt-3 text-sm text-red-500">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Go back
          </button>
        </div>
      </section>
    );
  }

  if (!episode) {
    return null;
  }

  const heroBackground =
    episode.artworkUrl ??
    `https://picsum.photos/seed/${episode.id}/1200/400`;

  return (
    <article>
      <div className="relative bg-richblack text-white">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(30, 27, 75, 0.8), rgba(15, 23, 42, 0.95)), url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            ← Back
          </button>
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-100">
              {episode.podcastName}
            </p>
            <h1 className="text-3xl font-display font-bold md:text-5xl">{episode.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
              {episode.guestName && <span>Guest: {episode.guestName}</span>}
              {formattedDuration && <span>• {formattedDuration}</span>}
              {episode.readTimeMinutes ? (
                <span>• {episode.readTimeMinutes} min read</span>
              ) : null}
              {episode.episodeDate && (
                <span>
                  • Published {new Date(episode.episodeDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {episode.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest"
                >
                  {category}
                </span>
              ))}
            </div>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-richblack transition hover:bg-slate-100"
            >
              {shareCopied ? 'Link copied!' : 'Share episode'}
            </button>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-10">
            {episode.summary && (
              <section>
                <h2 className="text-2xl font-display font-bold text-richblack">
                  Summary
                </h2>
                <p className="mt-4 text-gray-700 leading-relaxed">{episode.summary}</p>
              </section>
            )}

            {episode.keyTakeaways.length > 0 && (
              <section>
                <h2 className="text-2xl font-display font-bold text-richblack">
                  Key Takeaways
                </h2>
                <ul className="mt-4 space-y-3 text-gray-700">
                  {episode.keyTakeaways.map((takeaway, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {episode.fullNotes && (
              <section>
                <h2 className="text-2xl font-display font-bold text-richblack">
                  Full Notes
                </h2>
                <div className="mt-4 space-y-4 text-gray-700">
                  {episode.fullNotes.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>
            )}

            {episode.resourcesMentioned.length > 0 && (
              <section>
                <h2 className="text-2xl font-display font-bold text-richblack">
                  Resources Mentioned
                </h2>
                <ul className="mt-4 space-y-3 text-gray-700">
                  {episode.resourcesMentioned.map((resource, index) => (
                    <li key={index}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary hover:text-purple-700 transition"
                      >
                        {resource.title}
                      </a>
                      {resource.author && (
                        <span className="ml-2 text-sm text-gray-500">by {resource.author}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="space-y-10">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-display font-bold text-richblack">Guest</h3>
              <div className="mt-4 flex items-start gap-4">
                <img
                  src={
                    episode.guestAvatarUrl ??
                    `https://i.pravatar.cc/120?u=${encodeURIComponent(episode.guestName ?? episode.id)}`
                  }
                  alt={episode.guestName ?? 'Guest avatar'}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  {episode.guestName && (
                    <p className="font-semibold text-richblack">{episode.guestName}</p>
                  )}
                  {episode.guestTitle && (
                    <p className="text-sm text-gray-500">{episode.guestTitle}</p>
                  )}
                </div>
              </div>
              {episode.guestBio && (
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">{episode.guestBio}</p>
              )}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-display font-bold text-richblack">
                Episode Stats
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                {formattedDuration && (
                  <li>
                    <span className="font-semibold text-richblack">Length:</span>{' '}
                    {formattedDuration}
                  </li>
                )}
                {episode.readTimeMinutes && (
                  <li>
                    <span className="font-semibold text-richblack">Read time:</span>{' '}
                    {episode.readTimeMinutes} minutes
                  </li>
                )}
                <li>
                  <span className="font-semibold text-richblack">Views:</span>{' '}
                  {episode.viewCount.toLocaleString()}
                </li>
              </ul>
            </section>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold text-richblack">
                Related Episodes
              </h2>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
            </div>
          </section>
        )}
      </section>
    </article>
  );
};

export default EpisodePage;

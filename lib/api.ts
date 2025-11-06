import supabase from './supabase';

export type EpisodeResourceType = 'book' | 'article' | 'video' | 'tool' | 'paper' | 'podcast';

export interface EpisodeResource {
  type: EpisodeResourceType;
  title: string;
  author?: string | null;
  url: string;
}

export interface EpisodeRecord {
  id: string;
  podcast_name: string;
  podcast_host: string | null;
  podcast_category: string[] | null;
  podcast_artwork_url: string | null;
  episode_title: string;
  episode_number: number | null;
  episode_date: string | null;
  episode_duration_minutes: number | null;
  guest_name: string | null;
  guest_title: string | null;
  guest_bio: string | null;
  guest_avatar_url: string | null;
  summary: string | null;
  key_takeaways: string[] | null;
  full_notes: string | null;
  resources_mentioned: EpisodeResource[] | null;
  tags: string[] | null;
  read_time_minutes: number | null;
  view_count: number | null;
  published_at: string | null;
}

export interface EpisodeSummary {
  id: string;
  podcastName: string;
  podcastHost: string | null;
  categories: string[];
  artworkUrl: string | null;
  title: string;
  episodeNumber: number | null;
  episodeDate: string | null;
  durationMinutes: number | null;
  guestName: string | null;
  guestTitle: string | null;
  guestBio: string | null;
  guestAvatarUrl: string | null;
  summary: string | null;
  keyTakeaways: string[];
  fullNotes: string | null;
  resourcesMentioned: EpisodeResource[];
  tags: string[];
  readTimeMinutes: number | null;
  viewCount: number;
  publishedAt: string | null;
}

export interface EpisodeListResponse {
  episodes: EpisodeSummary[];
  total: number;
}

export interface EpisodeListFilters {
  category?: string;
  sort?: 'recent' | 'popular';
  limit?: number;
  offset?: number;
  search?: string;
}

const EPISODE_COLUMNS =
  'id,podcast_name,podcast_host,podcast_category,podcast_artwork_url,episode_title,episode_number,episode_date,episode_duration_minutes,guest_name,guest_title,guest_bio,guest_avatar_url,summary,key_takeaways,full_notes,resources_mentioned,tags,read_time_minutes,view_count,published_at';

const mapEpisodeRecord = (record: EpisodeRecord): EpisodeSummary => ({
  id: record.id,
  podcastName: record.podcast_name,
  podcastHost: record.podcast_host,
  categories: record.podcast_category ?? [],
  artworkUrl: record.podcast_artwork_url,
  title: record.episode_title,
  episodeNumber: record.episode_number,
  episodeDate: record.episode_date,
  durationMinutes: record.episode_duration_minutes,
  guestName: record.guest_name,
  guestTitle: record.guest_title,
  guestBio: record.guest_bio,
  guestAvatarUrl: record.guest_avatar_url,
  summary: record.summary,
  keyTakeaways: record.key_takeaways ?? [],
  fullNotes: record.full_notes,
  resourcesMentioned: record.resources_mentioned ?? [],
  tags: record.tags ?? [],
  readTimeMinutes: record.read_time_minutes,
  viewCount: record.view_count ?? 0,
  publishedAt: record.published_at,
});

export async function getRecentEpisodes(limit = 6): Promise<EpisodeSummary[]> {
  const { data, error } = await supabase
    .from('episodes')
    .select<EpisodeRecord>(EPISODE_COLUMNS)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to load recent episodes: ${error.message}`);
  }

  return (data ?? []).map(mapEpisodeRecord);
}

export async function getAllEpisodes(filters: EpisodeListFilters = {}): Promise<EpisodeListResponse> {
  const {
    category,
    sort = 'recent',
    limit = 12,
    offset = 0,
    search,
  } = filters;

  let query = supabase
    .from('episodes')
    .select<EpisodeRecord>(EPISODE_COLUMNS, { count: 'exact' })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.contains('podcast_category', [category]);
  }

  if (search) {
    query = query.or(
      `episode_title.ilike.%${search}%,summary.ilike.%${search}%,guest_name.ilike.%${search}%`
    );
  }

  if (sort === 'popular') {
    query = query.order('view_count', { ascending: false, nullsFirst: false });
  } else {
    query = query.order('published_at', { ascending: false, nullsFirst: false });
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to load episodes: ${error.message}`);
  }

  return {
    episodes: (data ?? []).map(mapEpisodeRecord),
    total: count ?? 0,
  };
}

export async function getEpisodeById(id: string): Promise<EpisodeSummary | null> {
  const { data, error } = await supabase
    .from('episodes')
    .select<EpisodeRecord>(EPISODE_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load episode: ${error.message}`);
  }

  return data ? mapEpisodeRecord(data) : null;
}

export interface CategorySummary {
  name: string;
  count: number;
}

export async function getCategories(): Promise<CategorySummary[]> {
  const { data, error } = await supabase.from('episodes').select<{ podcast_category: string[] | null }>('podcast_category');

  if (error) {
    throw new Error(`Failed to load categories: ${error.message}`);
  }

  const counts = new Map<string, number>();

  (data ?? []).forEach((row) => {
    (row.podcast_category ?? []).forEach((category) => {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getEpisodesByCategory(category: string, limit = 12, offset = 0): Promise<EpisodeListResponse> {
  let query = supabase
    .from('episodes')
    .select<EpisodeRecord>(EPISODE_COLUMNS, { count: 'exact' })
    .contains('podcast_category', [category])
    .order('published_at', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to load category episodes: ${error.message}`);
  }

  return {
    episodes: (data ?? []).map(mapEpisodeRecord),
    total: count ?? 0,
  };
}

export interface EpisodeStats {
  totalEpisodes: number;
  totalDurationMinutes: number;
  totalReadTimeMinutes: number;
}

export async function getEpisodeStats(): Promise<EpisodeStats> {
  const { data, error, count } = await supabase
    .from('episodes')
    .select<{ episode_duration_minutes: number | null; read_time_minutes: number | null }>(
      'episode_duration_minutes, read_time_minutes',
      { count: 'exact' }
    );

  if (error) {
    throw new Error(`Failed to load episode stats: ${error.message}`);
  }

  const totals = (data ?? []).reduce(
    (acc, row) => {
      acc.duration += row.episode_duration_minutes ?? 0;
      acc.readTime += row.read_time_minutes ?? 0;
      return acc;
    },
    { duration: 0, readTime: 0 }
  );

  return {
    totalEpisodes: count ?? 0,
    totalDurationMinutes: totals.duration,
    totalReadTimeMinutes: totals.readTime,
  };
}

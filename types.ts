export interface Episode {
  id: string;
  podcastTitle: string;
  episodeTitle: string;
  guestName: string;
  duration: string;
  durationSaved: string;
  date: string;
  imageUrl: string;
  tags: string[];
  summary: string;
  quotePreview: string;
  readTime: string;
}

export interface Podcast {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
}

export interface Topic {
  id: number;
  name: string;
  count: number;
}

export interface RequestedPodcast {
  id: number;
  title: string;
  imageUrl: string;
  upvotes: number;
}

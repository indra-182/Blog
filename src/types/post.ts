export interface TocEntry {
  title: string;
  url: string;
  items: TocEntry[];
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  tags: string[];
  draft: boolean;
  type: 'article';
  body: string;
  toc: TocEntry[];
  readingTimeMinutes: number;
}

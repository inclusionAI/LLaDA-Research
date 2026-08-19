export interface DatedEntry {
  id: string;
  data: {
    title: string;
    date: Date;
    featured?: boolean;
    draft?: boolean;
  };
}

export function sortPublished<T extends DatedEntry>(entries: T[]): T[] {
  return entries
    .filter(({ data }) => !data.draft)
    .toSorted((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function selectFeatured<T extends DatedEntry>(
  entries: T[],
  warn: (message: string) => void = console.warn,
): T | undefined {
  const published = sortPublished(entries);
  const featured = published.filter(({ data }) => data.featured);

  if (featured.length > 1) {
    warn(`Multiple featured entries found; using ${featured[0].id}.`);
  }

  return featured[0] ?? published[0];
}

export function matchesArchiveEntry(
  title: string,
  tags: string[],
  query: string,
  activeTag: string,
): boolean {
  const normalizedTags = tags.map((tag) => tag.toLowerCase());
  const searchable = `${title} ${normalizedTags.join(' ')}`.toLowerCase();
  const matchesQuery = !query || searchable.includes(query.toLowerCase());
  const matchesTag = !activeTag || normalizedTags.includes(activeTag.toLowerCase());
  return matchesQuery && matchesTag;
}

export interface RelatedEntry {
  id: string;
  kind: string;
  data: {
    title: string;
    tags: string[];
    date: Date;
  };
}

export function selectRelated<T extends RelatedEntry>(
  entries: T[],
  current: Pick<RelatedEntry, 'id' | 'kind'>,
  tags: string[],
  limit = 3,
): T[] {
  const wanted = new Set(tags.map((tag) => tag.toLowerCase()));

  return entries
    .filter((entry) => entry.id !== current.id || entry.kind !== current.kind)
    .map((entry) => ({
      entry,
      shared: entry.data.tags.filter((tag) => wanted.has(tag.toLowerCase())).length,
    }))
    .filter(({ shared }) => shared > 0)
    .toSorted((a, b) => b.shared - a.shared || b.entry.data.date.valueOf() - a.entry.data.date.valueOf())
    .slice(0, limit)
    .map(({ entry }) => entry);
}

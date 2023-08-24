export type Pair = { front: string; back: string };

export const fetchPairs = async (language: string): Promise<Pair[]> => {
  const req = await fetch(`/lang/${language}.json`);
  return (req.ok ? await req.json() : []).map((p: [string, string]) => ({
    front: p[0],
    back: p[1],
  }));
};

export const getRandomPairs = (pairs: Pair[], size = 50) =>
  pairs
    .slice()
    .sort(() => (Math.random() > Math.random() ? 1 : -1))
    .slice(0, size);


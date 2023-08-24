import generateWordPairs from "https://aifn.run/fn/ed2b7b1d-77c4-49dc-91a9-27e9fb68525b.js";

export type Pair = { front: string; back: string };

const knownLanguages = ["fr", "es", "nl", "it"];
export const fetchPairs = async (language: string): Promise<Pair[]> => {
  let source: Array<[string, string]>;

  if (knownLanguages.includes(language)) {
    source = await fetch(`/lang/${language}.json`).then((x) => x.json());
  } else {
    source = JSON.parse(await generateWordPairs({ language, count: 20 }));
  }

  return source.map((p: [string, string]) => ({
    front: p[0],
    back: p[1],
  }));
};

export const getRandomPairs = (pairs: Pair[], size = 20) =>
  pairs
    .slice()
    .sort(() => (Math.random() > Math.random() ? 1 : -1))
    .slice(0, size);

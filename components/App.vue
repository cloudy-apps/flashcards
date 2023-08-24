<template>
  <div class="flex flex-col h-screen w-screen justify-center app px-4">
    <nav
      v-if="!lang"
      class="flex items-center justify-center gap-4 p-2 text-xl text-white"
    >
      <h1>Select a language to practice:</h1>
      <a href="/?lang=fr">French</a>
      <a href="/?lang=nl">Dutch</a>
      <a href="/?lang=es">Spanish</a>
      <a href="/?lang=it">Italian</a>
    </nav>
    <div
      v-if="lang"
      @click="flip()"
      class="cards relative w-full max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden text-center"
    >
      <div
        class="text-gray-900 font-bold card absolute z-1 inset-0 justify-center items-center flex text-center"
        ref="card1"
      >
        <span>{{ flashcards.length && flashcards[currentCard].front }}</span>
      </div>
      <div
        class="text-gray-900 font-bold card absolute z-1 inset-0 justify-center items-center flex text-center"
        ref="card2"
      >
        <span>{{ flashcards.length && flashcards[currentCard].back }}</span>
      </div>
    </div>

    <div v-if="lang" class="text-center mt-4">
      <button
        class="bg-white border border-gray-400 shadow rounded-full w-10 h-10 p-2 mr-4"
        :class="loading && 'animate-spin'"
        @click="resetList()"
      >
        <span class="material-icons">{{
          loading ? "refresh" : "shuffle"
        }}</span>
      </button>
      <button
        class="bg-white border border-gray-400 shadow rounded-full w-10 h-10 p-2 mr-4"
        @click="prevCard()"
      >
        <span class="material-icons">undo</span>
      </button>
      <button
        class="bg-white border border-gray-400 shadow rounded-full w-10 h-10 p-2"
        @click="nextCard()"
      >
        <span class="material-icons">redo</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, unref } from "vue";
import { fetchPairs, getRandomPairs, Pair } from "./word-pairs";

const card1 = ref<HTMLDivElement | null>(null);
const card2 = ref<HTMLDivElement | null>(null);
const pairs = ref<Pair[]>([]);
const loading = ref(false);
const lang = ref("");

let flipped = false;

const useState = <T = any>(value: T) => {
  const r = ref<T>(value);
  const s = (v: T) => (r.value = v as any);
  return [r, s] as const;
};

async function flip() {
  if (flipped) {
    return unflip();
  }

  await Promise.all([
    card1.value?.animate({ opacity: "0" }, { duration: 200, fill: "forwards" })
      .finished,
    card2.value?.animate({ opacity: "1" }, { duration: 200, fill: "forwards" })
      .finished,
  ]);

  flipped = true;
}

async function unflip() {
  await Promise.all([
    card1.value?.animate({ opacity: "1" }, { duration: 10, fill: "forwards" })
      .finished,
    card2.value?.animate({ opacity: "0" }, { duration: 10, fill: "forwards" })
      .finished,
  ]);

  flipped = false;
}

const [flashcards, setFlashCards] = useState<Pair[]>([]);
const [currentCard, setCurrentCard] = useState(0);

const resetList = async () => {
  setFlashCards(getRandomPairs(pairs.value));
  await unflip();
};

const nextCard = async () => {
  await unflip();
  setCurrentCard((unref(currentCard) + 1) % unref(flashcards).length);
};

const prevCard = async () => {
  await unflip();
  setCurrentCard(
    (unref(currentCard) > 0
      ? unref(currentCard) - 1
      : unref(flashcards).length) % unref(flashcards).length
  );
};

const handleKeyDown = (event) => {
  if (event.key === "d" || event.key === "ArrowLeft") {
    prevCard();
  }

  if (event.key === "f" || event.key === "ArrowRight") {
    nextCard();
  }

  if (event.key === "s" || event.key === "ArrowDown") {
    flip();
  }

  if (event.key === "a" || event.key === "ArrowUp") {
    unflip();
  }
};

onMounted(async () => {
  window.addEventListener("keydown", handleKeyDown);
  lang.value = new URL(location.href).searchParams.get("lang") || "";

  if (lang.value) {
    loading.value = true;
    pairs.value = await fetchPairs(lang.value);
    await resetList();
    loading.value = false;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
.card, .cards {
  min-height: 15rem;
}

.card {
  font-size: 2rem;
  opacity: 1;
  transition: opacity 0.25s linear;
  backface-visibility: hidden;
}

.app {
  background-color: #e91e63;
}
</style>

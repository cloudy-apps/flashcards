<template>
  <div class="flex flex-col h-screen w-screen justify-center app px-4">
    <div
      @click="setFlip(!flip)"
      class="cards relative w-full max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden text-center"
    >
      <div
        :class="[
          'text-gray-900 font-bold card absolute z-1 inset-0 justify-center items-center flex text-center transition-all',
          flip ? 'flip' : '',
        ]"
      >
        <span>{{ flashcards[currentCard].front }}</span>
      </div>
      <div
        :class="[
          'text-gray-900 font-bold card absolute z-2 inset-0 justify-center items-center flex text-center transition-all',
          flip ? '' : 'flip',
        ]"
      >
        <span>{{ flashcards[currentCard].back }}</span>
      </div>
    </div>

    <div class="text-center mt-4">
      <button
        class="bg-white border border-gray-400 shadow rounded-full w-10 h-10 p-2 mr-4"
        @click="resetList()"
      >
        <span class="material-icons">shuffle</span>
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

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { getRandomPairs } from "./dutch-words";

const useState = (value) => {
  const r = ref(value);
  const s = (v) => (r.value = v);
  return [r, s];
};

const [flashcards, setFlashCards] = useState(getRandomPairs());
const [currentCard, setCurrentCard] = useState(0);
const [flip, setFlip] = useState(false);

const resetList = () => {
  setFlip(false);
  setFlashCards(getRandomPairs());
};

const nextCard = () => {
  setFlip(false);
  setCurrentCard((currentCard + 1) % flashcards.length);
};

const prevCard = () => {
  setFlip(false);
  setCurrentCard(
    (currentCard > 0 ? currentCard - 1 : flashcards.length) % flashcards.length
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
    setFlip(!flip.value);
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
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

.flip {
  opacity: 0;
}
.app {
  background-color: #e91e63;
}
</style>

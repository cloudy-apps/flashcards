import React, { useState, useEffect } from "react";
import { wordPairs } from "./Dutch.js";
import "./Flashcard.css";

const getList = () =>
  wordPairs
    .slice()
    .sort(() => (Math.random() > Math.random() ? 1 : -1))
    .slice(0, 50);

function FlashcardList() {
  const [flashcards, setFlashCards] = useState(getList());
  const [currentCard, setCurrentCard] = useState(0);
  const [flip, setFlip] = useState(true);

  const resetList = () => {
    setFlip(false);
    setFlashCards(getList());
  };
  const nextCard = () => {
    setFlip(false);
    setCurrentCard((currentCard + 1) % flashcards.length);
  };
  const prevCard = () => {
    setFlip(false);
    setCurrentCard(
      (currentCard > 0 ? currentCard - 1 : flashcards.length) %
        flashcards.length
    );
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "d" || event.key === "ArrowLeft") {
        prevCard();
      }

      if (event.key === "f" || event.key === "ArrowRight") {
        nextCard();
      }

      if (event.key === "s" || event.key === "ArrowDown") {
        setFlip(!flip);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div className="flex flex-col h-screen justify-center">
      <div
        onClick={() => setFlip(!flip)}
        className={`cards relative w-full max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden text-center`}
      >
        <div
          className={`text-gray-900 font-bold card absolute z-1 w-full top-0 left-0 right-0 bottom-0 justify-center items-center flex text-center ${
            flip ? "" : "flip"
          }`}
        >
          <span>{flashcards[currentCard].front}</span>
        </div>
        <div
          className={`text-gray-900 font-bold card absolute z-2 w-full top-0 left-0 right-0 bottom-0 justify-center items-center flex text-center ${
            flip ? "flip" : ""
          }`}
        >
          <span>{flashcards[currentCard].back}</span>
        </div>
      </div>

      <div className="text-center mt-4">
        <button
          className="bg-white border border-gray-400 shadow rounded-full w-10 h-10 p-2 mr-4"
          onClick={() => resetList()}
        >
          <span className="material-icons">shuffle</span>
        </button>
        <button
          className="bg-white border border-gray-400 shadow rounded-full w-10 h-10 p-2 mr-4"
          onClick={() => prevCard()}
        >
          <span className="material-icons">undo</span>
        </button>
        <button
          className="bg-white border border-gray-400 shadow rounded-full w-10 h-10 p-2"
          onClick={() => nextCard()}
        >
          <span className="material-icons">redo</span>
        </button>
      </div>
    </div>
  );
}

export default FlashcardList;

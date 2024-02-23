import React, { useState } from 'react';

function TextToSpeech({ text, onStart, onEnd }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = () => {
    if (window.speechSynthesis.speaking || !text) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => {
      setIsSpeaking(true);
      if (onStart) onStart();
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <button onClick={speak} disabled={isSpeaking}>
        Speak
      </button>
    </div>
  );
}

export default TextToSpeech;

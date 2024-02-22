import React from 'react';
import useSpeechToText from 'react-hook-speech-to-text';

// ref: https://codesandbox.io/p/github/Ronald-Cifuentes/react-speech-to-text/master
export default function Speech() {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  return (
    <div style={{zIndex: '10'}}>
      <p>Recording: {isRecording.toString()}</p>
      <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <ul>
        {results.map((result) => (
          <li key={result.timestamp}>{result.transcript}</li>
        ))}
        {/* {interimResult && <li>{interimResult}</li>} */}
      </ul>
    </div>
  );
}
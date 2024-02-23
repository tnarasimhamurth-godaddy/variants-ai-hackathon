import React, { useEffect, useRef, useState } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';

// ref: https://codesandbox.io/p/github/Ronald-Cifuentes/react-speech-to-text/master
export default function Speech(props) {
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
  const [response, setResponse] = useState();
  const [messages, setMessages] = useState();
  const messageRef = useRef();
  const synth = window.speechSynthesis;

  useEffect(() => {
    setMessages(results);
  }, [results])

  const clearMessage = () => {
    stopSpeechToText();
    setMessages([]);
    messageRef.current.innerHTML = '';
  }

  const JWT = 'eyJhbGciOiAiUlMyNTYiLCAia2lkIjogIktpLXZsQ0owUmcifQ.eyJhdXRoIjogImJhc2ljIiwgImZ0YyI6IDIsICJpYXQiOiAxNzA4NjQwMzc5LCAianRpIjogInBScmRQSmU1YUJZMl9aM0szTDV5MVEiLCAidHlwIjogImpvbWF4IiwgInZhdCI6IDE3MDg2NDAzNzksICJmYWN0b3JzIjogeyJrX2ZlZCI6IDE3MDg2NDAzNzksICJwX29rdGEiOiAxNzA4NjQwMzc5fSwgImN0eCI6ICIiLCAiYWNjb3VudE5hbWUiOiAidG5hcmFzaW1oYW11cnRoIiwgInN1YiI6ICI0MDYyNzAiLCAidXR5cCI6IDEwMSwgImdyb3VwcyI6IFsiV0ZILVBDSSIsICJBY2NvdW50TG9ja01hbmFnZW1lbnQiLCAiQ1JNX1NraXAiLCAiQzMtVGllcjEiLCAiQzMtVGllcjAiLCAiRGV2LVdlYnNpdGVCdWlsZGVyIl19.VcvnxD3J7kfBOEOMLdf_RIl8piq5KbNlnT1oJyqJD2J3GqQqaFG7H-WutT6PPCWSVqS2qKqZ8OJL1n_hM_0nXoFljG2-N949WTXvlDyvH2etJXqSIKyUvWxqCHjvylXcNfaGXy-wjCE4sB8wyqroDbU906V5zU141k2IrK9L5Iz0nI6aIUchJ-cc8WGwHglxEHmkhyq7SU9slprRQv-sC2ykiRZfJZVANbhS8YHuNzM9el9TdL3m32UcJbvqC7tdfDlBTEH8wucltyXlf57hUMPYmSVdLlDpQ-apDOH1IhWtjYZ_WZQUlDMQaVmGX8WgtAUgfM-nDYkHAstzqOLZbQ';

  useEffect(() => {
    if (!isRecording && messages?.length > 0){
      console.log('Interaction results:', results);
      const question = messages[messages.length - 1].transcript;
      const query = {
        moderate: true,
        moderatePrompt: true,
        moderateTemplate: false,
        isTemplate: false,
        store: false,
        props: {},
        providerOptions: {
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          max_tokens: 1024,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        },
        privacy: {
          mode: 'detect',
          threshold: 0.85
        },
        provider: 'openai_chat',
        prompts: [
          {
            from: 'system',
            content: 'You are a Tech Employer with a Care, HR, Marketing, Engineer, Helpdesk divisions.Helpdesk helps procure different electronic equipments.Engineer helps build software products'
          },
          {
            from: "user",
            content: `${question}`
          }
        ],
        source: 'playground',
      }
      fetch('https://caas.api.test-godaddy.com/v1/prompts?effort=default', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': `sso-jwt ${JWT}`
        },
        body: JSON.stringify(query, question)
      }).then(response => response.json())
        .then(json => {
          setResponse(json.data.value.content)
        })
      .catch(error => console.error(error));
      }
  }, [isRecording, messages]);

  useEffect(() => {
    //convert response to speech
    if (response) {
      const voices = synth.getVoices();
      const speech = new SpeechSynthesisUtterance(response);
      speech.rate = 1;
      speech.pitch = 1.3;
      speech.voice = voices[50];
      synth.speak(speech);
      speech.onstart = () => {
        props.onSpeaking(true);
      };
      speech.onend = () => {
        props.onSpeaking(false);
      };

      window.speechSynthesis.speak(speech);
    }
  }, [response]);

  if (error) {
    return <p>Web Speech API is not available in this browser 🤷‍</p>;
  }

  return (
    <div>
      <button className='black-button' onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <button className='black-button clear-button' onClick={ clearMessage }>Clear message</button>
      <div ref={ messageRef }>
        {results.map((result) => (
          <p key={result.timestamp}>{result.transcript}</p>
        ))}
        {interimResult && <p style={{ color: 'blue' }}>{interimResult}</p>}
      </div>
    </div>
  );
}

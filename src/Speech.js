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

  useEffect(() => {
    setMessages(results);
  }, [results])

  const clearMessage = () => {
    stopSpeechToText();
    setMessages([]);
    messageRef.current.innerHTML = '';
  }

  const JWT = 'put that in here';

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
      const speech = new SpeechSynthesisUtterance(response);
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

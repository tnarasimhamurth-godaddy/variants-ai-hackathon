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

  const JWT = 'put it here';

  useEffect(() => {
    if (!isRecording && messages?.length > 0){
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
            content: 'You are a Tech Employer with a Care, HR, Marketing, Engineer, Helpdesk divisions.Helpdesk helps procure different electronic equipments.Engineer helps build software products.Offload your AWS infrastructure maintenance with Katana.Our Continuous Delivery Platform “Katana” is generally available for development teams using containerized applications in AWS, which means you can onboard as early as your next sprint.Manages your AWS infrastructure for Amazon Elastic Container Services, Load Balancers, Amazon Elastic Container Registry, Amazon Simple Storage Service (S3), Amazon CloudFront.Gives you tools for troubleshooting and observability, application performance and debugging directly in the Katana UI. ‌‌2024 Solutions day is on MAY 31 9AM PST, Aug 23 9AM PST, Nov 15 at 8AM PST.Inform your supervisor that your headset is broken and Request a new set from Get Help.Performance review happens between Feb 24 to March 7.MBO payouts are on March 8.Promotions and salary change are effective on April 1st.Airo is an AI-powered experience that is currently included in every new Godaddy domain purchase. Airo helps you grow online presence by creating a customized website, generating logo options , social media posts and online ads.Also helps setting up email address and creating email marketing templates to send to your customer.'
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
    <div style={{margin: '3rem'}}>
        <h4>
          { isRecording ? '"Stop Recording" when you are done.' :
            'When you are ready to ask your question, click "Start Recording" button.' }
          </h4>
    </div>
      <button className='black-button recording' onClick={isRecording ? stopSpeechToText : startSpeechToText}>
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

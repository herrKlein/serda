import 'regenerator-runtime';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
// import "./App.css";
import microPhoneIcon from './microphone.svg';
import { commands } from './commands';
import { useKeyPress } from './useKeyPress';
import useCountDown from 'react-countdown-hook';

const words = ['fiets', 'boer', 'kaas'];
function App() {
  const { transcript, resetTranscript } = useSpeechRecognition({ commands });
  const [isListening, setIsListening] = useState(false);
  const [wordIndex, setWordIndex] = useState(words.length - 1);

  const [timeLeftPreWord, actionsPreWord] = useCountDown(3, 1000);
  const [timeLeftShowWord, actionsShowWord] = useCountDown(6000, 10);

  useEffect(() => {
    actionsPreWord.start(3000);
  }, []);

  useEffect(() => {
    if (timeLeftPreWord === 0) {
      actionsShowWord.start();
    }
  }, [timeLeftPreWord]);

  const spacePress = useKeyPress(' ');

  useEffect(() => {
    if (spacePress) {
      resetTranscript();

      setIsListening(true);

      microphoneRef?.current.classList.add('listening');
      SpeechRecognition.startListening({
        continuous: true,
        language: 'nl-NL',
      });
    } else {
      setIsListening(false);
      SpeechRecognition.stopListening();
      microphoneRef?.current.classList.remove('listening');

      const lastWord = transcript.split(' ').pop();
      if (
        lastWord !== '' &&
        words[wordIndex].trim().toLowerCase() === lastWord?.trim().toLowerCase()
      ) {
        actionsPreWord.start(3000);
        if (wordIndex > 0) {
          setWordIndex(wordIndex - 1);
        }
      } else {
        // console.log("INCORRECT");
      }
    }
  }, [spacePress]);

  const microphoneRef = useRef(null);
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="mircophone-container">
        Browser is not Support Speech Recognition.
      </div>
    );
  }

  return (
    <div>
      <div className="mircophone-container">
        <h2>{timeLeftShowWord}</h2>

        {timeLeftPreWord > 0 && <h1>{(timeLeftPreWord / 1000).toFixed(0)}</h1>}
        <h1>{timeLeftPreWord === 0 && <div>{words[wordIndex]}</div>}</h1>
        <img
          alt="mic"
          ref={microphoneRef}
          src={microPhoneIcon}
          className="microphone-icon"
          style={{ width: '100px', height: '100px' }}
        />
        {isListening
          ? 'Luisteren.........'
          : 'Klik op spatie om woord uit te spreken'}
      </div>
      <div
        style={{
          textAlign: 'center',
          background: 'lightgray',
          height: '40px',
        }}
      >
        {transcript && <h1>{transcript.split(' ').pop()}</h1>}
      </div>
    </div>
  );
}
export default App;

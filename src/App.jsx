import { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/homepage';
import './App.css';

function App() {
  // State and worker initialization
  const [ready, setReady] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [progressItems, setProgressItems] = useState([]);
  const [input, setInput] = useState('I love walking my dog.');
  const [sourceLanguage, setSourceLanguage] = useState('eng_Latn');
  const [targetLanguage, setTargetLanguage] = useState('fra_Latn');
  const [output, setOutput] = useState('');
  const worker = useRef(null);

  // Worker setup
  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    }


    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case 'initiate':
          setReady(false);
          setProgressItems((prev) => [...prev, e.data]);
          break;
        case 'progress':
          setProgressItems((prev) =>
            prev.map((item) =>
              item.file === e.data.file ? { ...item, progress: e.data.progress } : item
            )
          );
          break;
        case 'done':
          setProgressItems((prev) => prev.filter((item) => item.file !== e.data.file));
          break;
        case 'ready':
          setReady(true);
          break;
        case 'update':
            console.log(e.data.output);
          setOutput(e.data.output);
          break;
        case 'complete':
          setDisabled(false);
          break;
        default:
          break;
      }
    };

    worker.current.addEventListener('message', onMessageReceived);

    return () => worker.current.removeEventListener('message', onMessageReceived);
  }, []);

  const translate = () => {
    setDisabled(true);
    worker.current.postMessage({
      text: input,
      src_lang: sourceLanguage,
      tgt_lang: targetLanguage,
    });
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Homepage
              ready={ready}
              disabled={disabled}
              progressItems={progressItems}
              input={input}
              output={output}
              setInput={setInput}
              setSourceLanguage={setSourceLanguage}
              setTargetLanguage={setTargetLanguage}
              translate={translate}
            />
          }
        />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;

import LanguageSelector from '../LanguageSelector';
import Progress from '../Progress';

function LoadModel({
  ready,
  disabled,
  progressItems,
  input,
  output,
  setInput,
  setSourceLanguage,
  setTargetLanguage,
  translate,
}) {
  return (
    <>
      <h1>Transformers.js</h1>
      <h2>ML-powered multilingual translation in React!</h2>

      <div className="container">
        <div className="language-container">
          <LanguageSelector
            type="Source"
            defaultLanguage="eng_Latn"
            onChange={(x) => setSourceLanguage(x.target.value)}
          />
          <LanguageSelector
            type="Target"
            defaultLanguage="fra_Latn"
            onChange={(x) => setTargetLanguage(x.target.value)}
          />
        </div>

        <div className="textbox-container">
          <textarea value={input} rows={3} onChange={(e) => setInput(e.target.value)}></textarea>
          <textarea value={output} rows={3} readOnly></textarea>
        </div>
      </div>

      <button disabled={disabled} onClick={translate}>
        Translate
      </button>

      <div className="progress-bars-container">
        {ready === false && <label>Loading models... (only run once)</label>}
        {progressItems.map((data) => (
          <div key={data.file}>
            <Progress text={data.file} percentage={data.progress} />
          </div>
        ))}
      </div>
    </>
  );
}

export default LoadModel;

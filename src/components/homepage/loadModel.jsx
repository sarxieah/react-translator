import Progress from '../Progress';
import { CustomButton } from './scheduler';

function LoadModel({
  ready,
  disabled,
  progressItems,
  translate,
}) {
  return (
    <>
      <div className="subtitle" style={{marginTop: "20vh", fontSize: "20px"}}>
        Load the model before you start
    </div>
      <button disabled={disabled} onClick={translate}>
        Load Model
      </button>
      <CustomButton
					variant="contained"
					type="submit"
					onClick={translate}
				>
					Submit
				</CustomButton>

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

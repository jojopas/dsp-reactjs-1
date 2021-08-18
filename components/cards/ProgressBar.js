import "./Cards.less";

const ProgressBar = ({ value }) => {
    const valueInPercentage = Number.parseInt(value * 100);
    return (
        <div className="progress">
            <div
                testid="progressid"
                className="progressValue"
                style={{ width: `${valueInPercentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;

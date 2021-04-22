import "./Cards.less";

const ProgressBar = ({ value }) => {
    const valueInPercentage = Number.parseInt(value * 100);
    return (
        <div class="progress">
            <div
                testID="progressid"
                class="progressValue"
                style={{ width: `${valueInPercentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;

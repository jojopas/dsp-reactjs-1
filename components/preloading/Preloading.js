import InlineSVG from "../InlineSVG";
import "./Preloading.less";

const Preloading = () => {
    // console.log('Preloading started');
    return (
        <div className="preloading">
            {/* <InlineSVG type="splash" /> */}
            <img src="/images/Loading.gif" />
        </div>
    );
};

export default Preloading;

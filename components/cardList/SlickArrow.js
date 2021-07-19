import React from "react";

import InlineSVG from "../InlineSVG";

const SlickArrow = (props) => {
    const { currentSlide, slideCount, ...rest } = props;
    // console.log("SlickArrow", props);
    return (
        <button {...rest}>
            <InlineSVG type="arrow" />
        </button>
    );
};

export default SlickArrow;

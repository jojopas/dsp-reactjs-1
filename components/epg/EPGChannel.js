import { constants } from "../../config";
import InlineSVG from "../InlineSVG";

const ChannelLogo = ({
    channel,
    isLocked,
    isShowing,
    width,
    onClick,
    index,
}) => {
    const channelStyle = {
        width: width,
        // background: `url(${channel.logo}/${width - 10})`,
    };
    if (isShowing) {
        channelStyle.backgroundColor = "#fbcc35";
        channelStyle.fill = "#122d42";
    }

    const imageDiff = 70;
    return (
        <div
            className={"channel-info"}
            style={channelStyle}
            title={channel.name}
            onClick={onClick}
        >
            {channel.logo ? (
                <img
                    className="channel-info--image"
                    src={constants.NOT_FOUND_SRC}
                    data-sizes="auto"
                    sizes={`${width - imageDiff}px`}
                    data-srcset={`${channel.logo}/${imageDiff}/${imageDiff}`}
                    data-src={`${channel.logo}/${width - imageDiff}/${
                        width - imageDiff
                    }`}
                    alt={channel.name}
                    className="lazyload"
                />
            ) : (
                <img
                    className="channel-info--image"
                    src={constants.NOT_FOUND_SRC}
                    alt={channel.name}
                    className="lazyloaded"
                />
            )}
            {/* {isLocked && (
                <div className="channel-info--locked">
                    <InlineSVG type="lock" />
                </div>
            )} */}
        </div>
    );
};

const DemoList = [
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="54"
        height="38"
        viewBox="0 0 54 38"
    >
        <defs>
            <pattern
                id="pattern"
                width="1"
                height="1"
                viewBox="0 -35.697 155.455 109.394"
            >
                <image
                    preserveAspectRatio="xMidYMid slice"
                    width="155.455"
                    height="38"
                    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAWCAYAAABAMosVAAADkUlEQVRYhe2ZyWsUQRTGf7O4O3HBJaIRd40KLv+A20U8eNCTVw+KCHoTFMWTgnrxop68qicliHoRQQQR9BAXJImJYowQlxD3JSbTHl6VM7RTr6a7K4LiB0MVr159VfO6+nuvu3NRFGGwDrgEDAK/jClQAIaAlcBLYysBe4BtwGygnHGNECgAA8Bt4CRwo2rsBLAT+R9puT8BV4HjQEeuKtDbgbMpieMoA6OBH8BM4A4wKxD3cGEzcNn0rwCbAvEOAivyVYYJgYgB2pAgw98RZIDzVf2QsSgCp6sD3RSQvM+0W/g7ggwwDmg2/fmBuVdVB3pjQGKrzQcDcv4JDAF5oDEwb0PRdPJAj1monJG0AFw0/WfASNInlT+FPCJ1HUADcJ9wCTsPdNpkmAtE+i9gWGJhpeN/kCsYllhY6ZgH7DWLZFkoh0jHXqR2PmzsaeWoCPQDrUBLbGwHsBQpn7KiCDwBTgFbgTX8Lnd5JPccd3DsQxJ/fF4BaCGKIqIo2hmFBVEUzQ/M2WJ47W8gMP8xw/tA8Xke24P9lTzcB6x0hCztHpm2OyAnyAPFIdNvRE5KKHwG9tfhd9lhX+KZ98gGenrdW/LDlnY/CF/ebTdtE5X8khUfgA1U5G2i4vvQYfcd1G6r0ZMSbMyHt1X9I4jm7yLMg0vJtJM9fh+RC+26GDlE+68jd0mvsU8Cpim8XQ67Fr+PQIcNtBaEM+ZXVHwsRgIvYrajwDHkqWsMevIaRF7m7HaMPzXtDIWj16w1gAQ0Dmv7VGNsITBK4X7jsE9V5rQDX4qGWNOYa7hvmXoxREW7ffimjFndn634tAPv6lwrjqWe8X6Hfa4ypwfk1lqE/hIlaWlW6xQlwXplzJ6oZsWnVxnzYYEy1g+8cowtU+b1gcjBHM/ip5Gs7JOOHHJRmhEtvUeyp6yy8V+k+Dw37XLFp08Z80HT5w7gew17EViszHtjnaZ4Ftdu01ooIxdvYcJ59aDVtPMUnywnWktqPQ77dPQYdoFIhy/QSfDYtNqpzIJbSP08VvFpy8CvFQUuffZVbJ0ggU56YjXY0m51QE6LC4iEafoMFXlJihHoGp2m4gATkzywNvmenLC317qAnAB3ke+NIN8iNbxPucYs9LvbdQF9++kH0egIiXqI99A3Tf8DopVpOW0SfQ2cQz6WWjQg2b/WS5+vuCsDH8YjiTT+HtpWUXcd80pmXq399Nr9/ARK4wnu+4rBrQAAAABJRU5ErkJggg=="
                />
            </pattern>
        </defs>
        <rect id="ESPN" width="54" height="38" fill="url(#pattern)" />
    </svg>,
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="54"
        height="38"
        viewBox="0 0 54 38"
    >
        <defs>
            <pattern
                id="pattern"
                width="1"
                height="1"
                viewBox="0 -51.784 201.176 141.569"
            >
                <image
                    preserveAspectRatio="xMidYMid slice"
                    width="201.176"
                    height="38"
                    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAARCAYAAABdN7utAAADc0lEQVRYhb3YTYxeUxgH8N/7ztsx/aCjU4KYttKkKmikERJEJd2J2NaCWIhNg1i1W5ZigcSiFhXCogsrTSRU2rCotliwkPoM2mFCOx0TmvmqY3HuG6/7nvPO3Hun/snNvff5Ouc853me89EKIcB2HBERVMNa3IvTeB6P4EosVrRTB63ifRJPYRLvYwcWKtgZwhw+wH78kZG7H0+IY+u23fsuf6/Cz3hTCEEIYXdohrUhhBca2miKr0MIq0MIPza0cyREn6SegzVtnm8XM3BDhdkv4xjuxL4GNlYC2/CgGEFNsHMA77qaNke7jt5R0wB8h7sa6K8kbsetl9H+PTX1Jjs9PxcxW9HAiOjov2vqrxTauCDW5bniu+paA8P4YQD/MMal6/+iWOt34YoSb7oVQp3+rDjW4c//oY1eXK72/sKaEu2TbkTfh41iZFZBG19gDDdW1G8V+p/hTNH+LtV2C10MYUIc5M3+u+MZxin9tXscd2O+h9YRM/TLAX1+AKv1j3UBN+l3MvzaXU2nG6zSj4cQjjfQDyGE9SGEPQ1tnAwhvJbhPRv6dxBvZGRfScgKIawJIXxVs28vtbG+mKG6+BBnG+jDk+rV1F68KEZ1Cp8maK0EDY5m6A/jlqqdKjDVxlYxvepiAu820IdN4o6hLj7GO+I2M4XzCdpoRvaXDL3uFvgiDnVwfUYg4LhYe9oJfqvgDeNtcbHpDnRBrGGXinf3exx7ErbOYEumDwcwM6APE3i5+E85+hLOJei5cV/I0Ddm6K/ihFjfezEk+uEoJjrYkDFwDLszvBQOLENmp7SjZ8RjexlT2LvM9jdIO+Os/ogeFjO5jFn8lrG/PUN/ejmd68in0FYxHUcy/BEcxDd4Tpy94N/dRPfp/s/LHybmcXWCPr3UAHowJt4tlPG9/vq/WTrAfhInPYWcow8VOkMJXnfs+zq4JmNgc/EMwmHxUumhJeSWwqJ0NOYGncJVGfpkgrYpI3s6Q183QCeVoWU807a0MwfhW+lIrIKpws5tCV6uXqYwlqGnsiJXb3OOvlYMqDr4HDNt9c/vxJS8o4E+PCZGbvnkRnoRyyF3X/N7gjaekc21t6VCP8poEWv0rLhYVD3VKfTmaugPiXe+r+M9PCpG72JJ5kQFm6MlG9074VMJ2ZBpL3fPcQ5vqX7HvgofwT9YJFl94slWrQAAAABJRU5ErkJggg=="
                />
            </pattern>
        </defs>
        <rect
            id="ESPN_2"
            data-name="ESPN 2"
            width="54"
            height="38"
            fill="url(#pattern)"
        />
    </svg>,
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="54"
        height="38"
        viewBox="0 0 54 38"
    >
        <defs>
            <pattern
                id="pattern"
                width="1"
                height="1"
                viewBox="-5.122 0 64.245 45.209"
            >
                <image
                    preserveAspectRatio="xMidYMid slice"
                    width="54"
                    height="45.209"
                    xlinkHref="data:image/png;base64,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"
                />
            </pattern>
        </defs>
        <rect id="WFN" width="54" height="38" fill="url(#pattern)" />
    </svg>,
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="54"
        height="38"
        viewBox="0 0 54 38"
    >
        <defs>
            <pattern
                id="pattern"
                width="1"
                height="1"
                viewBox="0 -12.239 88.785 62.478"
            >
                <image
                    preserveAspectRatio="xMidYMid slice"
                    width="88.785"
                    height="38"
                    xlinkHref="data:image/png;base64,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"
                />
            </pattern>
        </defs>
        <rect id="FS1" width="54" height="38" fill="url(#pattern)" />
    </svg>,
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="54"
        height="38"
        viewBox="0 0 54 38"
    >
        <defs>
            <pattern
                id="pattern"
                width="1"
                height="1"
                viewBox="0 -16.392 100.588 70.784"
            >
                <image
                    preserveAspectRatio="xMidYMid slice"
                    width="100.588"
                    height="38"
                    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAiCAYAAADf2c6uAAAELElEQVRogc3aW6gVVRzH8c+5lVLY1fBEWJH1WEFySE9SaaVkEUcoeggh8CHfeulNkIqygqiHqF66ERZFRKVhF6MgK+iIWFgQBNHNqIRSOdpJ7fSwznQ2s/fsmdkza3ZfmJf/WrN+//3fa9blv9bAzMzMdlyCvzTDGTiM1fgxVbYVYzhag858PIRncuqdh5cw2oPufHyAu/IqDuManFJSoCq3aA/yTqyqWefinPLF2I2FFTSW4Ezc1q3SIPZXECnL37gCb6XsH6k/yHCwS9kSfKFakBNuxbZuFQZrECnKEWFY2JOy78TVkTTnZdiX4DOcXqPWTXg7q7CpQB/GMqEHtfKxOD05YaqDbSk+x9kR9G7EDpyWLmgi0EexHF+m7LtwVUTdHXiqg/0eYUKOxRrcnDYORxQkjMlL8XXKvgvjEXW34o6Msj9LtHPQXIyO69BTMxhIG8oG+kNhIsv7EhKh7fimxX6y0NOKBnkK9wo/ss35DgzhAJ7rUudEgXYOYq0w1I3M2o5hAi8U8OV42lA20NvweMl3WhnFtSXqT+D9Cnq98j0+6WB/Ec/qYSQoO0afU1YgxT+zT1H2VtTrRJHl3EUZ9nN7FY09RqeZmX2KshC/1+zDJC6QPYQM4ruaNRsPdFn+iNDmI7NPo5QdOuruXXksblgvjynlvsj/KNuj1wm7rZNy6g0J6+dHMd2DXwlvmFsL53WKEXwlJIhiMVzAj8wXyzCu3Pr3adUCvUhY3pVhsZC1K8qEsKHqtItMSCbxdUInKk3MMfqQ9glnRI+OlmCLsM7dUqDu3XgsrjuBJpNKhMntUAM6D2JTTp2N4gW5Le3cj0Cv0Mwhw/3YkFG2EU9G1P4pbWg60ITk0rhyG5deWdHBtl7cIG/GO2ljzEAvkD0e78GVEbUTDnSwZSWb6mAz7utUUHQynBKWTYvMJVm6MSIkZrqtOCaFg4CHhT8lb3UyjQuFXV0Vfqn4fhab8EBWYdFADwknIa/W4VELk1hZov6IkGIdq9mPhP14UzisLvK1D8w+r+GJbhWLBnoeXhHSf68XfCcGx7BPvEAPCtm53TEaLsPauh3ogQUR214kfGW3191w2UD/VrcDPXCkAY2yu9Fc+rG8q8poAxo/1N3g/yFNeikuk3/ENCOsi6+P7lE4IV+m2PFZKwPChL1PamnZ70CvElYzsSgbqITL8WkF3TvxfKuhn0PHSnGDTJy7G0VoO5ztV6BXCZcDY/NyAxqdaBsG+zF0XKeZk+3VeK8BnU60deCme/QNmgnyGv0LMuHi0BDOTwzDOKtEA6dWEF+Gdyu8X5S8PzPmhifhmBDbDcLEOjCMb4V7xK1pyxlhxk4OIgeEf+jXCuKjsw4kif9EI63Xzdbqn5byISHxtV64TdWNn4VrYSe66LW2neVPVr1BIZbTwq2m5Rj7F1/awJ3HV/KWAAAAAElFTkSuQmCC"
                />
            </pattern>
        </defs>
        <rect id="FS2" width="54" height="38" fill="url(#pattern)" />
    </svg>,
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="54"
        height="38"
        viewBox="0 0 54 38"
    >
        <defs>
            <pattern
                id="pattern"
                width="1"
                height="1"
                viewBox="0 -11.855 87.692 61.709"
            >
                <image
                    preserveAspectRatio="xMidYMid slice"
                    width="87.692"
                    height="38"
                    xlinkHref="data:image/png;base64,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"
                />
            </pattern>
        </defs>
        <rect id="OutdoorChannel" width="54" height="38" fill="url(#pattern)" />
    </svg>,
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="54"
        height="38"
        viewBox="0 0 54 38"
    >
        <defs>
            <pattern
                id="pattern"
                width="1"
                height="1"
                viewBox="0 -7.159 74.348 52.319"
            >
                <image
                    preserveAspectRatio="xMidYMid slice"
                    width="74.348"
                    height="38"
                    xlinkHref="data:image/png;base64,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"
                />
            </pattern>
        </defs>
        <rect id="SEC" width="54" height="38" fill="url(#pattern)" />
    </svg>,
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="54"
        height="38"
        viewBox="0 0 54 38"
    >
        <defs>
            <pattern
                id="pattern"
                width="1"
                height="1"
                viewBox="0 -4.595 67.059 47.19"
            >
                <image
                    preserveAspectRatio="xMidYMid slice"
                    width="67.059"
                    height="38"
                    xlinkHref="data:image/png;base64,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"
                />
            </pattern>
        </defs>
        <rect id="BigTen" width="54" height="38" fill="url(#pattern)" />
    </svg>,
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="54"
        height="38"
        viewBox="0 0 54 38"
    >
        <defs>
            <pattern
                id="pattern"
                width="1"
                height="1"
                viewBox="0 -44.333 180 126.667"
            >
                <image
                    preserveAspectRatio="xMidYMid slice"
                    width="180"
                    height="38"
                    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAATCAYAAAAQ/xqmAAAE/UlEQVRYhe2YW4iVVRSAv2OjpoFRpqLZRa3wkqI2YheTLCqjO0RYlBpjUKFdKCN90sKHNKWy8MEHkdCsh7A7aKWMJDZ0keimloMXcLynMtZkztfDXqfZnjlnLBICdcHP3uv6r73+vdda/y6oK4BewJ/8d2h3AmycTCBwBrC7oDYDhf/ZoZMeqoDtwAUnwNYGYEHMT384OApcBkwG9lUdR/gAsBLYCZwP3AicVUH2K+CVE+TkyQI9SYFu31agpwCLgUMZ7RxgEjC7jHyXE+beyQP9YrRSoK8B1sb8IlIQ95PSzBzgG9JO/ydwCdAEbAv8TFKRkJRijgDNJTp9SEXk5+MsohmoD7xD2CTsNlO+wHeNZ3PGb0u36G/uYwFoDzQGfmHIbazkbLkuYQIpyKOB94EaYCDwaODDgU+ApysZDZgE7AU2AVuBH4AhwH2BNwG/xzg/dHoBdaQgbIrxhhK7g4HvSB9hM/A90JdUb7aS0l0T6QPWAZeGXgdgGbCHVE+OANOC1zN0GzPdz0nBfCD8/APYAvwWMj8B3YB3gr4B2AWMKxsNdastsFFFnRH4Y4EXnyeD/kTg2zLd9zO5uzP6LPXtmI9Sn4n5/LCzLvBB6tyYP6LeHvO1JT5sCPod6n0xn6FWxXyfOk9dEvh2tWPYUf00fDoY+Hj1zEw2161Vq9UF6oqg1Qc+WX0zaFPVsTFvCF+I9aoeKA30NFuCNLdkgcWnGLRr1ZmZbh7oXUG7IqNdHOOrwbs08Klqk9pfXRa8h8PZAWXefyhkblXbZXb7Bf21THZdZk/1g4zXWW1UfzUFU/W5jL8laEW8R+BTM9qqoD2jdlIHlvhaMdAvZkEaVWaRqFcHvyEWVYQ80KqHK+jPsTXUBm+0aVcVoc60U3L9u9S9mcwqtW8sVHWP+pn6deBLbDmJQ0tsLQz6Q+oBdbf6rvpe0L8rs+7ZGW2o+mPmyyZ1omUCXZqj95M6DbLcVgqjY5xPavsqQUfK14BOMd4LDCDl+pHA40AtqQYMB2YBI4CPSbm7CMuBYUA1MA+4jlRTepPyZ1dgTMisJNWcH0L37hJfroqxgVTgugB3ALeH7og21gewPt4zGJgO9AAWAYNaSXrsjl4ZX2JN4P1LdsCQoH8Y+OpMN9/RzwdtnXqz+qC63pSHnw3eLWo3Uz5WfclUEzZm790TvGJ6aKcuj53WJWhHQ2ZYjMttfYq6q38G/zH1JnVR4C+b0ojqdNPx15TLcxvXZH4WaTPUX2w5/cW4VXuc1KEtufN1UwEZb8qHNeoX6gvBH1milwcaWwpKDmPVp8rQG0yBm1CGNzOzWTAVolK41VTwNKWNcinrSlNqyOGT4PUOfGngNYHvMOVm1DFBW5jZnFLGl8UZ/+9AF9StHPsLXk/qUY1jeDXpuB+Oo30QOJvUWp2b6X0QR670aN5JarmWktqgy4H+cVQ7Bu/TsA+pbx8PnAe8RUs/n8NA4P7QfwP4ltTH3kZq0+rKnXNSi1cT76gFPgp6N1IKqge+DNoYUju6PPzuClxPSkPfZza7AxNJf84fAisy3ihgDXCw3I5W3awOb2Nn7CyjU7qjTz/Zjq70Z9iHdHexDFhN+g0/O77oPRV0Dlegn8qwI8bC8S6VxlHpT6c19CJV3wKnb+8g3d5Vx7y5oDYCnf9Hh04FaK4i3Rn0pvXFzr+FM0gF6TQkKJAupv4Adv0FNPHv1mLBoHwAAAAASUVORK5CYII="
                />
            </pattern>
        </defs>
        <rect
            id="CBS_Sports"
            data-name="CBS Sports"
            width="54"
            height="38"
            fill="url(#pattern)"
        />
    </svg>,
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="54"
        height="38"
        viewBox="0 0 54 38"
    >
        <defs>
            <pattern
                id="pattern"
                width="1"
                height="1"
                viewBox="0 -6.069 71.25 50.139"
            >
                <image
                    preserveAspectRatio="xMidYMid slice"
                    width="71.25"
                    height="38"
                    xlinkHref="data:image/png;base64,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"
                />
            </pattern>
        </defs>
        <rect id="BallySports" width="54" height="38" fill="url(#pattern)" />
    </svg>,
];
export default ChannelLogo;

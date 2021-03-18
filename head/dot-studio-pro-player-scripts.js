import React from 'react';
import getConfig from 'next/config';

const {publicRuntimeConfig} = getConfig();

export default function DotStudioProPlayerScripts() {
    return (
        <>
            {/* Global Player Script for https://www.dplayer.pro/ */}
            <script async src={publicRuntimeConfig.DSP_PLAYER_URL} />
            <script async src="https://www.dplayer.pro/conviva-core-sdk.js" id="convivaCore" />
            <script async src="https://www.dplayer.pro/conviva-googleima-module.js" id="convivaIMAPlugin" />
            <script async src="https://www.dplayer.pro/conviva-videojs-module.js" id="convivaVideoJSPlugin" />
        </>
    )
}

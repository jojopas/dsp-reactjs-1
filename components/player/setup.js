import getConfig from 'next/config';

const {publicRuntimeConfig} = getConfig();

const setupPlayer = async (el, video= null, {autostart = true, ssid = null, vodPage = false}) => {
    let playerSetupTimer;

    async function loadDspPlayer(el) {
        clearInterval(playerSetupTimer);
        return await window.DotPlayer.mount({
            // base config
            target: `#${el.current.id}`,
            company_id: publicRuntimeConfig.DSP_PLAYER_KEY,
            // which video to load first
            video_id: (video && video.id) ? video.id : null ,
            video: (video && video.url) ? {m3u8_url: video.url, vmap_url: video.vmap, meta: video.meta} : null,
            // player specifics
            autostart: autostart,
            muted: false,
            inline: true,
            controls: true,
            skin: true,
            pip: false,
            theme: {
                fontColor: "#f2f2f2", // main icon color
                fontColorHover: "#52CD65", // icon color when hovered over
                progressSliderMain: "#52CD65", // progress slider color
                progressSliderBackground: "#B4B7BB", // progress slider background color
                controlBar: "#000000", // control bar gradient background color
            },
            springserve: {
                user_cookieid: ssid,
            },
            vod_page: vodPage,
        }).then(async (player) => {
            await player.isPlayerLoaded();
            return player;
        });
    }

    if (window.DotPlayer && window.DotPlayer.mount) {
        return await loadDspPlayer(el);
    } else {
        return new Promise(async (resolve) => {
            playerSetupTimer = setInterval(async () => {
                if (window.DotPlayer && window.DotPlayer.mount) {
                    const dspPlayer = await loadDspPlayer(el);
                    resolve(dspPlayer);
                }
            }, 16);
        });
    }
};

const disposePlayer = () => {
    if(window.DotPlayer && window.DotPlayer.unmount) {
        window.DotPlayer.unmount();
    }
}

module.exports = {
    setupPlayer,
    disposePlayer
};

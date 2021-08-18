import { action } from 'mobx';
import { useLocalStore, useStaticRendering } from 'mobx-react-lite';
import { createContext, useCallback } from 'react';
import axios from "axios";
import {parseCookies} from "nookies";
import {constants} from "../config";

const isServer = typeof window === 'undefined'
// eslint-disable-next-line react-hooks/rules-of-hooks
useStaticRendering(isServer)

let StoreContext = createContext();
let store;
let fetchUser;
let fetchDspToken;

function initializeData(initialData = store || {}) {
    const {
        user,
        isBreakpoint,
        currentChannel,
        isPlayerSetup,
        showPlayer,
        playerContainerRef,
        isAdRunning,
        isVideoLoading,
        playerInstance,
        siteWrapperRef,
        showMyCityModal,
        springServeId,
    } = initialData;
    let loadVideoTimeout;

    const cookies = parseCookies();

    const playVideo = async ({id, url, vmap = null, meta = null}) => {
        //console.log('video to play', id || url);
        /*if(vmap){
            console.log(vmap);
        }*/
        store.setIsVideoLoading(true);
        if (id) { await store.playerInstance.load(id); }
        else if (url) { await store.playerInstance.loadByUrl(url, vmap, meta); }
        store.setIsVideoLoading(false);
    }

    return {
        user,
        updateUser: (u) => {
            store.user = u;
        },
        get getUser() {
            return store.user;
        },
        fetchUser: async () => {
            await action(async () => {

            })

        }, 

        isBreakpoint,
        setBreakPoint: (bp) => {
            store.isBreakpoint = bp;
        },

        currentChannel,
        setCurrentChannel: (id) => {
            store.currentChannel = id;
        },

        isPlayerSetup,
        setIsPlayerSetup: (plyrSetup) => {
            store.isPlayerSetup = plyrSetup;
        },

        showPlayer,
        setShowPlayer: (showPlayer) => {
            store.showPlayer = showPlayer;
        },
        loadVideo: ({id, url, vmap = null, meta = null}) => {
            if (store.isPlayerSetup && store.playerInstance && store.playerInstance.load) {
                clearInterval(loadVideoTimeout);
                playVideo({id, url, vmap, meta});
            } else {
                //console.log('cannot find load method');
                loadVideoTimeout = setInterval(() => {
                    if(store.isPlayerSetup && store.playerInstance && store.playerInstance.load){
                        clearInterval(loadVideoTimeout);
                        playVideo({id, url, vmap, meta});
                    }
                }, 16);
            }
        },

        isVideoLoading: false,
        setIsVideoLoading: (isIt) => {
            store.isVideoLoading = isIt;
        },

        isAdRunning: false,
        setIsAdRunning: (isIt) => {
          store.isAdRunning = isIt;
        },

        playerInstance,
        setPlayerInstance: (plyrInst) => {
            store.playerInstance = plyrInst;
        },

        playerContainerRef,
        setPlayerContainerRef: (ref) => {
            store.playerContainerRef = ref;
        },
        siteWrapperRef,
        setSiteWrapperRef: (ref) => {
            store.siteWrapperRef = ref;
        },
        springServeId,
        setSpringServeId: (ssid) => {
            store.springServeId = ssid;
        },
    }
}

function InjectStoreContext({ children, initialData }) {
    store = useLocalStore(() => initializeData(initialData));
    fetchUser = useCallback(
        action(async () => {
            const {data} = await axios({
                method: 'GET',
                url: `/api/user`
            });
            store.user = data;
        }), []
    )
    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export { InjectStoreContext, StoreContext, initializeData, store, fetchUser }

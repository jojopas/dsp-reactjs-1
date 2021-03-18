import React from 'react';
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const elementID = 'g-recaptcha';

export default function Recaptcha({verifyCallback, expiredCallback}) {
  React.useEffect(() => {
    //Create a globally accessible function that the Recaptcha API can call on
    window.contactUsRecaptchaOnloadCallback = () => {
      console.log("window.onloadCallback has hit");
      grecaptcha.render(elementID, {
        sitekey: publicRuntimeConfig.GOOGLE_RECAPTCHA_SITEKEY,
        callback: (verifyCallback) ? verifyCallback : undefined,
        theme: "dark",
        type: "image",
        size: "normal",
        tabindex: 0,
        badge: "bottomright",
        "expired-callback": (expiredCallback) ? expiredCallback : undefined,
      })
    }

    //Load the script/dependency for the Recaptcha widget and attach an onload function 
    //https://developers.google.com/recaptcha/docs/display
    const script = document.createElement('script');
    script.src = "https://www.google.com/recaptcha/api.js?onload=contactUsRecaptchaOnloadCallback&render=explicit";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      //Remove the script when the page unloads
      document.body.removeChild(script);
      window.contactUsRecaptchaOnloadCallback = null;
    }
  }, []);

  return (
    <div id={elementID} />
  );
}
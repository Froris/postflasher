import { useState } from 'react';

// Injects the Facebook SDK into the page
const injectFbSDKScript = () => {
  (function (d, s, id) {
    const fjs = d.getElementsByTagName(s)[0] as HTMLScriptElement;
    if (d.getElementById(id)) {
      return;
    }
    const js = d.createElement(s) as HTMLScriptElement;
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    js.crossOrigin = 'anonymous';
    fjs.parentNode!.insertBefore(js, fjs);
  })(document, 'script', 'facebook-jssdk');
};

export const useInitFbSDK = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  injectFbSDKScript();

  // Initializes the SDK once the script has been loaded
  // https://developers.facebook.com/docs/javascript/quickstart/#loading
  window.fbAsyncInit = function () {
    window.FB.init({
      // Find your App ID on https://developers.facebook.com/apps/
      appId: import.meta.env.VITE_FB_APP_ID as string,
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v16.0',
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    window.FB.AppEvents.logPageView();
    setIsInitialized(true);
  };

  return isInitialized;
};

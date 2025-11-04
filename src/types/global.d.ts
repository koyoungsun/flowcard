declare global {
    interface Window {
      __unsubscribeAll__?: () => void;
    }
  }
  
  export {};
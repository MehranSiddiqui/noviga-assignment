
import { OfflineDataService } from "./offlineDataService";

interface Window {
  __FORCE_OFFLINE_MODE__?: boolean;
  __offlineModeController?: {
    enableOfflineMode: () => void;
    disableOfflineMode: () => void;
    toggleOfflineMode: () => void;
    clearOfflineCache: () => void;
    getOfflineModeStatus: () => boolean;
  };
}


export const enableOfflineMode = () => {
  (window as Window).__FORCE_OFFLINE_MODE__ = true;
  console.log("[Offline Mode] Offline mode enabled");
};


export const disableOfflineMode = () => {
  (window as Window).__FORCE_OFFLINE_MODE__ = false;
  console.log("[Offline Mode] Offline mode disabled");
};


export const toggleOfflineMode = () => {
  (window as Window).__FORCE_OFFLINE_MODE__ = !(window as Window)
    .__FORCE_OFFLINE_MODE__;
  const status = (window as Window).__FORCE_OFFLINE_MODE__
    ? "enabled"
    : "disabled";
  console.log(`[Offline Mode] Offline mode ${status}`);
};


export const clearOfflineCache = () => {

  OfflineDataService.clearCache();
};


export const getOfflineModeStatus = () => {
  return (window as Window).__FORCE_OFFLINE_MODE__ === true;
};


if (typeof (window as Window) !== "undefined") {
  (window as Window).__offlineModeController = {
    enableOfflineMode,
    disableOfflineMode,
    toggleOfflineMode,
    clearOfflineCache,
    getOfflineModeStatus,
  };
}

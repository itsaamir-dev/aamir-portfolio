// Light/dark theme: shared by the <head> boot script and the navbar toggle.
export const THEME_KEY = "bwa-theme";

/**
 * Runs in <head> before first paint so the page never flashes the wrong
 * theme: a saved choice wins, otherwise follow the device setting. The admin
 * panel has its own theme, so it's skipped there.
 */
export const themeBootScript = `(function(){try{if(location.pathname.indexOf('/admin')===0)return;var t=localStorage.getItem('${THEME_KEY}');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})()`;

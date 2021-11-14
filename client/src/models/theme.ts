import { message } from 'antd';
import { useState, useMemo, useCallback, useEffect } from 'react';
import lightVars from '@/styles/light.json';
import darkVars from '@/styles/dark.json';

type ThemeTypes = 'light' | 'dark';

export default () => {
  const [appTheme, setAppTheme] = useState<ThemeTypes>(
    (() => {
      const raw = localStorage.getItem('app-theme');
      if (!raw || !['light', 'dark'].includes(raw)) {
        const nonce = 'light';
        localStorage.setItem('app-theme', nonce);
        return nonce;
      } else {
        return localStorage.getItem('app-theme') as ThemeTypes;
      }
    })(),
  );

  const [customColors, setCustomColors] = useState<{ [key: string]: any }>(
    (() => {
      let raw = localStorage.getItem('app-colors');
      let nonce;
      if (!raw) {
        nonce = {};
        localStorage.setItem('app-colors', JSON.stringify(nonce));
        return nonce;
      } else {
        try {
          // fetch previous saved colors from local storage
          nonce = JSON.parse(raw);
        } catch (e) {
          // prevent error thrown by json.parse
          console.error('Failed parsing app colors from local storage');
          nonce = {};
        } finally {
          return nonce;
        }
      }
    })(),
  );

  const isLightTheme = useMemo(() => appTheme === 'light', [appTheme]);

  useEffect(() => {
    if (!['light', 'dark'].includes(appTheme)) {
      setAppTheme('light');
    }
    const next = {
      ...(isLightTheme ? lightVars : darkVars),
      ...customColors,
      '@white': '#fff',
      '@black': '#000',
    };

    // window.less.modifyVars(next).catch((error) => {
    //   message.error(`Failed to update theme`);
    // });

    requestIdleCallback(() =>
      window.less.modifyVars(next).catch((error) => {
        message.error(`Failed to update theme`);
      }),
    );

    localStorage.setItem('app-theme', appTheme);
    localStorage.setItem('app-colors', JSON.stringify(customColors));
  }, [appTheme]);

  useEffect(() => {
    let raw = localStorage.getItem('app-colors');
    let prev;
    if (!raw) {
      prev = {};
    } else {
      try {
        prev = JSON.parse(raw);
      } catch (e) {
        console.error('Failed parsing app colors from local storage');
        prev = {};
      }
    }

    const next = {
      ...(isLightTheme ? lightVars : darkVars),
      ...prev,
      ...customColors,
    };

    // window.less.modifyVars(next).catch((error) => {
    //   message.error(`Failed to update custom colors`);
    // });

    requestIdleCallback(() =>
      window.less.modifyVars(next).catch((error) => {
        message.error(`Failed to update custom colors`);
      }),
    );
    localStorage.setItem('app-colors', JSON.stringify(customColors));
  }, [customColors]);

  const resetAllThemes = useCallback(() => {
    requestIdleCallback(() =>
      window.less.modifyVars(lightVars).catch((error) => {
        message.error(`Failed to reset theme`);
      }),
    );
    localStorage.setItem('app-theme', 'light');
    localStorage.setItem('app-colors', '{}');
    setAppTheme('light');
    setCustomColors({});
  }, []);

  return {
    appTheme,
    setAppTheme,
    isLightTheme,
    customColors,
    setCustomColors,
    resetAllThemes,
  };
};

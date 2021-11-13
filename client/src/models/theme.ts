import { message } from 'antd';
import { useState, useMemo, useCallback, useEffect } from 'react';
import lightVars from '@/styles/light.json';
import darkVars from '@/styles/dark.json';

type ThemeTypes = 'light' | 'dark';

export default () => {
  const [appTheme, _setAppTheme] = useState<ThemeTypes>(
    (() => {
      debugger;
      const raw = localStorage.getItem('app-theme');
      if (!raw || !['light', 'dark'].includes(raw)) {
        const nonce = 'light';
        localStorage.setItem('app-theme', nonce);
        return nonce;
      } else {
        return localStorage.getItem('app-theme') as ThemeTypes;
      }
      // let initTheme: ThemeTypes;
      // try {
      //   initTheme = localStorage.getItem('app-theme') as ThemeTypes;
      // } catch (e) {
      //   // prevent error thrown by json.parse
      //   initTheme = 'light';
      // }
      // return initTheme;
    })(),
  );

  const isLightTheme = useMemo(() => {
    console.log('changed appTheme in isLightTheme: ', appTheme);
    console.log('isLightTheme: ', appTheme === 'light');
    return appTheme === 'light';
  }, [appTheme]);

  const getAppColors = useCallback(() => {
    if (!localStorage.getItem('app-colors')) {
      console.error('app color doesnt exist1111');
      localStorage.setItem('app-colors', JSON.stringify(lightVars));
    }
    return JSON.parse(localStorage.getItem('app-colors') as string);
  }, []);

  // init app themes colors from local storage
  useEffect(() => {
    let initColors;
    try {
      let serialized = localStorage.getItem('app-colors');
      if (!serialized) {
        initColors = lightVars;
      } else {
        // fetch previous saved colors from local storage
        initColors = Object.assign({}, JSON.parse(serialized));
      }
    } catch (e) {
      // prevent error thrown by json.parse
      initColors = lightVars;
    }
    // apply colors to pages
    setAppColors(initColors);
  }, []);

  // useEffect(() => {
  //   // console.log('appTheme: ', appTheme);
  //   // if (!['light', 'dark'].includes(appTheme)) {
  //   //   setAppTheme('light');
  //   // }
  //   let varsData = isLightTheme ? lightVars : darkVars;
  //   varsData = {
  //     ...varsData,
  //     '@white': '#fff',
  //     '@black': '#000',
  //   };
  //   localStorage.setItem('app-theme', appTheme);
  //   window.less.modifyVars(varsData).catch((error) => {
  //     message.error(`Failed to update theme`);
  //   });
  // }, [appTheme]);

  const setAppTheme = (theme) => {
    debugger;
    console.log('new appTheme: ', theme);
    if (!['light', 'dark'].includes(theme)) {
      theme = 'light';
    }
    let varsData = theme === 'light' ? lightVars : darkVars;
    varsData = {
      ...varsData,
      '@white': '#fff',
      '@black': '#000',
    };
    window.less.modifyVars(varsData).catch((error) => {
      message.error(`Failed to update theme`);
    });
    localStorage.setItem('app-theme', theme);
    localStorage.setItem('app-colors', JSON.stringify(varsData));
    _setAppTheme(theme);
  };

  const setAppColors = useCallback((varsData) => {
    // debugger;
    // console.log('colorsSet: ', colors);
    // console.log('isLightTheme: ', isLightTheme);
    // let varsData = isLightTheme ? lightVars : darkVars;
    // varsData = {
    //   ...varsData,
    //   ...colors,
    // };
    window.less.modifyVars(varsData).catch((error) => {
      message.error(`Failed to update theme`);
    });
    // sync to local storage
    localStorage.setItem('app-colors', JSON.stringify(varsData));
  }, []);

  const resetAllThemes = useCallback(() => {
    setAppTheme('light');
    localStorage.setItem('app-colors', '{}');
    window.less.modifyVars(lightVars).catch((error) => {
      message.error(`Failed to reset theme`);
    });
  }, []);

  return {
    appTheme,
    isLightTheme,
    setAppTheme,
    getAppColors,
    setAppColors,
    resetAllThemes,
  };
};

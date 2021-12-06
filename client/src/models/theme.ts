import { message } from 'antd';
import { useMemo, useCallback, useEffect } from 'react';
import lightVars from '@/styles/light.json';
import darkVars from '@/styles/dark.json';
import { useLocalStorageState, useUpdateEffect } from 'ahooks';

type ThemeTypes = 'light' | 'dark';

function normRawTheme(rawStr: string) {
  return (['light', 'dark'].includes(rawStr) ? rawStr : 'light') as ThemeTypes;
}
// https://beta-pro.ant.design/docs/simple-model-cn
export default () => {
  const [appTheme, setAppTheme] = useLocalStorageState<ThemeTypes>(
    'app-theme',
    {
      defaultValue: 'light',
      serializer: (v) => normRawTheme(v),
      deserializer: (v) => normRawTheme(v),
    },
  );

  const [customColors, setCustomColors] = useLocalStorageState<{
    [key: string]: any;
  }>('app-colors', {
    defaultValue: {},
  });

  const isLightTheme = useMemo(() => appTheme === 'light', [appTheme]);

  // load less file with app-color & app-theme patched in the localstorage, only once after first render.
  useEffect(() => {
    const newVars = {
      ...(isLightTheme ? lightVars : darkVars),
      ...customColors,
    };
    setTimeout(() => {
      window.less.modifyVars(newVars).catch((error) => {
        message.error(`Failed to init theme`);
      });
    });
  }, []);

  useUpdateEffect(() => {
    const next = {
      ...(isLightTheme ? lightVars : darkVars),
      ...customColors,
      // '@white': '#fff',
      // '@black': '#000',
    };
    window.less.modifyVars(next).catch((error) => {
      message.error(`Failed to update theme`);
    });
  }, [appTheme]);

  useUpdateEffect(() => {
    const next = {
      ...(isLightTheme ? lightVars : darkVars),
      ...customColors,
    };
    window.less.modifyVars(next).catch((error) => {
      message.error(`Failed to update custom colors`);
    });
  }, [customColors]);

  const resetAllThemes = useCallback(() => {
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

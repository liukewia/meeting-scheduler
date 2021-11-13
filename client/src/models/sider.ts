import { useState } from 'react';

export default () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return {
    isCollapsed,
    setIsCollapsed,
  };
};

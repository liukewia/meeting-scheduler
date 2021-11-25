import { useState } from 'react';

export default () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  return {
    isCollapsed,
    setIsCollapsed,
  };
};

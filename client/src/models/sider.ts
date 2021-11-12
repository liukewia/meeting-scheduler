import { useState } from 'react';
import {
  getSiderSelectedKeys,
  getSiderOpenedKeys,
  serializeSiderSelectedKeys,
  serializeSiderOpenedKeys,
} from '@/utils/model/siderUtils';

export default () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return {
    isCollapsed,
    setIsCollapsed,
    getSelectedKeys: getSiderSelectedKeys,
    setSelectedKeys: serializeSiderSelectedKeys,
    getOpenedKeys: getSiderOpenedKeys,
    setOpenedKeys: serializeSiderOpenedKeys,
  };
};

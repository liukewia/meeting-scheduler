import 'antd/dist/antd.css';
import Home from '@/pages/Home';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import '@/../public/color.less';

const IndexPage = () => {
  return (
    <ConfigProvider locale={enUS}>
      <Home />
    </ConfigProvider>
  );
};

export default IndexPage;

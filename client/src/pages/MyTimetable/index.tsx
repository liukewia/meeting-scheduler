import { Card, Col, PageHeader, Row } from 'antd';
import { SpacedContainer } from '@/components/SpacedContainer';
import Scheduler from './components/Scheduler';

export default () => {
  return (
    <>
      <PageHeader ghost={false} title="My Timetable"></PageHeader>
      <SpacedContainer>
        <Scheduler />
      </SpacedContainer>
    </>
  );
};

import { Suspense } from 'react';
import { Card, Col, PageHeader, Row } from 'antd';
import { SpacedContainer } from '@/components/SpacedContainer';
import Scheduler from './components/Scheduler';
import CenteredSpinner from '@/components/CenteredSpinner';

export default () => {
  return (
    <Suspense fallback={<CenteredSpinner tip="loading" />}>
      <PageHeader ghost={false} title="My Timetable"></PageHeader>
      <SpacedContainer>
        <Scheduler />
      </SpacedContainer>
    </Suspense>
  );
};

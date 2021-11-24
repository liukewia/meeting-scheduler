import { Suspense } from 'react';
import { Card, Col, PageHeader, Row } from 'antd';
import { SpacedContainer } from '@/components/SpacedContainer';
import Calendar from './components/Calendar';
import CenteredSpinner from '@/components/CenteredSpinner';

export default () => {
  return (
    <Suspense fallback={<CenteredSpinner tip="loading" />}>
      <PageHeader ghost={false} title="My Timetable"></PageHeader>
      <SpacedContainer>
        <Calendar />
      </SpacedContainer>
    </Suspense>
  );
};

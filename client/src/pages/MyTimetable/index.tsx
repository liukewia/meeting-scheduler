import { Suspense } from 'react';
import { Card, Col, PageHeader, Row } from 'antd';
import { SpacedContainer } from '@/components/SpacedContainer';
import Calendar from './components/Calendar';
import CenteredSpinner from '@/components/CenteredSpinner';

export default () => {
  return (
    <Suspense fallback={<CenteredSpinner tip="loading" />}>
      <PageHeader ghost={false} title="My Timetable">
        A user can create an event either by clicking the create button in the
        top right, or selecting a slot by dragging and dropping inside the
        timetable. A user can edit an event by double clicking it.
      </PageHeader>
      <SpacedContainer>
        <Calendar />
      </SpacedContainer>
    </Suspense>
  );
};

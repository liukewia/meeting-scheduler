import { Suspense } from 'react';
import { PageHeader, Typography } from 'antd';
import { SpacedContainer } from '@/components/SpacedContainer';
import Calendar from './components/Calendar';
import CenteredSpinner from '@/components/CenteredSpinner';

const { Paragraph } = Typography;

export default () => {
  return (
    <Suspense fallback={<CenteredSpinner tip="loading" />}>
      <PageHeader ghost={false} title="My Timetable">
        <Paragraph>
          <ul>
            <li>
              To create an event: either by clicking the create button in the
              top right, or selecting a slot by dragging and dropping on a
              available period inside the timetable.
            </li>
            <li>
              To edit an event: double clicking it to edit in a modal, or
              dragging its borders.
            </li>
          </ul>
        </Paragraph>
      </PageHeader>
      <SpacedContainer>
        <Calendar />
      </SpacedContainer>
    </Suspense>
  );
};

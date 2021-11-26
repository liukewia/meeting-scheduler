import { Card, Col, PageHeader, Row } from 'antd';
import { SpacedContainer } from '@/components/SpacedContainer';
import { useModel } from 'umi';
import { ONE_HOUR_MILLIS } from '@/constants';

export default function index() {
  const { initialState, setInitialState } = useModel('@@initialState');
  const utcOffset = initialState?.currentUser?.utcOffset;
  return (
    <>
      <PageHeader ghost={false} title="Home">
        This application manages one person's timetable and can find commonly
        available times for people to meet.
      </PageHeader>
      <SpacedContainer>
        <Card>
          <Row>
            <Col span={16} offset={4}>
              <h3>Good morning, Finn. You have 0 scheduled meetings today.</h3>
              {utcOffset !== undefined && (
                <h3>
                  Your registered time zone is UTC&nbsp;
                  {utcOffset > 0 ? '+' : null}
                  {utcOffset / ONE_HOUR_MILLIS}.
                </h3>
              )}
            </Col>
          </Row>
        </Card>
      </SpacedContainer>
    </>
  );
}

import { Card, Col, PageHeader, Row } from 'antd';
import { useModel } from 'umi';
import { SpacedContainer } from '@/components/SpacedContainer';
import { getCurrentTimePart, utcOffsetToTxt } from '@/utils/timeUtil';

export default function index() {
  const { initialState } = useModel('@@initialState');
  const username = initialState?.currentUser?.username;
  const utcOffset = initialState?.currentUser?.utcOffset || 0;

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
              <h3>
                Good {getCurrentTimePart(utcOffset)}, {username}. You have 0
                schedules today.
              </h3>
              <h3>
                The time zone you are in is&nbsp;
                {utcOffset !== undefined ? utcOffsetToTxt(utcOffset) : '...'}.
              </h3>
            </Col>
          </Row>
        </Card>
      </SpacedContainer>
    </>
  );
}

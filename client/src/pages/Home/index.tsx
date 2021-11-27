import { Card, Col, PageHeader, Row } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';
import { SpacedContainer } from '@/components/SpacedContainer';
import { ONE_HOUR_MILLIS } from '@/constants';

export default function index() {
  const { initialState } = useModel('@@initialState');
  const username = initialState?.currentUser?.username;
  const utcOffset = initialState?.currentUser?.utcOffset || 0;

  const getCurrentTimePart = (): string => {
    const hours = moment().hours() + utcOffset / ONE_HOUR_MILLIS;
    let time = '';
    if (hours < 12) {
      time = 'morning';
    } else if (hours < 18) {
      time = 'afternoon';
    } else {
      time = 'evening';
    }
    return time;
  };

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
              <h3>Good {getCurrentTimePart()}, {username}. You have 0 schedules today.</h3>
              {utcOffset !== undefined && (
                <h3>
                  The time zone you are in is UTC&nbsp;
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

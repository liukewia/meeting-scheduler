import { Card, Col, PageHeader, Row } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import { useRequest } from 'ahooks';
import { SpacedContainer } from '@/components/SpacedContainer';
import { utcOffsetToTxt } from '@/utils/timeUtil';
import { searchSchdule } from '@/services/schedule';

export default function index() {
  const { initialState } = useModel('@@initialState');
  const username = initialState?.currentUser?.username;
  const utcOffset = initialState?.currentUser?.utcOffset || 0;
  const { getUtcNow, getZonedUtcNow } = useModel('time');

  const { data: eventData } = useRequest(searchSchdule, {
    defaultParams: [
      {
        startTime: getUtcNow().startOf('day').valueOf(),
        endTime: getUtcNow().endOf('day').valueOf(),
      },
    ],
  });

  const getCurrentTimePart = (): string => {
    const hours = getZonedUtcNow().hours();
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
              <h3>
                Good {getCurrentTimePart()}, {username}. You have&nbsp;&nbsp;
                {eventData && eventData.schedules
                  ? eventData.schedules.length
                  : '...'}
                &nbsp;&nbsp;schedules today.
              </h3>
              <h3>
                The time zone you are in is&nbsp;&nbsp;
                {utcOffset !== undefined ? utcOffsetToTxt(utcOffset) : '...'}.
              </h3>
            </Col>
          </Row>
        </Card>
      </SpacedContainer>
    </>
  );
}

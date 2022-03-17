import { Card, Col, PageHeader, Row } from 'antd';
import moment from 'moment';
import { Link, useModel } from 'umi';
import { useRequest } from 'ahooks';
import { SpacedContainer } from '@/components/SpacedContainer';
import { utcOffsetToTxt } from '@/utils/timeUtil';
import { searchSchedule } from '@/services/schedule';
import { useMemo } from 'react';

export default function index() {
  const { initialState } = useModel('@@initialState');
  const username = initialState?.currentUser?.username;
  const utcOffset = initialState?.currentUser?.utcOffset || 0;
  const { getUtcNow, getZonedUtcNow } = useModel('time');

  const { data: eventData } = useRequest(searchSchedule, {
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

  const numOfSchedulesDone = (eventData?.schedules || []).filter((schedule) => {
    const end = moment.utc(schedule.endTime).valueOf();
    const now = getZonedUtcNow().valueOf();
    return end < now;
  }).length;

  const { numOfDone, numOfOngoing, numOfLast } = useMemo(() => {
    let numOfDone = -1;
    let numOfOngoing = -1;
    let numOfLast = -1;
    if (!eventData || !Array.isArray(eventData.schedules)) {
      return { numOfDone, numOfOngoing, numOfLast };
    }
    numOfDone = eventData.schedules.filter((schedule) => {
      const end = moment.utc(schedule.endTime).valueOf();
      const now = getZonedUtcNow().valueOf();
      return end < now;
    }).length;
    numOfOngoing = eventData.schedules.filter((schedule) => {
      const start = moment.utc(schedule.startTime).valueOf();
      const end = moment.utc(schedule.endTime).valueOf();
      const now = getZonedUtcNow().valueOf();
      return start <= now && end >= now;
    }).length;
    numOfLast = eventData.schedules.length - numOfDone - numOfOngoing;
    return { numOfDone, numOfOngoing, numOfLast };
  }, [eventData]);

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
                Good {getCurrentTimePart()}, {username}. You have finished&nbsp;
                {numOfDone === -1 ? '...' : numOfDone}
                &nbsp;schedules today,&nbsp;
                {numOfOngoing === -1 ? '...' : numOfOngoing}
                &nbsp;ongoing, and&nbsp;
                {numOfLast === -1 ? '...' : numOfLast}
                &nbsp;to go. More detail in&nbsp;
                <Link to="/timetable">My timetable</Link>.
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

import { Card, Col, PageHeader, Row } from 'antd';
import { SpacedContainer } from '@/components/SpacedContainer';
import { useRequest } from 'ahooks';
import { userIndex } from '@/services/user';
import { useEffect } from 'react';

export default function index() {
  // const { data, run } = useRequest(userIndex, {
  //   manual: true,
  // });

  // useEffect(() => {
  //   setTimeout(() => {
  //     run();
  //   }, 3000);
  // }, []);

  return (
    <>
      <PageHeader ghost={false} title="Home">
        This application manages one person's timetable and can find commonly
        available times for people to meet.
        {/* <div>{JSON.stringify(data)}</div> */}
      </PageHeader>
      <SpacedContainer>
        <Card>
          <Row>
            <Col span={16} offset={4}>
              <h3>Good morning, Finn. You have 0 scheduled meetings today.</h3>
            </Col>
          </Row>
        </Card>
      </SpacedContainer>
    </>
  );
}

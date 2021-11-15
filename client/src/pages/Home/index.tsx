import { Card, Col, PageHeader, Row } from 'antd';
import { SpacedContainer } from '@/components/SpacedContainer';

export default function index() {
  return (
    <>
      <PageHeader ghost={false} title="Home">
        This application manages one person's timetable and can find common
        available times for people to meet.
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

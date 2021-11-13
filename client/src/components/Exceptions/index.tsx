import { Button, Result } from 'antd';
import { history } from 'umi';

const Exception403 = () => (
  <Result
    className="vertical-flex-center"
    status="403"
    title="403"
    subTitle="Sorry, you don't have access to this page."
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Back to Homepage
      </Button>
    }
  />
);

const Exception404 = () => (
  <Result
    className="vertical-flex-center"
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Back to Homepage
      </Button>
    }
  />
);

const Exception500 = () => (
  <Result
    className="vertical-flex-center"
    status="500"
    title="500"
    subTitle="Sorry, something went wrong."
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Back to Homepage
      </Button>
    }
  />
);

export { Exception404, Exception403, Exception500 };

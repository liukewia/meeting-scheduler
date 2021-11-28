import { queryAllUsers } from '@/services/user';
import { utcOffsetToTxt } from '@/utils/timeUtil';
import { useRequest } from 'ahooks';
import { message, Select } from 'antd';
import { useEffect, useState } from 'react';
import './index.less';

const { Option } = Select;

interface UserInfo {
  id: number;
  username: string;
  avatar: string;
  utcOffset: number;
}

interface UserSelectorProps {
  onChange: (users: string[]) => void;
}

export default (props: UserSelectorProps) => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [currInput, setCurrInput] = useState('');

  const { data, loading } = useRequest(queryAllUsers, {
    debounceWait: 100,
    onSuccess: () => {
      setUsers(data.users || []);
    },
    onError: () => {
      message.error('Fetch all users failed.');
    },
  });

  const handleChange = (value: any) => {
    console.log(value);
    props.onChange?.(value);
  };

  useEffect(() => {
    setUsers(
      users.filter((user) => user.username.includes(currInput)).slice(0, 10),
    );
  }, [currInput]);

  return (
    <Select
      mode="multiple"
      style={{ width: '100%' }}
      placeholder="Please select at least two"
      onSearch={setCurrInput}
      onChange={handleChange}
      loading={loading}
      allowClear
    >
      {data?.users?.map((user: UserInfo) => (
        <Option key={user.id} value={user.id} label={user.username}>
          <img
            className="user-avatar"
            alt={`${user.username}-avatar`}
            src={user.avatar}
          />
          {user.username}
          <span style={{ float: 'right' }}>
            (
            {user.utcOffset !== undefined
              ? utcOffsetToTxt(user.utcOffset)
              : '...'}
            )&nbsp;&nbsp;
          </span>
        </Option>
      ))}
    </Select>
  );
};

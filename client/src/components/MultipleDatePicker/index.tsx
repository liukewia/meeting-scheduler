import { useState } from 'react';
import { Tag, DatePicker, Select } from 'antd';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import './index.less';

function getTimestamp(value) {
  return value.startOf('day').valueOf();
}

export default function MultipleDatePicker({
  value: selectedDate = [],
  onChange,
  format = 'DD/MM/YYYY',
  selectProps = {},
  datePickerProps = {},
}) {
  const [open, setOpen] = useState(false);

  const onValueChange = (date) => {
    const t = getTimestamp(date);
    const index = selectedDate.indexOf(t);
    const cloned = cloneDeep(selectedDate);
    if (index > -1) {
      cloned.splice(index, 1);
    } else {
      cloned.push(t);
    }
    onChange && onChange(cloned);
  };

  const dateRender = (currentDate) => {
    const isSelected = selectedDate.indexOf(getTimestamp(currentDate)) > -1;
    return (
      <div
        className={'ant-picker-cell-inner'}
        style={
          isSelected
            ? {
                position: 'relative',
                zIndex: 2,
                display: 'inlineBlock',
                width: '24px',
                height: '22px',
                lineHeight: '22px',
                backgroundColor: '#1890ff',
                color: '#fff',
                margin: 'auto',
                borderRadius: '2px',
                transition: 'background 0.3s, border 0.3s',
              }
            : {}
        }
      >
        {currentDate.date()}
      </div>
    );
  };

  const renderTag = ({ value, onClose }) => {
    const handleClose = () => {
      onClose();
      onChange && onChange(selectedDate.filter((t) => t !== value));
    };
    return (
      <Tag onClose={handleClose} closable>
        {moment(value).format(format)}
      </Tag>
    );
  };

  return (
    <Select
      allowClear
      placeholder={'Please select at least one date'}
      {...selectProps}
      mode="multiple"
      value={selectedDate}
      onClear={() => onChange && onChange([])}
      tagRender={renderTag}
      open={open}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      dropdownMatchSelectWidth={false}
      dropdownClassName={'multipleDropdownClassName'}
      dropdownStyle={{ height: '270px', width: '280px', minWidth: '0' }}
      dropdownRender={() => {
        return (
          <DatePicker
            {...datePickerProps}
            format={(value) => ''}
            onChange={onValueChange}
            value={''}
            showToday={false}
            open
            dateRender={dateRender}
            style={{ ...datePickerProps.style, visibility: 'hidden' }}
            getPopupContainer={(): any =>
              document.getElementsByClassName('multipleDropdownClassName')[0]
            }
          />
        );
      }}
    />
  );
}

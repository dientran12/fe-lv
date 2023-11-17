import { Select, Space } from 'antd'
import React from 'react'

const InputSelectTagPickerComponent = ({ onChange, options, values }) => {
    return (
        <Space
            style={{
                width: '100%',
            }}
            direction="vertical"
        >
            <Select
                size="large"
                mode="multiple"
                allowClear
                style={{
                    width: '100%',
                }}
                placeholder="Please select"
                onChange={onChange}
                options={options}
                value={values}
            />
        </Space>
    );
};


export default InputSelectTagPickerComponent

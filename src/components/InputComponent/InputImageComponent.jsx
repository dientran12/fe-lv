import { Form, Input, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { getBase64 } from '~/utils';

const InputImageComponent = ({ onChangeUrl }) => {
    const [image, setImage] = useState(null);

    const handleFileChange = info => {
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, imageUrl => {
                setImage(imageUrl);
                onChangeUrl(imageUrl);
            });
        }
    };

    return (
        <Form.Item
            label="Upload Image"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={e => e.fileList}
            rules={[
                {
                    required: true,
                    message: 'Please upload an image!',
                },
            ]}
        >
            <Upload
                name="image"
                listType="picture"
                onChange={handleFileChange}
                beforeUpload={() => false}
            >
                <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
        </Form.Item>
    );
};

export default InputImageComponent;

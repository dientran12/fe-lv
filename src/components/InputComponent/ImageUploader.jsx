import { Input } from 'antd';
import { MDBIcon } from 'mdb-react-ui-kit';
import React, { useEffect, useRef, useState } from 'react';

const ImageUploader = ({ onImageChange, value }) => {
    const fileInputRef = useRef(null);
    const [image, setImage] = useState(value);

    const handleChooseFile = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageURL = event.target.result;
                setImage(imageURL);
                onImageChange(imageURL);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <div className=''>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <div>
                    {/* <MDBIcon fas icon="download" onClick={handleChooseFile} className="me-3 bg-black">New Avatar</MDBIcon> */}
                    <div className="p-1 bg-hover-green  text-center" style={{ backgroundColor: '#55a0f5', borderRadius: '5px', color: '#fff', fontSize: '14px', cursor: 'pointer' }} onClick={handleChooseFile}  ><MDBIcon fas icon="download" /> Choose image</div>

                    {/* Input ẩn để giữ giá trị */}
                    <Input type="hidden" value={image} />
                </div>
            </div>
        </div>
    );
}

export default ImageUploader;

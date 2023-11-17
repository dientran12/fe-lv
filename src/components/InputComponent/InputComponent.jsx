import React, { useState } from 'react';
import { MDBInput } from 'mdb-react-ui-kit';

export default function InputComponent({ size, placeholder, ...rest }) {
    const [inputValue, setInputValue] = useState(''); // Khởi tạo giá trị ban đầu của input

    const handleInputChange = (event) => {
        const { value } = event.target;
        setInputValue(value);

        // Đây là nơi bạn có thể thực hiện các xử lý khác sau khi giá trị input thay đổi
    };
    console.log("On change", inputValue)
    return (
        <div>
            <MDBInput
                label={placeholder}
                id='form1'
                type='text'
                value={inputValue} // Gán giá trị của input
                onChange={handleInputChange} // Bắt sự kiện onchange và gọi hàm xử lý handleInputChange
                {...rest}
            />
            {/* Hiển thị giá trị input */}
            <p>Giá trị input: {inputValue}</p>
        </div>
    );
}

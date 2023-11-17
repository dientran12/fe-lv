import { MDBBtn, MDBInput } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react';
function InputQuantityDetailProduct({ onValueChange, minValue, maxValue, selectedSize, activeIndex }) {
    const [value, setValue] = useState(minValue);
    const handleValueChange = (newValue) => {
        setValue(newValue);
        onValueChange(newValue); // Gọi hàm gọi lại với giá trị mới
    };

    useEffect(() => {
        handleValueChange(minValue)
    }, [selectedSize, activeIndex, minValue]);


    const increment = () => {
        handleValueChange(value + 1 <= maxValue ? value + 1 : value);
    };

    const decrement = () => {
        handleValueChange(value > minValue ? value - 1 : value);
    };

    const handleInputChange = (event) => {
        const newValue = parseInt(event.target.value, 10);
        if (!isNaN(newValue) && newValue >= minValue && newValue <= maxValue) {
            handleValueChange(newValue);
        }
    };

    return (
        <div className="input-group mb-3">
            <MDBBtn
                color="black"
                outline
                className="border border-secondary px-3"
                type="button"
                onClick={decrement}
                ripple="dark"
            >
                <i className="fas fa-minus"></i>
            </MDBBtn>

            <MDBInput
                type="text"
                color="black"
                value={value}
                onChange={handleInputChange}
                className="form-control text-center border border-secondary"
            />

            <MDBBtn
                color="black"
                outline
                className="border border-secondary px-3"
                type="button"
                onClick={increment}
                ripple="dark"
            >
                <i className="fas fa-plus"></i>
            </MDBBtn>
        </div>
    );
}

export default InputQuantityDetailProduct;

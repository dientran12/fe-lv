import { MDBBtn, MDBModalBody, MDBRow } from 'mdb-react-ui-kit'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ModalComponent from '../ModalComponent/ModalComponent';

const ButtonBuyProduct = ({ disabled = false, onBuyClick }) => {
    const navigate = useNavigate();

    const handleOnClickBuy = async () => {
        // Gọi hàm xử lý khi người dùng nhấn mua
        onBuyClick();
        const dataBuy = await onBuyClick();
        console.log('dataBuy', dataBuy);
        navigate('/payment', { state: { dataBuy } });
    };

    return (
        <>
            <MDBBtn className="bg-error" color='success' onClick={handleOnClickBuy} disabled={disabled}>
                Buy Now
            </MDBBtn>
        </>
    )
}

export default ButtonBuyProduct

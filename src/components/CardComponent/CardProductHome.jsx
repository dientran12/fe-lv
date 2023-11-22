import React from 'react';
import {
    MDBCard,
    MDBCardBody,
    MDBBtn,
    MDBTypography,
    MDBRow,
    MDBCardFooter,
    MDBRipple
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

export default function CardProductHome({ product }) {
    const maxLength = 17;
    const displayName = product?.name.length > maxLength ? `${product?.name.substring(0, maxLength)}...` : product?.name;

    const navigate = useNavigate()
    return (
        <div className="d-flex justify-content-center w-100">
            <MDBCard className='cardHover ' style={{ width: '100%', maxWidth: "300px", minHeight: '350px' }} >
                <MDBRipple rippleTag='a' className='bg-image hover-zoom'>
                    <img
                        src={product?.image || 'https://cdn2.yame.vn/pimg/ao-thun-co-tron-toi-gian-m20-0021275/96b9c802-a685-0100-92af-0019afaf3031.jpg?w=540&h=756'}
                        className='img-fluid rounded'
                        position='top'
                        style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                        alt='thumbnail'
                    />
                </MDBRipple>
                <MDBCardBody className='d-flex flex-column justify-content-between p-2'>
                    <div >
                        <MDBTypography tag='h6'>{displayName}</MDBTypography>
                        <MDBTypography className='me-2' tag='strong' style={{ color: '#F44336' }}  >
                            {product?.discountedPrice ? product?.discountedPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : product?.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </MDBTypography>
                        {product?.discountedPrice &&
                            <MDBTypography tag='s'>
                                {product?.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </MDBTypography>
                        }
                    </div>
                </MDBCardBody>
                <MDBCardFooter className='d-flex justify-content-center'>
                    <MDBRow className='w-75 '>
                        <MDBBtn color='dark' className='p-2 bg-hover-red' onClick={() => navigate(`/detail-product/${product?.id}`)}>Details</MDBBtn>
                    </MDBRow>
                </MDBCardFooter>
            </MDBCard>
        </div>
    );
}

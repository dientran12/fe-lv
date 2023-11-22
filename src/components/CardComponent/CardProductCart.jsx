import React, { useState } from 'react';
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCheckbox,
    MDBIcon,
    MDBInput,
    MDBTypography,
} from "mdb-react-ui-kit";
import { useCustomMutation } from '~/hooks/useMutationHook';
import * as CartService from '~/services/CartService'
import { useSelector } from 'react-redux';
import { formatCurrency } from '~/utils';


const CardProductCart = ({ item, index, isChecked, onCheckboxChange, onQuantityChange, queryCartItems }) => {
    const user = useSelector((state) => {
        return state?.user
    })
    const displayName = item.productdata.Version.Product.name.length > 15 ? `${item.productdata.Version.Product.name.substring(0, 15)}...` : item.productdata.Version.Product.name;

    // const [checkedItem, setCheckedItem] = useState(isChecked);
    const [quantityValue, setQuantityValue] = useState(item?.quantity);

    const mutationDeleted = useCustomMutation(
        (data) => CartService.deleteProductOnCart(data)
    )

    const handleOnChangeQuantity = (e) => {
        // console.log("e", e.target.value)
        setQuantityValue(e.target.value)
        onQuantityChange(index, e.target.value)
    }

    const handleCheckboxChange = (value) => {
        // console.log("checked ", value)
        // setCheckedItem(value)
        onCheckboxChange(index, value)
    }

    const handleOnDelete = () => {
        mutationDeleted.mutate({
            userId: user?.id,
            token: user.accessToken,
            sizeItemId: item?.sizeItemId
        }, {
            onSettled: () => {
                queryCartItems.refetch()
            }
        })
    }

    return (
        <MDBCard className="mb-3 box-shadowColor hover-item">
            <MDBCardBody className='p-2'>
                <div className="d-flex align-items-center">
                    <div className="d-flex flex-row flex-shrink-0 align-items-center">
                        <MDBCheckbox
                            name='flexCheck'
                            id='flexCheckDefault'
                            className='mx-3'
                            checked={isChecked}
                            onChange={(e) => handleCheckboxChange(e.target.checked)}
                        />
                        <div>
                            <MDBCardImage
                                src={item.productdata.Version.image}
                                className="rounded-3"
                                style={{ maxWidth: "100px" }}
                                alt="Shopping item"
                            />
                        </div>
                        <div className="mx-3 d-flex flex-column" style={{ maxWidth: "200px" }}>
                            <MDBTypography tag="dt" className="mb-2">{displayName}</MDBTypography>
                            <div className="d-flex flex-row " style={{ fontStyle: "italic" }}>
                                <MDBTypography tag="h6" className="me-1 ">
                                    Size: <span className="textColorRed">{item.productdata.Size.sizeName}</span>
                                </MDBTypography>
                                <MDBTypography tag="h6" className="mb-0 ">
                                    Color: <span className="textColorRed">{item.productdata?.Version?.Color?.colorname}</span>
                                </MDBTypography>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-row flex-grow-1  align-items-center">
                        <div className="d-flex flex-column align-items-center">
                            {item?.discountedPrice &&
                                <MDBTypography tag='s' className="mb-0">
                                    {formatCurrency(item?.productdata?.Version?.Product?.price)}
                                </MDBTypography>
                            }
                            <MDBTypography tag="h6" className="mb-0" style={{ color: '#F44336' }}>
                                {formatCurrency(item?.discountedPrice || item?.productdata?.Version?.Product?.price)}
                            </MDBTypography>
                        </div>
                        <div className="mx-1">x</div>
                        <div className="d-flex align-items-center mx-2" style={{ minWidth: "20px", maxWidth: "50px" }}>
                            <MDBInput
                                type="number"
                                min="1"
                                value={quantityValue}
                                onChange={(e) => handleOnChangeQuantity(e)}
                                size="sm"
                            />
                        </div>
                    </div>
                    <MDBTypography tag="h6" className="mb-0 text-danger">
                        {formatCurrency(item?.discountedPrice ? item?.discountedPrice * quantityValue : item?.productdata?.Version?.Product?.price * quantityValue)}
                    </MDBTypography>
                    <MDBIcon className="color-hover-green px-4 py-2" size='xl' fas icon="trash" onClick={handleOnDelete} style={{ color: 'red', cursor: 'pointer' }} />
                </div>
            </MDBCardBody>
        </MDBCard>
    );
};

export default CardProductCart;

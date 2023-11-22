import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBInputGroup,
    MDBTypography,
    MDBBtn,
    MDBIcon,
    MDBInput,
    MDBCardImage,
    MDBCard,
    MDBCardHeader,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCardFooter,
    MDBModalBody,
} from 'mdb-react-ui-kit';
import { useSelector } from 'react-redux';
import { formatCurrency } from '~/utils';
import LoadingHasChil from '~/components/LoadingComponent/LoadingHasChil';
import * as OrderService from '~/services/OrderService'
import { useCustomMutation } from '~/hooks/useMutationHook';
import { Select } from 'antd';
import { toast } from 'react-toastify';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import { Button, Modal } from 'rsuite';
import RemindIcon from '@rsuite/icons/legacy/Remind';
import CheckCircleIcon from '@rsuite/icons/legacy/CheckCircle';

const PagementPage = () => {
    const location = useLocation();
    const { state } = location;
    const { dataBuy } = state || [];
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalOpenSuccess, setIsModalOpenSuccess] = useState(false)
    const [isLoadingOrder, setIsLoadingOrder] = useState(false)
    const navigate = useNavigate()
    const user = useSelector((state) => {
        return state?.user
    })
    const [selectedValue, setSelectedValue] = useState("PayPal");
    const handleChange = (value) => {
        setSelectedValue(value);
    };
    const newDataArray = dataBuy && dataBuy?.map(item => ({
        versionId: item?.versionId,
        sellingPrice: item?.sellingPrice,
        sizeItems: item?.sizeItems,
    }));

    const uniqueItemsMap = new Map();

    dataBuy && dataBuy?.forEach((item) => {
        const { versionId, image, sellingPrice, price, sizeItems } = item;

        // Check if versionId already exists in the map
        if (uniqueItemsMap.has(versionId)) {
            // If yes, merge sizeItems
            uniqueItemsMap.get(versionId).sizeItems.push(...sizeItems);
        } else {
            // If no, add the item to the map
            uniqueItemsMap.set(versionId, { versionId, sellingPrice, price, image, sizeItems: [...sizeItems] });
        }
    });

    const mergedDataBuy = Array.from(uniqueItemsMap.values());

    let dataProductOrder = mergedDataBuy.map(item => {
        // Tính tổng quantity trong sizeItems
        let totalQuantity = item.sizeItems.reduce((acc, sizeItem) => acc + sizeItem.quantity, 0);

        // Tạo một bản sao của item và thêm trường total
        return {
            ...item,
            total: totalQuantity
        };
    });

    console.log("dataprodcut", dataProductOrder);
    let totalPrice = dataProductOrder.reduce((acc, product) => {
        return acc + (product.sellingPrice * product.total);
    }, 0);

    console.log(totalPrice);


    const handleGoProfile = () => {

    }

    const mutationCreateOrder = useCustomMutation(
        data => OrderService.createOreder(data)
    )


    const { data, isLoading, isSuccess, isError } = mutationCreateOrder;

    console.log('data', data)

    useEffect(() => {
        console.log('isSuccess', isSuccess, 'isError', isError);
        if (isSuccess) {
            toast.success('Order is successfully ', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
            setIsModalOpenSuccess(true)
            // resetValue()
        } else if (isError) {
            toast.error(<div>Order failed</div>, {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
        mutationCreateOrder.reset();
    }, [isSuccess, isError])

    const handleOnclickOrder = () => {
        setIsLoadingOrder(true)
        const newArrayWithSelectedFields = newDataArray?.flatMap(item =>
            item.sizeItems.map(sizeItem => ({
                sizeItemId: sizeItem?.sizeItemId,
                quantity: sizeItem.quantity
            }))
        );

        console.log('data req', newArrayWithSelectedFields);
        console.log('newDataArray', newDataArray);


        if (user) {
            if (!user?.phone || !user?.address) {
                setIsModalOpen(true);
                return
            }
            const data = {
                token: user.accessToken,
                userId: user.id,
                items: newArrayWithSelectedFields,
                paymentMethod: selectedValue
            }
            console.log('data', data)
            mutationCreateOrder.mutate({
                ...data
            })
        }
    }
    return (
        <MDBContainer className="mb-4">
            <div className=" pt-3 px-5 titleMyCartContent bg-white mb-4">
                Payment
                <hr className="my-3 pb-4" />
            </div>

            <LoadingHasChil isLoading={isLoading}>
                <MDBRow className="">
                    <MDBCol lg="6" >
                        <MDBCard alignment='center' >
                            <MDBCardHeader>
                                <MDBTypography tag="dt" className="fs-4 ">
                                    Products
                                </MDBTypography>
                            </MDBCardHeader>
                            {dataProductOrder && dataProductOrder?.map((item, index) => (
                                <MDBCardBody className='text-start' key={index}>
                                    <MDBRow >
                                        <MDBCol size="3">
                                            <MDBCardImage
                                                src={item?.image}
                                                className="rounded-3"
                                                style={{ maxWidth: "100px" }}
                                                alt="Shopping item"
                                            />
                                        </MDBCol>
                                        <MDBCol size="9" className="d-flex flex-row" >
                                            <MDBCol size="3" className="d-flex flex-column">
                                                {
                                                    item?.sizeItems?.map((sizeItem, index) => (
                                                        <div key={index}>
                                                            <div className="d-inline flex-grow-1 me-2" >
                                                                {sizeItem?.sizeName} x {sizeItem?.quantity}
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </MDBCol>
                                            <MDBCol size="9">
                                                <div className="flex-shrink-0 d-flex align-items-center">
                                                    <div className=" d-flex flex-column">
                                                        {item?.sellingPrice !== item?.price &&
                                                            <MDBTypography tag='s' className="mb-0">
                                                                {formatCurrency(item?.price)}
                                                            </MDBTypography>
                                                        }
                                                        <span className="textColorRed me-2">{formatCurrency(item?.sellingPrice)} </span>
                                                    </div>
                                                    x {item?.total} =
                                                    <span className="textColorRed ms-1 fs-5">{formatCurrency(item?.sellingPrice * item?.total)}</span>
                                                </div>
                                            </MDBCol>
                                        </MDBCol>
                                    </MDBRow>
                                </MDBCardBody>
                            ))
                            }
                        </MDBCard>
                    </MDBCol>
                    <MDBCol lg="6" >
                        <MDBCard alignment='center' style={{ minHeight: 500 }}>
                            <MDBCardHeader>
                                <MDBTypography tag="dt" className="fs-4 ">
                                    Order Information
                                </MDBTypography>
                            </MDBCardHeader>

                            <MDBCardBody className='text-start '>
                                <MDBRow className="">
                                    <MDBCol size="4">
                                        <MDBTypography tag="dt">
                                            Full Name:
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="8" className="mb-1">
                                        <MDBTypography tag="dd" >
                                            {user?.name?.trim()}
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="4">
                                        <MDBTypography tag="dt">
                                            Phone:
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="8" className="mb-1">
                                        <MDBTypography tag="dd" >
                                            {user?.phone || "You do not have a delivery address yet"}
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="4">
                                        <MDBTypography tag="dt">
                                            Email:
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="8" className="mb-1">
                                        <MDBTypography tag="dd" >
                                            {user?.email?.trim() || "You do not have a delivery address yet"}
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="4">
                                        <MDBTypography tag="dt">
                                            Shipping Address:
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="8" className="mb-1">
                                        <MDBTypography tag="dd" >
                                            {user?.address?.trim() || "You do not have a delivery address yet"}
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="4">
                                        <MDBTypography tag="dt">
                                            Payment Method:
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="8" className="mb-1">
                                        <Select placeholder="Select your payment method" size="large" style={{ width: "100%" }} value={selectedValue} onChange={handleChange}>
                                            <Select.Option value="PayPal">PayPal</Select.Option>
                                            <Select.Option value="Credit Card">Credit Card</Select.Option>
                                        </Select>
                                    </MDBCol>
                                    <MDBCol size="4">
                                        <MDBTypography tag="dt">
                                            Total Amount:
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="8" className="mb-1">
                                        <MDBTypography tag="dd" >
                                            <span className="textColorRed ms-1 fs-4 ms-2">{formatCurrency(totalPrice)}</span>
                                        </MDBTypography>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>
                            <MDBCardFooter>
                                <MDBBtn color="warning" onClick={handleOnclickOrder}>Order Now</MDBBtn>
                            </MDBCardFooter>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </LoadingHasChil>
            <Modal open={isModalOpen} size='xs' onClose={() => { setIsModalOpen(false) }}>
                <Modal.Body className='d-flex justify-content-start align-items-center'>
                    <RemindIcon className="me-2" style={{ color: '#ffb300', fontSize: 24 }} />
                    <MDBTypography className="h6 mb-0">Incomplete contact information</MDBTypography>
                </Modal.Body>
                <Modal.Footer>
                    <Button backdrop="static" onClick={() => navigate('/profile-user')} role="alertdialog" color="yellow" appearance="primary">
                        Edit Profile
                    </Button>
                    <Button onClick={() => { setIsModalOpen(false) }} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal open={isModalOpenSuccess} size='sm' onClose={() => { setIsModalOpenSuccess(false) }}>
                <Modal.Body >
                    <div className='d-flex justify-content-start align-items-center mb-3'>
                        <CheckCircleIcon className="me-2" style={{ color: 'green', fontSize: 24 }} />
                        <MDBTypography tag="dt" className=" mb-0">You have successfully placed an order</MDBTypography>
                    </div>
                    <MDBTypography tag="dt" className="text-center h5">Please check your email for further details. <br />
                        Thank you for your purchase!</MDBTypography>
                </Modal.Body>
                <Modal.Footer>
                    <Button backdrop="static" onClick={() => { setIsModalOpenSuccess(false) }} role="alertdialog" color="yellow" appearance="primary">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </MDBContainer >
    )
}

export default PagementPage

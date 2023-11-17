import React, { useEffect, useState } from 'react'
import { MDBBtn, MDBCard, MDBCardBody, MDBCardFooter, MDBCardImage, MDBCardText, MDBCol, MDBContainer, MDBIcon, MDBInput, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle, MDBRow, MDBValidation, MDBValidationItem } from 'mdb-react-ui-kit';

import TableComponent from '../TableComponent/TableComponent';
import { useSelector } from 'react-redux';
import Loading from '../LoadingComponent/Loading';
import { useCustomMutation } from '~/hooks/useMutationHook';
import * as CateService from '~/services/CateService'
import { toast } from 'react-toastify';
import { Form, Input, Select } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import CardCateComponent from '../CardComponent/CardCateComponent';
import ModalComponent from '../ModalComponent/ModalComponent';
import LoadingHasChil from '../LoadingComponent/LoadingHasChil';

const CategoryProductComponent = () => {
    const user = useSelector((state) => {
        return state?.user
    })
    const [staticModal, setStaticModal] = useState(false);

    const toggleShow = () => {
        setStaticModal(!staticModal);
        form.resetFields();
    };
    const navigate = useNavigate()
    const mutationCreCate = useCustomMutation(
        data => CateService.createCate(data)
    )
    const { data: dataCreate, isLoading: isLoadingCreate, isSuccess: isSuccessCreate, isError: isErrorCreate } = mutationCreCate;
    useEffect(() => {
        if (isSuccessCreate) {
            toast.success('Created new category ', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
            toggleShow()
        } else if (isErrorCreate) {
            toast.error(<div>{dataCreate?.message}</div>, {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
        mutationCreCate.reset();
    }, [isSuccessCreate, isErrorCreate])
    const [form] = Form.useForm();
    const onFinish = (values) => {
        // Gọi API khi form đã hợp lệ
        mutationCreCate.mutate({
            token: user?.accessToken,
            categoryName: values.name,
        }, {
            onSettled: () => {
                queryCate.refetch()
            }
        });
    };

    // Get all categories
    const getAllCates = async () => {
        const res = await CateService.getAllCate()
        return res
    }

    const queryCate = useQuery({ queryKey: ['cates'], queryFn: getAllCates })
    const { isLoading: isLoadingCate, data: cates } = queryCate

    console.log("cates", cates)

    return (
        <MDBContainer className="pb-3 px-0 mx-2">
            <LoadingHasChil isLoading={isLoadingCate}>
                <div className="p-3" style={{ backgroundColor: 'white' }}>
                    <span className="h2 fw-bold mb-0">Categories
                        <hr className="mt-3" /></span>
                    <div style={{ marginTop: 10 }}>
                        <MDBBtn onClick={toggleShow} className="btn-create rounded-3" color='dark' style={{ height: '150px', width: '150px', border: '1px outset   ' }}><MDBIcon fas icon="plus" size="3x" /></MDBBtn>
                    </div>
                </div>
                <MDBRow >
                    {cates?.categories.map((cate, index) => (
                        <MDBCol key={index} className='mt-5' xl="3" lg="4" sm="6">
                            <CardCateComponent id={cate?.id} name={cate?.categoryName} token={user?.accessToken} query={queryCate} />
                        </MDBCol>
                    ))}
                </MDBRow>
            </LoadingHasChil>
            <Form
                form={form}
                name="validate_input"
                onFinish={onFinish}
                autoComplete="off"
            >

                <MDBModal staticBackdrop tabIndex='-1' show={staticModal} setShow={setStaticModal} >
                    <MDBModalDialog size="">
                        <MDBModalContent>
                            <MDBModalHeader>
                                <MDBModalTitle>Add New Category</MDBModalTitle>
                                <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                            </MDBModalHeader>
                            <MDBModalBody className='d-flex justify-content-center'>
                                <div className='w-75'>
                                    <MDBRow>
                                        <MDBCol sm="2">
                                            <p style={{ fontSize: '16px' }}>Name</p>
                                        </MDBCol>
                                        <MDBCol sm="10">
                                            <Form.Item
                                                name="name"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input your phone number!',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Name category" size="large" />
                                            </Form.Item>
                                        </MDBCol>
                                    </MDBRow>
                                </div>
                            </MDBModalBody>
                            <MDBModalFooter>
                                <MDBBtn color='info' style={{ width: '120px' }}>
                                    <Loading isLoading={isLoadingCreate}>
                                        Add
                                    </Loading>
                                </MDBBtn>
                                <MDBBtn color='light' onClick={toggleShow} style={{ width: '120px' }}>
                                    Close
                                </MDBBtn>
                            </MDBModalFooter>
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>
            </Form>

        </MDBContainer>
    )
}

export default CategoryProductComponent

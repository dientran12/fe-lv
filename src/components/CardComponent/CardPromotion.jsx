import React, { useEffect, useState } from 'react';
import * as PromotionService from '~/services/PromotionService'

import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCardHeader,
    MDBCardFooter,
    MDBIcon,
    MDBModalBody,
    MDBRow,
    MDBCol
} from 'mdb-react-ui-kit';
import ModalComponent from '../ModalComponent/ModalComponent';
import { Form, Input } from 'antd';
import { useCustomMutation } from '~/hooks/useMutationHook';
import { toast } from 'react-toastify';
import ModalDeleteComponent from '../ModalComponent/ModalDeleteComponent';
import { useNavigate } from 'react-router-dom';
import TextArea from 'antd/es/input/TextArea';
import { MaskedInput } from 'rsuite';

const CardPromotion = ({ dataItem, token = "", query = "" }) => {
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const maxLength = 12; // Bạn có thể điều chỉnh giá trị này
    const displayName = dataItem?.name?.length > maxLength ? `${dataItem?.name.substring(0, maxLength)}...` : dataItem?.name;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleDeleteProduct = () => {
        mutationDeleted.mutate({ id: dataItem?.id, token: token }, {
            onSettled: () => {
                query.refetch()
            }
        });
        setOpenModalDelete(false)
    }

    const mutationDeleted = useCustomMutation(
        (data) => {
            const { id,
                token
            } = data
            const res = PromotionService.deletePromotion(
                id,
                token
            )
            return res
        }
    )

    const mutation = useCustomMutation(
        (data) => {
            const res = PromotionService.updatePromotion(
                data
            )
            return res
        }
    )

    const { data, isLoading, isSuccess, isError } = mutation;
    const { isLoading: isLoadingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete } = mutationDeleted;

    useEffect(() => {
        if (isSuccess) {
            toast.success('Saved successfully', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        } else if (isError) {
            toast.error('Saved failed', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
            mutation.reset();
        }
    }, [isSuccess, isError])

    useEffect(() => {
        if (isSuccessDelete) {
            toast.success('Delete successfully', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        } else if (isErrorDelete) {
            toast.error('Delete failed', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
            mutation.reset();
        }
    }, [isSuccessDelete, isErrorDelete])

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 14,
        },
    };

    const handleSubmitEdit = () => {
        form.validateFields().then((values) => {
            console.log('values', values)
            mutation.mutate({
                id: dataItem?.id,
                endDate: values?.endDate,
                startDate: values?.startDate,
                percentage: values?.percentage,
                name: values.name,
                description: values.description,
                token: token
            }, {
                onSettled: () => {
                    query.refetch();
                }
            });
            // Sau khi gọi mutation, bạn có thể thực hiện các xử lý khác nếu cần
            form.resetFields();
            setIsModalOpen(false);
        }
        ).catch(errorInfo => {
            console.log('Validation failed:', errorInfo);
        });
    };

    const navigate = useNavigate()
    const handleShowListProducts = () => {
        navigate(`/system/admin/all-products-promotion-${dataItem?.id}`)
    }

    return (
        <div>
            <MDBCard alignment='center'>
                <MDBCardHeader className='bg-gradient-orange-red text-uppercase fs-6'>{displayName}</MDBCardHeader>
                <MDBCardBody className='p-2' style={{ minHeight: 150 }}>
                    <MDBRow >
                        <MDBCol size='6'>
                            <p className='textColorRed mb-0'>Start Date</p>
                            {dataItem.startDate}
                        </MDBCol>
                        <MDBCol size='6'>
                            <p className='textColorRed mb-0'>End Date</p>
                            {dataItem.endDate}
                        </MDBCol>
                    </MDBRow>
                    <MDBCardText className='text-start mb-0'>Percentage: {dataItem?.percentage}%</MDBCardText>
                    <MDBCardText className='text-start m-0'>Description: {dataItem?.description}</MDBCardText>
                </MDBCardBody>
                <MDBCardFooter className="d-flex justify-content-center bg-grey">
                    <div className='d-flex justify-content-around w-75'>
                        <MDBIcon fas icon="edit" style={{ color: '#007bff', fontSize: '24px', cursor: 'pointer' }} onClick={showModal} />
                        <MDBIcon fas icon="trash" style={{ color: 'red', fontSize: '24px', cursor: 'pointer' }} onClick={() => setOpenModalDelete(true)} />
                        <MDBIcon fas icon="th-list" style={{ color: '#ff8c00', fontSize: '24px', cursor: 'pointer' }} onClick={handleShowListProducts} />
                    </div>
                </MDBCardFooter>
            </MDBCard>
            <Form
                form={form}
                name={`validate_input_${dataItem?.id}`}
                autoComplete="off"
                {...layout}
                initialValues={{ name: dataItem?.name, percentage: dataItem?.percentage, startDate: dataItem?.startDate, endDate: dataItem?.endDate, description: dataItem?.description }}
            >
                <ModalComponent
                    size="sm" title="Edit Promotion"
                    nameBtnSub='Save Changes'
                    isOpen={isModalOpen}
                    onOke={handleSubmitEdit}
                    onClose={handleCancel}
                >
                    <MDBModalBody className='d-flex justify-content-center'>
                        <div className='w-100'>
                            <MDBRow>
                                <Form.Item
                                    name="name"
                                    label="Promotion name "
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input size="large" placeholder="Name promotion" />
                                </Form.Item>
                            </MDBRow>
                            <MDBRow>
                                <Form.Item
                                    label="Discount"
                                    name="percentage"
                                    rules={[
                                        {
                                            pattern: /^(100|\d{1,2}(\.\d*)?)$/,
                                            message: 'Please input a valid percentage value between 0 and 100!',
                                        },
                                    ]}
                                >
                                    <Input size="large" addonAfter={<MDBIcon fas icon="percentage" />} />
                                </Form.Item>
                            </MDBRow>
                            <MDBRow>
                                <Form.Item
                                    name="startDate"
                                    label="Start Date "
                                    rules={[
                                        {
                                            pattern: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
                                            message: 'Please input a valid start date (DD/MM/YYYY)!',
                                        },
                                    ]}
                                >
                                    {/* <Input size="large" placeholder="Name promotion" onChange={(e) => setPromotionStart(e.target.value)} /> */}
                                    <MaskedInput
                                        mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                        placeholder='DD/MM/YYYY'
                                    >
                                    </MaskedInput>
                                </Form.Item>
                            </MDBRow>
                            <MDBRow>
                                <Form.Item
                                    name="endDate"
                                    label="End Date"
                                    rules={[
                                        {
                                            pattern: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
                                            message: 'Please input a valid end date (DD/MM/YYYY)!',
                                        },
                                    ]}
                                >
                                    {/* <Input size="large" placeholder="Name promotion" onChange={(e) => setPromotionEnd(e.target.value)} /> */}
                                    <MaskedInput
                                        mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                        placeholder='DD/MM/YYYY'
                                    />
                                </Form.Item>
                            </MDBRow>
                            <MDBRow>
                                <Form.Item
                                    name="description"
                                    label="Description"
                                >
                                    <TextArea placeholder="Discription" size="large" />
                                </Form.Item>
                            </MDBRow>

                        </div>
                    </MDBModalBody>
                </ModalComponent>
            </Form>
            <ModalDeleteComponent size="xs" title="Delete Product" isOpen={openModalDelete} onOke={handleDeleteProduct} onClose={() => setOpenModalDelete(false)}>
                <div>Are you sure you want to delete the category "<span className='text-danger'>{dataItem?.name}</span>"?</div>
            </ModalDeleteComponent>
        </div >
    );
};

export default CardPromotion;

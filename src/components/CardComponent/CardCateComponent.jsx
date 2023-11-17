import React, { useEffect, useState } from 'react';
import * as CateService from '~/services/CateService'

import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCardHeader,
    MDBCardFooter,
    MDBBtn,
    MDBIcon,
    MDBModalBody,
    MDBRow
} from 'mdb-react-ui-kit';
import ModalComponent from '../ModalComponent/ModalComponent';
import { Form, Input } from 'antd';
import InputSelectAndAddNew from '../InputComponent/InputSelectAndAddNew';
import { useCustomMutation } from '~/hooks/useMutationHook';
import { toast } from 'react-toastify';
import ModalDeleteComponent from '../ModalComponent/ModalDeleteComponent';
import { useNavigate } from 'react-router-dom';

const CardCateComponent = ({ id, name = "Name", token = "", query = "" }) => {
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const maxLength = 12; // Bạn có thể điều chỉnh giá trị này
    const displayName = name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [form] = Form.useForm();

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };

    const handleDeleteProduct = () => {
        mutationDeleted.mutate({ id: id, token: token }, {
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
            const res = CateService.deleteCate(
                id,
                token
            )
            return res
        }
    )

    const mutation = useCustomMutation(
        (data) => {
            const { id, categoryName } = data
            const res = CateService.updateCate({ id, categoryName })
            return res
        }
    )

    const { data, isLoading, isSuccess, isError } = mutation;
    const { isLoading: isLoadingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete } = mutationDeleted;

    useEffect(() => {
        if (isSuccess) {
            toast.success('Rename successfully', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        } else if (isError) {
            toast.error('Rename failed', {
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

    const handleSubmitEdit = () => {
        form.validateFields().then((values) => {
            if (values?.name !== name) {
                mutation.mutate({
                    id: id, // Điều này phụ thuộc vào cách bạn quản lý id của danh mục
                    categoryName: values.name,
                    token: token
                }, {
                    onSettled: () => {
                        query.refetch()
                    }
                });

                // Sau khi gọi mutation, bạn có thể thực hiện các xử lý khác nếu cần
                form.resetFields();
                setIsModalOpen(false);
            }
        }).catch(errorInfo => {
            console.log('Validation failed:', errorInfo);
        });
    };

    const onFinish = (values) => {
        setCategoryName(values.name);
    };

    const navigate = useNavigate()
    const handleShowListProducts = () => {
        navigate(`/system/admin/all-products-cate-${id}`)
    }

    return (
        <div>
            <MDBCard alignment='center'>
                <MDBCardHeader className='bg-gradient-blue-purple ' style={{ textTransform: "uppercase" }}>{displayName}</MDBCardHeader>
                <MDBCardBody>
                    <MDBCardTitle>Category</MDBCardTitle>
                    <MDBCardText>We have many products here.</MDBCardText>
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
                name={`validate_input_${id}`}
                onFinish={onFinish}
                autoComplete="off"
                validateMessages={validateMessages}
                initialValues={{ name: name }}
            >
                <ModalComponent
                    size="sm" title="Rename Category"
                    nameBtnSub='Rename'
                    isOpen={isModalOpen}
                    onOke={handleSubmitEdit}
                    onClose={handleCancel}
                >
                    <MDBModalBody className='d-flex justify-content-center'>
                        <div className='w-75'>
                            <MDBRow>
                                <Form.Item
                                    name="name"
                                    label="Category name"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input size="large" placeholder="Category name" onChange={(e) => setCategoryName(e.target.value)} />
                                </Form.Item>
                            </MDBRow>
                        </div>
                    </MDBModalBody>
                </ModalComponent>
            </Form>
            <ModalDeleteComponent size="xs" title="Delete Product" isOpen={openModalDelete} onOke={handleDeleteProduct} onClose={() => setOpenModalDelete(false)}>
                <div>Are you sure you want to delete the category "<span className='text-danger'>{name}</span>"?</div>
            </ModalDeleteComponent>
        </div>
    );
};

export default CardCateComponent;

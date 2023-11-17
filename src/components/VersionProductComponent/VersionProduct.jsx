import { useQuery } from '@tanstack/react-query'
import { MDBBtn, MDBCardImage, MDBCol, MDBContainer, MDBIcon, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle, MDBRipple, MDBRow } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import TableComponent from '../TableComponent/TableComponent'
import * as ColorService from '~/services/ColorService'
import * as VersionService from '~/services/VersionService'
import { Button, Form, Input, Modal, Select, Upload } from 'antd'
import InputSelectAndAddNew from '../InputComponent/InputSelectAndAddNew'
import ModalComponent from '../ModalComponent/ModalComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import LoadingHasChil from '../LoadingComponent/LoadingHasChil'
import { useCustomMutation } from '~/hooks/useMutationHook'
import { useSelector } from 'react-redux'
import { UploadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify'
import Loading from '../LoadingComponent/Loading'
import ModalDeleteComponent from '../ModalComponent/ModalDeleteComponent'
import AddSizeComponent from '../AddSizeComponent/AddSizeComponent'
import ImageUploader from '../InputComponent/ImageUploader'


const VersionProduct = ({ id: idProduct }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [versionDelete, setVersionDelete] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [stateProductVersions, setStateProductVersions] = useState(null);
    const [listColor, setListColor] = useState([]);
    const fetchColor = async () => {
        try {
            const res = await ColorService.getAllColor();
            if (Array.isArray(res) && res.length > 0) {
                const colorNames = res.map(item => item.colorName);
                setListColor(colorNames);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const user = useSelector((state) => {
        return state?.user
    })

    const handleFileChangeAdd = info => {
        if (info.fileList.length > 1) {
            info.fileList.splice(0, info.fileList.length - 1);
        }
    };

    const handleFileChangeUpdate = infoUdpate => {
        if (infoUdpate.fileList.length > 1) {
            infoUdpate.fileList.splice(0, infoUdpate.fileList.length - 1);
        }
    };

    const showModal = async () => {
        await fetchColor();
        setIsModalOpen(true);
    };

    const handleAddColor = () => {
        form
            .validateFields()
            .then((values) => {
                onFinish(values); // Gọi hàm onFinish với các giá trị từ Form
                setIsModalOpen(false);
            })
            .catch((errorInfo) => {
                console.log('Validation failed:', errorInfo);
            });
    };
    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };
    const mutationAdd = useCustomMutation(
        (data) => {
            const {
                productId,
                colorName,
                image,
                token
            } = data
            const res = VersionService.createVersion({
                productId,
                colorName,
                image,
                token,
            })
            return res
        }
    )
    const mutationUpdate = useCustomMutation(
        (data) => {
            const {
                idVersion,
                colorName,
                image,
                token
            } = data
            const res = VersionService.updateVersion({
                idVersion,
                colorName,
                image,
                token,
            })
            return res
        }
    )
    const mutationDelete = useCustomMutation(
        (data) => {
            const { id,
                token
            } = data
            const res = VersionService.deleteVersion(
                id,
                token
            )
            return res
        }
    )

    const { data, isLoading: idLoadingAdd, isSuccess: idSuccessAdd, isError: idErrorAdd } = mutationAdd;
    const { data: dataUpdate, isLoading: idLoadingUpdate, isSuccess: idSuccessUpdate, isError: idErrorUpdate } = mutationUpdate;
    const { data: dataDelete, isLoading: idLoadingDelete, isSuccess: idSuccessDelete, isError: idErrorDelete } = mutationDelete;

    const [form] = Form.useForm();
    const [formDetail] = Form.useForm();

    const onFinish = (values) => {
        mutationAdd.mutate({
            productId: idProduct,
            colorName: values.color,
            image: values.image?.[0].thumbUrl,
            token: user?.accessToken
        }, {
            onSettled: () => {
                queryVersion.refetch()
            }
        })
    };

    useEffect(() => {
        if (idSuccessUpdate) {
            toast.success('Update is successed', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
        else if (idErrorUpdate) {
            toast.error('Update failed', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
        setDrawerVisible(false);
    }, [idSuccessUpdate, idErrorUpdate])

    useEffect(() => {
        if (idSuccessAdd) {
            toast.success('Add successfull', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
        else if (idErrorAdd) {
            toast.error('Add failed', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
    }, [idSuccessAdd, idErrorAdd])

    useEffect(() => {
        if (idSuccessDelete) {
            toast.success('Deleted user is success', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
        else if (idErrorDelete) {
            toast.error('Deleted failed', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
    }, [idSuccessDelete, idErrorDelete])

    const onFinishUpdate = (values) => {
        mutationUpdate.mutate({
            idVersion: stateProductVersions?.id,
            colorName: values.color,
            image: values.image,
            token: user?.accessToken
        }, {
            onSettled: () => {
                queryVersion.refetch()
            }
        })
    };

    const getAllVersionsOfProduct = async (id) => {
        const res = await VersionService.getAllVersions(id)
        return res
    }
    const queryVersion = useQuery({ queryKey: ['versions'], queryFn: () => getAllVersionsOfProduct(idProduct) })
    const { isLoading: isLoadingProduct, data: versions } = queryVersion
    console.log("versions", versions)

    const handleShowDetailsVersion = async (id) => {
        console.log("idversion detail", id)
        await fetchColor();
        const details = await fetchGetDetailsVersion(id);
        setStateProductVersions(details);
        setDrawerVisible(true);
    }

    useEffect(() => {
        if (stateProductVersions) {
            formDetail.setFieldsValue(stateProductVersions);
        }
    }, [stateProductVersions, form]);

    const fetchGetDetailsVersion = async (id) => {
        const res = await VersionService.getDetailVersion(id)
        console.log("res version", res?.version)
        if (res?.version) {
            return {
                id: id,
                color: res?.version.Color.colorName,
                image: res?.version.image,
                total: res?.version.totalQuantity,
                sizes: res?.version.sizes,
            }
        }
        return {}
    }
    const handleShowDeleteVersion = (id) => {
        setOpenModalDelete(true)
        setVersionDelete(id)
    }

    const handleDeleteVersion = () => {
        mutationDelete.mutate({ id: versionDelete, token: user?.accessToken }, {
            onSettled: () => {
                queryVersion.refetch()
            }
        });
        setOpenModalDelete(false)
    }

    const column = [
        {
            title: "ID",
            dataIndex: 'id'
        },
        {
            title: "Color",
            dataIndex: 'color', // Đổi 'color' thành 'color.colorName'
        },
        {
            title: "Image",
            dataIndex: 'image',
            render: (imageData) => (
                <img src={imageData || "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"} alt="Product Image" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
            )
        },
        {
            title: "Quantity",
            dataIndex: 'quantity',
        },
        {
            title: "Action",
            dataIndex: 'action',
        },
    ];
    const renderAction = (id) => {
        return (
            <div className="d-flex flex-column align-items-center">
                <div className="p-1 bg-hover-green w-50 text-center" style={{ backgroundColor: '#55a0f5', borderRadius: '5px', color: '#fff', fontSize: '14px', cursor: 'pointer' }} onClick={() => handleShowDetailsVersion(id)} ><MDBIcon fas icon="edit" /> Edit</div>
                <div className="p-1 bg-hover-green mt-1 w-50 text-center" style={{ backgroundColor: '#f13426', borderRadius: '5px', color: '#fff', fontSize: '14px', cursor: 'pointer' }} onClick={() => handleShowDeleteVersion(id)}><MDBIcon fas icon="trash" /> Delete</div>
            </div>
        );
    };

    const dataTabel = versions?.versions?.length && versions?.versions?.map((version, index) => {
        return {
            id: version.versionId,
            color: version.Color?.colorName,
            image: version.image,
            quantity: version.Quantity,
            action: renderAction(version.versionId),
            key: index
        };
    });

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 14,
        },
    };

    return (
        <MDBContainer className="pt-3 pb-3 mx-2" style={{ backgroundColor: 'white' }}>
            <span className="h2 fw-bold mb-0">
                Version Of Product
                <hr className="my-3" />
            </span>
            <div style={{ marginTop: 10 }}>
                <MDBBtn onClick={showModal} className="btn-create rounded-3" color='dark' style={{ height: '150px', width: '150px', border: '1px outset   ' }}><MDBIcon fas icon="plus" size="3x" /></MDBBtn>
            </div>
            <Form
                form={form}
                name="validate_input"
                onFinish={onFinish}
                autoComplete="off"
            >
                <ModalComponent
                    size="md" title="Add New Version"
                    isOpen={isModalOpen}
                    onOke={handleAddColor}
                    onClose={handleCancel}
                >
                    <MDBModalBody className='d-flex justify-content-center'>
                        <div className='w-75'>
                            <MDBRow>
                                <Form.Item
                                    name="color"
                                    label="Color"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <InputSelectAndAddNew
                                        label="Color"
                                        initialOptions={listColor}
                                        placeholder="Color"
                                        value={form.getFieldValue('color')}
                                        onChange={value => form.setFieldsValue({ color: value })}
                                    />
                                </Form.Item>
                            </MDBRow>
                            <MDBRow>
                                <Form.Item
                                    label="Upload Image"
                                    name="image"
                                    valuePropName="fileList"
                                    getValueFromEvent={e => e.fileList}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please upload an image!',
                                        },
                                    ]}
                                >
                                    <Upload
                                        name="image"
                                        listType="picture"
                                        onChange={handleFileChangeAdd}
                                        beforeUpload={() => false}
                                    >
                                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                                    </Upload>
                                </Form.Item>
                            </MDBRow>
                        </div>
                    </MDBModalBody>
                </ModalComponent>
            </Form>
            <div style={{ marginTop: 20 }}>
                <TableComponent isLoading={isLoadingProduct} columns={column} data={dataTabel} />
            </div>
            <DrawerComponent title='Edit Product' isOpen={drawerVisible} onClose={() => {
                setDrawerVisible(false);
                setStateProductVersions(null);
            }}>
                <MDBRow>
                    <div className="text-center " >
                        <div className=''>
                            {drawerVisible && ( // Check if the drawer is visible before rendering the form
                                <Form
                                    {...layout}
                                    form={formDetail}
                                    name="product_detail_form"
                                    onFinish={onFinishUpdate}
                                    autoComplete="off"
                                    initialValues={stateProductVersions}
                                >
                                    <MDBRow>
                                        <MDBCol size="4">
                                            <MDBRipple rippleTag='a'>
                                                <img
                                                    src={stateProductVersions?.image}
                                                    className='img-fluid rounded'
                                                    alt='example'
                                                />
                                            </MDBRipple>
                                        </MDBCol>

                                        <MDBCol size="8">
                                            <Form.Item
                                                name="color"
                                                label="Color"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                            >
                                                <InputSelectAndAddNew
                                                    label="Color"
                                                    initialOptions={listColor}
                                                    placeholder="Color"
                                                    value={formDetail.getFieldValue('color')}
                                                    onChange={value => formDetail.setFieldsValue({ color: value })}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label="Upload Image"
                                                name="image"
                                                // valuePropName="fileList"
                                                getValueFromEvent={(e) => e.fileList}
                                            >
                                                <ImageUploader
                                                    value={formDetail.getFieldValue('image')}
                                                    onImageChange={(newImage) => formDetail.setFieldsValue({ image: newImage })}
                                                />
                                            </Form.Item>
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow className='p-3 bg-secondary mt-3'>
                                        <AddSizeComponent idVersion={stateProductVersions?.id} />
                                    </MDBRow>
                                    <MDBRow>
                                        <Form.Item className='d-flex justify-content-center mt-3'>
                                            <MDBBtn color='info' style={{ width: '200px' }} >
                                                <Loading isLoading={idLoadingUpdate}>
                                                    Save changes
                                                </Loading>
                                            </MDBBtn>
                                        </Form.Item>
                                    </MDBRow>
                                </Form>
                            )}
                        </div>
                    </div>
                </MDBRow>
            </DrawerComponent>
            <ModalDeleteComponent size="xs" title="Delete Product" isOpen={openModalDelete} onOke={handleDeleteVersion} onClose={() => setOpenModalDelete(false)}>
                <div>Are you sure you want to delete this version?</div>
            </ModalDeleteComponent>
        </MDBContainer >
    )
}

export default VersionProduct

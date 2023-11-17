import React, { useEffect, useState } from 'react'
import { MDBBtn, MDBCard, MDBCardBody, MDBCardFooter, MDBCardImage, MDBCardText, MDBCol, MDBContainer, MDBIcon, MDBInput, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle, MDBRow, MDBValidation, MDBValidationItem } from 'mdb-react-ui-kit';

import TableComponent from '../TableComponent/TableComponent';
import { useSelector } from 'react-redux';
import Loading from '../LoadingComponent/Loading';
import { useCustomMutation } from '~/hooks/useMutationHook';
import * as UserService from '~/services/UserService'
import { toast } from 'react-toastify';
import { Form, Input, Radio } from 'antd';
import { useQuery } from '@tanstack/react-query';
import LoadingHasChil from '../LoadingComponent/LoadingHasChil';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import ModalDeleteComponent from '../ModalComponent/ModalDeleteComponent';

const AdminUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [selectedRole, setSelectedRole] = useState('');
    const user = useSelector((state) => {
        return state?.user
    })
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [rowSelectedDelete, setRowSelectedDelete] = useState('');
    const [staticModal, setStaticModal] = useState(false);
    const [showEditDrawer, setShowEditDrawer] = useState(false);
    const toggleShow = () => {
        setStaticModal(!staticModal);

        form.resetFields();
    };
    const toggleShowEdit = () => {
        setShowEditDrawer(!showEditDrawer);
    };
    const toggleShowDelete = () => {
        setOpenModalDelete(!openModalDelete);

        form.resetFields();
    };

    const [stateUserDetails, setStateUserDetails] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        image: '',
        address: '',
        phone: '',
        role: '',
    })

    const mutationCreUser = useCustomMutation(
        data => UserService.createUser(data)
    )
    // update edit user
    const mutationSaveChanges = useCustomMutation(
        (data) => {
            const { id, accessToken, ...rests } = data
            UserService.updateUser(id, rests, accessToken)
        }
    )
    const { dataSaveChanges, isLoading: isLoadingSaveChanges, isSuccess: isSuccessSaveChanges, isError: isErrorSaveChanges } = mutationSaveChanges;
    useEffect(() => {
        if (isSuccessSaveChanges) {
            toast.success('Save successfully', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        } else if (isErrorSaveChanges) {
            toast.error('Save failed', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
        mutationSaveChanges.reset();

    }, [isSuccessSaveChanges, isErrorSaveChanges])
    const handleSaveChanges = () => {
        if (selectedRole && selectedRole !== stateUserDetails?.role) {
            console.log(`save changes id`, stateUserDetails?.id)
            mutationSaveChanges.mutate({ id: stateUserDetails?.id, role: selectedRole, accessToken: user?.accessToken }, {
                onSettled: () => {
                    queryUser.refetch()
                }
            });
        }
    }

    const getAllUsers = async (data) => {
        console.log('user.accessToken', user?.accessToken)
        const res = await UserService.getAllUser(user?.accessToken)
        return res
    }
    const { data, isLoading, isSuccess, isError } = mutationCreUser;
    const queryUser = useQuery({ queryKey: ['users'], queryFn: getAllUsers })
    const { isLoading: isLoadingUser, data: users } = queryUser

    useEffect(() => {
        console.log('isSuccess', isSuccess, 'isError', isError);
        if (isSuccess) {
            toast.success('Created new user ', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
            toggleShow()
            // resetValue()
        } else if (isError) {
            toast.error(<div>{data?.message}</div>, {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
        // mutation.reset();
    }, [isSuccess, isError])

    const handleOnchangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleOnchangePassword = (e) => {
        setPassword(e.target.value);
    }
    const handleOnchangeName = (e) => {
        setName(e.target.value)
    }
    const handleOnchangePhone = (e) => {
        setPhone(e.target.value)
    }

    const [form] = Form.useForm();

    const onFinish = (values) => {
        // Gọi API khi form đã hợp lệ
        mutationCreUser.mutate({
            email: values.email,
            password: values.password,
            confirmPassword: values.password,
            name: values.fullName,
            phone: values.phone
        }, {
            onSettled: () => {
                queryUser.refetch()
            }
        });
    };

    const fetchGetDetailsUser = async (id) => {
        const res = await UserService.getDetailsUser(id, user?.accessToken)
        if (res?.data) {
            console.log('res?.data', res?.data)
            setStateUserDetails({
                id: res?.data?.id,
                name: res?.data?.name,
                email: res?.data?.email,
                password: res?.data?.password,
                address: res?.data?.address,
                phone: res?.data?.phone,
                image: res?.data?.image,
                role: res?.data?.role
            })
        }
        setIsLoadingUpdate(false)
    }

    const handleShowDetailsUser = async (id) => {
        console.log('id', id);

        toggleShowEdit();
        setIsLoadingUpdate(true)
        await fetchGetDetailsUser(id)
    }

    const renderAction = (id) => {
        return (
            <div className="d-flex justify-content-around">
                <MDBIcon fas icon="edit" style={{ color: 'orange', fontSize: '24px', cursor: 'pointer' }} onClick={() => handleShowDetailsUser(id)} />
                <MDBIcon fas icon="trash" style={{ color: 'red', fontSize: '24px', cursor: 'pointer' }} onClick={() => handleShowModelDelete(id)} />
            </div>
        );
    };

    useEffect(() => {
        setSelectedRole(stateUserDetails?.role || ''); // Cập nhật giá trị mặc định khi stateUserDetails?.role thay đổi
    }, [stateUserDetails?.role]);

    // xu ly delete
    const handleShowModelDelete = (id) => {
        setOpenModalDelete(true)
        setRowSelectedDelete(id)
    }
    const mutationDeleted = useCustomMutation(
        (data) => {
            const { id,
                token
            } = data
            const res = UserService.deleteUser(
                id,
                token
            )
            return res
        }
    )
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted;

    const handleDeleteUser = () => {
        console.log("id on delte", rowSelectedDelete)
        mutationDeleted.mutate({ id: rowSelectedDelete, token: user?.accessToken }, {
            onSettled: () => {
                queryUser.refetch()
            }
        });
        setOpenModalDelete(false)
    }

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === "OK") {
            console.log("Success")
            toast.success('Deleted user is success', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
        else if (isErrorDeleted) {
            toast.error('Deleted failed', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
    }, [isSuccessDeleted, isErrorDeleted])

    const column = [
        {
            title: "ID",
            dataIndex: 'id'
        },
        {
            title: "Name",
            dataIndex: 'name'
        },
        {
            title: "Email",
            dataIndex: 'email'
        },
        {
            title: "Phone",
            dataIndex: 'phone'
        },
        {
            title: "Address",
            dataIndex: 'address'
        },
        {
            title: "Role",
            dataIndex: 'role'
        },
        {
            title: "Action",
            dataIndex: 'action',
        },
    ]
    const dataTabel = users?.data?.length && users?.data?.map((user) => {
        return { ...user, action: renderAction(user.id), key: user.id };

    })

    return (
        <MDBContainer className="pt-3 pb-3 mx-2" style={{ backgroundColor: 'white' }}>
            <span className="h2 fw-bold mb-0">User Management</span>
            <div style={{ marginTop: 10 }}>
                <MDBBtn onClick={toggleShow} className="btn-create rounded-3" color='dark' style={{ height: '150px', width: '150px', border: '1px outset   ' }}><MDBIcon fas icon="plus" size="3x" /></MDBBtn>
            </div>
            <div style={{ marginTop: 20 }}>
                <TableComponent isLoading={isLoadingUser} columns={column} data={dataTabel} />
            </div>
            <MDBModal staticBackdrop tabIndex='-1' show={staticModal} setShow={setStaticModal} >
                <MDBModalDialog size="lg">
                    <MDBModalContent>
                        <Form
                            form={form}
                            name="validate_input"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <MDBModalHeader>
                                <MDBModalTitle>Create New User</MDBModalTitle>
                                <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                            </MDBModalHeader>
                            <MDBModalBody className='d-flex justify-content-center'>
                                <div className='w-75'>
                                    <MDBRow>
                                        <MDBCol sm="2">
                                            <p style={{ fontSize: '16px' }}>Email</p>
                                        </MDBCol>
                                        <MDBCol sm="10">
                                            <Form.Item
                                                name="email"
                                                rules={[
                                                    {
                                                        type: 'email',
                                                        message: 'The input is not valid E-mail!',
                                                    },
                                                    {
                                                        required: true,
                                                        message: 'Please input your E-mail!',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Email" value={email} onChange={handleOnchangeEmail} size="large" />
                                            </Form.Item>
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow>
                                        <MDBCol sm="2">
                                            <p style={{ fontSize: '16px' }}>Name</p>
                                        </MDBCol>
                                        <MDBCol sm="10">
                                            <Form.Item
                                                name="fullName"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input your full name!',
                                                    },
                                                    {
                                                        max: 50,
                                                        message: 'Full name cannot exceed 50 characters!',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Full Name" value={name} onChange={handleOnchangeName} size="large" />
                                            </Form.Item>
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow>
                                        <MDBCol sm="2">
                                            <p style={{ fontSize: '16px' }}>Password</p>
                                        </MDBCol>
                                        <MDBCol sm="10">
                                            <Form.Item
                                                name="password"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input your password!',
                                                    },
                                                    {
                                                        min: 8,
                                                        message: 'Password must be at least 8 characters!',
                                                    },
                                                    {
                                                        max: 20,
                                                        message: 'Password cannot exceed 20 characters!',
                                                    },
                                                ]}
                                            >
                                                <Input.Password placeholder="Password" value={password} onChange={handleOnchangePassword} size="large" />
                                            </Form.Item>
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow>
                                        <MDBCol sm="2">
                                            <p style={{ fontSize: '16px' }}>Phone</p>
                                        </MDBCol>
                                        <MDBCol sm="10">
                                            <Form.Item
                                                name="phone"
                                                rules={[
                                                    {
                                                        // required: true,
                                                        message: 'Please input your phone number!',
                                                    },
                                                    {
                                                        pattern: /^\d{10}$/,
                                                        message: 'Phone number must be 10 digits!',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Phone Number" value={phone} onChange={handleOnchangePhone} size="large" />
                                            </Form.Item>
                                        </MDBCol>
                                    </MDBRow>
                                </div>

                            </MDBModalBody>
                            <MDBModalFooter>
                                <Form.Item>

                                    <MDBBtn color='info' style={{ width: '120px' }}>
                                        <Loading isLoading={isLoading} color='#b9cdc9' >
                                            Submit
                                        </Loading>
                                    </MDBBtn>
                                </Form.Item>
                                <MDBBtn color='light' onClick={toggleShow} style={{ width: '120px' }}>
                                    Close
                                </MDBBtn>
                            </MDBModalFooter>
                        </Form>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
            <DrawerComponent title='Edit User' isOpen={showEditDrawer} onClose={() => setShowEditDrawer(false)}>
                <LoadingHasChil isLoading={isLoadingUpdate}>
                    <MDBRow>
                        <MDBCol lg="4">
                            <MDBCard className="mb-4" >
                                <MDBCardBody className="text-center d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                                    {stateUserDetails?.image ?
                                        <MDBCardImage
                                            src={stateUserDetails?.image}
                                            alt="avatar"
                                            className="rounded-circle"
                                            style={{ width: '150px', height: '150px' }}
                                            fluid />
                                        :
                                        <MDBCardImage
                                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                                            alt="avatar"
                                            className="rounded-circle"
                                            style={{ width: '150px', height: '150px' }}
                                            fluid />
                                    }
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        <MDBCol lg="8">
                            <MDBCard className="mb-4">
                                <MDBCard  >
                                    <MDBCardBody className="text-center" style={{ height: "300px" }}>
                                        <MDBModalTitle className="mt-3">{stateUserDetails?.email || "Empty"}</MDBModalTitle>
                                        <MDBModalTitle className="mt-3">{stateUserDetails?.name || "Empty"}</MDBModalTitle>
                                        <MDBModalTitle className="mt-3">Phone: {stateUserDetails?.phone || "Empty"}</MDBModalTitle>
                                        <MDBModalTitle className="mt-3">Address: {stateUserDetails?.address || "Empty"}</MDBModalTitle>
                                        <MDBModalTitle className="mt-3">Role:
                                            <Radio.Group className='mt-3 ms-2' value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} buttonStyle="solid" >
                                                {console.log('stateUserDetails?.role', stateUserDetails?.role)}
                                                <Radio.Button value="customer">Customer</Radio.Button>
                                                <Radio.Button value="master">Master</Radio.Button>
                                            </Radio.Group></MDBModalTitle>
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                    <MDBBtn color='info' style={{ float: 'right' }} onClick={handleSaveChanges}>
                        <Loading isLoading={isLoadingSaveChanges}>
                            Save changes
                        </Loading>
                    </MDBBtn>
                </LoadingHasChil>
            </DrawerComponent>
            <ModalDeleteComponent size="xs" title="Delete User" isOpen={openModalDelete} onOke={handleDeleteUser} onClose={() => setOpenModalDelete(false)}>
                <div>You are sure you want to delete this user?</div>
            </ModalDeleteComponent>
        </MDBContainer >
    )
}

export default AdminUser

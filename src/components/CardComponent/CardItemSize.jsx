import React, { useEffect, useState } from 'react';
import { MDBCard, MDBCardBody, MDBIcon } from 'mdb-react-ui-kit';
import InputSelectAndAddNew from '~/components/InputComponent/InputSelectAndAddNew';
import { Input } from 'antd';
import ModalDeleteComponent from '../ModalComponent/ModalDeleteComponent';
import * as SizeService from '~/services/SizeService'
import { useCustomMutation } from '~/hooks/useMutationHook';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const CardItemSize = ({ dataItem, queryVersion, setIsLoading }) => {
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [selectedValue, setSelectedValue] = useState(dataItem?.Size?.sizeName);
    const [quantity, setQuantity] = useState(dataItem?.quantity || 1);
    const user = useSelector((state) => {
        return state?.user
    })

    console.log('selectedValue', selectedValue)

    const mutationAdd = useCustomMutation(
        (data) => {
            const {
                versionId,
                sizeName,
                quantity,
                token
            } = data
            const res = SizeService.createSizeItem({
                versionId,
                sizeName,
                quantity,
                token,
            })
            return res
        }
    )
    const mutationUpdate = useCustomMutation(
        (data) => {
            const {
                id,
                versionId,
                sizeName,
                quantity,
                token
            } = data
            const res = SizeService.updateSizeItem({
                id,
                versionId,
                sizeName,
                quantity,
                token,
            })
            return res
        }
    )
    const mutationDeleted = useCustomMutation(
        (data) => {
            const { id,
                token
            } = data
            const res = SizeService.deleteSizeItem(
                id,
                token
            )
            return res
        }
    )
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted;
    const { data: dataUpdate, isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate } = mutationUpdate;
    const { data, isLoading: isLoadingAdd, isSuccess: idSuccessAdd, isError: idErrorAdd } = mutationAdd;

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
        mutationAdd.reset();
    }, [idSuccessAdd, idErrorAdd])

    useEffect(() => {
        if (isSuccessUpdate) {
            toast.success('Save is successed', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
        else if (isErrorUpdate) {
            toast.error('Save failed', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
        mutationUpdate.reset();
    }, [isSuccessUpdate, isErrorUpdate])

    useEffect(() => {
        if (isSuccessDeleted) {
            toast.success('Delete successfull', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
        else if (isErrorDeleted) {
            toast.error('Delete failed', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
        mutationDeleted.reset();
    }, [isSuccessDeleted, isErrorDeleted])

    const isAnyLoading = isLoadingAdd || isLoadingUpdate || isLoadingDeleted;

    useEffect(() => {
        setIsLoading(isAnyLoading)
    }, [isAnyLoading]);

    const handleClickDelete = () => {
        setOpenModalDelete(true);
    };

    const handleDeleteSizeItem = () => {
        if (dataItem?.id) {
            mutationDeleted.mutate({ id: dataItem?.id, token: user?.accessToken }, {
                onSettled: () => {
                    queryVersion.refetch()
                }
            });
        } else {
            console.log('Xoa item moi')
            queryVersion.refetch()

        }
    }

    const handleSelectChange = (value) => {
        setSelectedValue(value);
    };

    const handelOnChangeQuantity = (e) => {
        setQuantity(e.target.value);
    };

    const handleSubmit = () => {
        if (selectedValue === dataItem?.Size?.sizeName && dataItem?.quantity === quantity) {
            return
        }
        if (dataItem?.id) {
            mutationUpdate.mutate({ id: dataItem?.id, versionId: dataItem?.versionId, sizeName: selectedValue, quantity: quantity, token: user?.accessToken }, {
                onSettled: () => {
                    queryVersion.refetch()
                }
            });
            console.log('mutationUpdate')
        } else {
            mutationAdd.mutate({ versionId: dataItem?.versionId, sizeName: selectedValue, quantity: quantity, token: user?.accessToken }, {
                onSettled: () => {
                    queryVersion.refetch()
                }
            });
            console.log('mutationAdd')

        }
    };

    return (
        <>
            <MDBCard className="mb-3 box-shadowColor hover-item">
                <MDBCardBody className="px-1 py-2 d-flex flex-row align-items-center">
                    <div className="d-flex w-100 align-items-center justify-content-between">
                        <div className="ms-3">
                            Size:
                            <InputSelectAndAddNew
                                label="size"
                                size=''
                                initialOptions={['M', 'S', 'L', 'XL', 'XXL']}
                                value={selectedValue}
                                onChange={handleSelectChange}
                                style={{ minWidth: "150px" }}
                            />
                        </div>
                        <div className="d-flex align-items-center" style={{ fontStyle: "italic", opacity: "0.8" }}>
                            Quantity:
                            <Input
                                type="number"
                                size="sm"
                                value={quantity}
                                onChange={handelOnChangeQuantity}
                            />
                        </div>
                    </div>
                    <MDBIcon fas icon="save" size='xl' className='color-hover-green px-4 flex-shrink-1' style={{ color: '#AA00FF', cursor: 'pointer' }} onClick={handleSubmit} />
                    <MDBIcon
                        fas
                        icon="trash-alt"
                        size='xl'
                        className={` px-3 flex-shrink-1 ${dataItem?.id ? 'clickable-icon color-hover-green' : 'unclickable-icon'}`}
                        style={{ color: dataItem?.id ? 'red' : '#ccc', cursor: dataItem?.id ? 'pointer' : 'not-allowed' }}
                        onClick={dataItem?.id ? handleClickDelete : null}
                    />
                </MDBCardBody>
            </MDBCard>
            <ModalDeleteComponent size="xs" title="Delete User" isOpen={openModalDelete} onOke={handleDeleteSizeItem} onClose={() => setOpenModalDelete(false)}>
                <div>You are sure you want to delete this user?</div>
            </ModalDeleteComponent>
        </>
    );
};

export default CardItemSize;

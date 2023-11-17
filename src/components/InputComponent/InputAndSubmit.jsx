import { MDBBtn, MDBInputGroup, MDBValidation, MDBValidationItem } from 'mdb-react-ui-kit'
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useCustomMutation } from '~/hooks/useMutationHook';
import * as UserService from '~/services/UserService'
import { updateUser } from '~/redux/slides/userSlide'
import Loading from '../LoadingComponent/Loading';


const InputAndSubmit = ({ nameDataFile, type = 'text' }) => {
    const user = useSelector((state) => state.user)
    const [file, setFile] = useState(user?.[nameDataFile]);
    const dispatch = useDispatch();

    const mutation = useCustomMutation(
        (data) => {
            const { id, accessToken, ...rests } = data
            UserService.updateUser(id, rests, accessToken)
        }
    )

    useEffect(() => {
        setFile(user?.[nameDataFile])
    }, [user])

    const { data, isLoading, isSuccess, isError } = mutation;

    useEffect(() => {
        if (isSuccess) {
            toast.success('Updated successfully', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
            handleGetDetailsUser(user?.id, user?.accessToken)
        } else if (isError) {
            toast.error('Update failed', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
        mutation.reset();

    }, [isSuccess, isError])

    const handleUpdate = () => {
        if (file && file !== user?.[nameDataFile]) {
            console.log(`update ${nameDataFile}`, file)
            mutation.mutate({ id: user?.id, [nameDataFile]: file, accessToken: user?.accessToken });
        }
    }

    const handleGetDetailsUser = async (id, token) => {
        const response = await UserService.getDetailsUser(id, token)
        console.log("response", response)
        dispatch(updateUser({ ...response?.data, accessToken: token }))
    }

    const handleOnchangeFile = (e) => {
        setFile(e.target.value)
    }
    const feedback = `Please enter ${nameDataFile}`
    return (
        <div><MDBValidation>
            <MDBValidationItem feedback={feedback} invalid={true}>
                <MDBInputGroup className='mb-3'>
                    <input className='form-control' value={file} onChange={handleOnchangeFile} required label='Full name' id='inputName' type={type} />
                    <MDBBtn type='submit' onClick={handleUpdate}>
                        <Loading isLoading={isLoading} color="#fff">
                            {isLoading ? null : "Update"}
                        </Loading>
                    </MDBBtn>
                </MDBInputGroup>
            </MDBValidationItem>
        </MDBValidation></div>
    )
}

export default InputAndSubmit

import { MDBBtn, MDBFile, MDBInputGroup, MDBValidation, MDBValidationItem } from 'mdb-react-ui-kit'
import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useCustomMutation } from '~/hooks/useMutationHook';
import * as UserService from '~/services/UserService'
import { updateUser } from '~/redux/slides/userSlide'
import { getBase64 } from '~/utils';


const NotFoundPage = () => {
    const user = useSelector((state) => state.user)
    const [image, setImage] = useState(user?.image);
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    const mutation = useCustomMutation(
        (data) => {
            const { id, accessToken, ...rests } = data
            UserService.updateUser(id, rests, accessToken)
        }
    )
    const { data, isLoading, isSuccess, isError } = mutation;

    useEffect(() => {
        setImage(user?.image)
    }, [user]);

    const handleChooseFile = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        console.log('o handle onchange file')
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageURL = event.target.result;
                dispatch(updateUser({ ...user, image: imageURL }));
                setImage(imageURL); // Đặt giá trị hình ảnh để hiển thị trên giao diện người dùng
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <div className='mt-3'>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <div>
                    <MDBBtn color='info' onClick={handleChooseFile} className="me-3">New Avatar</MDBBtn>
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage

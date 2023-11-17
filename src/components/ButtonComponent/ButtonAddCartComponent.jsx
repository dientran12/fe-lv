import { MDBBtn } from 'mdb-react-ui-kit';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useCustomMutation } from '~/hooks/useMutationHook';
import * as CartService from '~/services/CartService'

export default function ButtonAddCartComponent({ children, size = '', disabled = false, onAddToCartClick }) {
    const user = useSelector((state) => {
        return state?.user
    })

    const mutationAdd = useCustomMutation(
        (data) => CartService.addProductToCart(data)
    )

    const { data, isLoading, isSuccess, isError, error } = mutationAdd;

    const handleOnClick = () => {
        // Gọi hàm xử lý khi người dùng nhấn thêm vào giỏ hàng

        const dataAdd = onAddToCartClick();
        console.log('dataAdd', dataAdd);
        if (dataAdd) {
            mutationAdd.mutate({
                sizeItemId: dataAdd?.sizeItem.id,
                userId: user?.id,
                token: user?.accessToken,
                quantity: dataAdd?.quantity
            })
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success('Added success ', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        } else if (isError) {
            toast.error(<div>{error?.response.data.message}</div>, {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
        // mutation.reset();
    }, [isSuccess, isError])

    return (
        <MDBBtn size={size} color='warning' disabled={disabled} onClick={handleOnClick}>
            {children}
        </MDBBtn>
    );
}

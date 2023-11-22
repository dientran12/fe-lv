import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    MDBCheckbox,
    MDBCol,
    MDBContainer,
    MDBRow,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ButtonBuyProduct from "~/components/ButtonComponent/ButtonBuyProduct";
import CardProductCart from "~/components/CardComponent/CardProductCart";
import * as CartService from '~/services/CartService'
import { formatCurrency } from "~/utils";

export default function CartPage() {
    const user = useSelector((state) => {
        return state?.user
    })


    const getAllProductOnCart = async (id) => {
        if (!id) {
            return null
        }
        const res = await CartService.getAllProductOnCart(id)
        return res?.cartItems
    }

    const queryCartItems = useQuery({
        queryKey: ['cartItems', user?.id],
        queryFn: () => getAllProductOnCart(user?.id),
        enabled: !!user?.id, // Kích hoạt query khi user.id có giá trị
    });

    const { isLoading: isLoadingProduct, data: cartItems } = queryCartItems;

    const [checkedItems, setCheckedItems] = useState([]);
    const checkedItemsCount = checkedItems?.filter(item => item).length;
    const [isAllProductsChecked, setIsAllProductsChecked] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [quantities, setQuantities] = useState([]);

    useEffect(() => {
        if (cartItems) {
            // Xử lý khi không có sản phẩm trong giỏ hàng
            // setTotalPrice(0);
            setCheckedItems(cartItems?.map(() => false));
            setQuantities(cartItems?.map((item) => item?.quantity));
            return;
        }

    }, [cartItems]);

    useEffect(() => {
        if (cartItems) {
            let newTotalPrice = 0;
            for (let i = 0; i < cartItems?.length; i++) {
                if (checkedItems[i]) {
                    newTotalPrice += parseFloat(cartItems[i].discountedPrice ? cartItems[i]?.discountedPrice : cartItems[i].productdata?.Version?.Product?.price) * quantities[i];
                }
            }
            setTotalPrice(newTotalPrice);
        }
    }, [checkedItems, quantities]);

    const handleAllCheckboxClick = () => {
        setIsAllProductsChecked(!isAllProductsChecked);
        setCheckedItems(cartItems?.map(() => !isAllProductsChecked));
    };

    const handleCheckboxChange = (index, isChecked) => {
        const newCheckedItems = [...checkedItems];
        newCheckedItems[index] = isChecked;
        setCheckedItems(newCheckedItems);
    };

    const handleQuantityChange = (index, newQuantity) => {
        // Chuyển đổi giá trị sang kiểu số
        const newQuantityArr = [...quantities];
        newQuantityArr[index] = parseInt(newQuantity, 10);;
        setQuantities(newQuantityArr);
    };

    const handleBuyClick = () => {
        // Xử lý khi người dùng nhấn mua
        console.log('totalPrice', totalPrice)
        // console.log('cartItems', cartItems)
        // console.log('quantities', quantities)
        // console.log('checkedItems', checkedItems)
        // return [{}]

        const mergedArray = checkedItems
            .map((isChecked, index) => isChecked ? { quantity: quantities[index], cartItem: cartItems[index] } : null)
            .filter(item => item !== null);

        console.log('Merged Array:', mergedArray);
        // Thực hiện các xử lý khác nếu cần

        const newArr = mergedArray.map(item => ({
            versionId: item.cartItem?.productdata?.Version.id,
            sellingPrice: item.cartItem?.discountedPrice || item.cartItem?.productdata?.Version?.Product?.price,
            price: item.cartItem?.productdata?.Version?.Product?.price,
            image: item.cartItem?.productdata?.Version.image,
            sizeItems: [{
                sizeItemId: item.cartItem?.sizeItemId,
                sizeName: item.cartItem?.productdata?.Size.sizeName,
                quantity: item.quantity
            },]
        }));
        // console.log('newArr:', newArr);

        return newArr
    };

    console.log('cartItems:', cartItems && cartItems);

    return (
        <div className="" style={{ backgroundColor: "#eee" }}>
            {cartItems && <>
                <MDBContainer className=" ">
                    <div className=" pt-3 px-5 titleMyCartContent bg-white mb-4">
                        Cart
                        <hr className="my-3 pb-4" />
                    </div>
                    {cartItems && cartItems?.map((item, index) => (
                        <CardProductCart
                            key={index}
                            index={index}
                            item={item}
                            isChecked={checkedItems[index]}
                            onCheckboxChange={handleCheckboxChange}
                            onQuantityChange={handleQuantityChange}
                            queryCartItems={queryCartItems}
                        />
                    ))}
                </MDBContainer>
                <div className={`fixed-bottom bg-white h-25 ${checkedItemsCount > 0 ? 'show' : ''}`}>
                    <MDBContainer>
                        <MDBRow className="my-5">
                            <MDBCol className="d-flex flex-row align-items-center" lg="6">
                                <MDBCheckbox
                                    id='flexCheckDefault'
                                    className='me-3'
                                    checked={isAllProductsChecked}
                                    onChange={handleAllCheckboxClick}
                                />
                                <div style={{ fontSize: '18px', opacity: '0.8' }}>Choose all products({cartItems && cartItems.length}) items</div>
                            </MDBCol>
                            <MDBCol className="d-flex flex-row-reverse align-items-center" lg="6"  >
                                <ButtonBuyProduct
                                    color="danger"
                                    className="shadow-0"
                                    onBuyClick={handleBuyClick} />
                                <div className="me-3" style={{ fontSize: '18px', opacity: '0.9' }}>
                                    Total cost of goods({checkedItemsCount}):
                                    <div style={{ color: 'red' }}>{formatCurrency(totalPrice)} đ</div>
                                </div>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </div>
            </>}
        </div>
    );
}

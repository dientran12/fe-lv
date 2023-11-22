import React, { useEffect, useState } from 'react';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBInputGroup,
    MDBTypography,
    MDBBtn,
    MDBIcon,
    MDBInput,
    MDBCardImage,
} from 'mdb-react-ui-kit';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useNavigate, useParams } from 'react-router-dom';
import ButtonBuyProduct from '~/components/ButtonComponent/ButtonBuyProduct';
import ButtonAddCartComponent from '~/components/ButtonComponent/ButtonAddCartComponent';
import * as ProductService from '~/services/ProductService'
import LoadingHasChil from '~/components/LoadingComponent/LoadingHasChil';
import InputQuantityDetailProduct from '~/components/InputComponent/InputQuantityDetailProduct';


function DetailProductPage() {
    const key = useParams();
    const [quantity, setQuantity] = useState(1)
    const [detailProduct, setDetailProduct] = useState({})
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true)
    const [selectedSizeSelect, setSelectedSizeSelect] = useState(0);

    const handleSizeChange = (sizeId) => {
        setSelectedSizeSelect(sizeId);
    };

    const getMaxQuantity = (sizeId) => {
        let selectedSizeItem = dataProduct && dataProduct[activeIndex]?.SizeItems[sizeId];
        return selectedSizeItem ? selectedSizeItem.quantity : 1;
    };

    const handleQuantityChange = (newValue) => {
        setQuantity(newValue);
    };

    const fetchGetDetailsProduct = async (id) => {
        const res = await ProductService.getDetailProduct(id)
        setDetailProduct({
            id: id,
            name: res?.name,
            price: res?.price,
            brand: res?.brand,
            gender: res?.gender,
            origin: res?.origin,
            categories: res?.Categories,
            discountedPrice: res?.discountedPrice || res?.price,
            listVersions: res?.Versions,
            type: res?.type,
            description: res?.description
        })
        setIsLoading(false)
    }
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    useEffect(() => {
        fetchGetDetailsProduct(key.key);
    }, [key]);
    const dataProduct = detailProduct?.listVersions


    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.activeIndex);
    };

    console.log('item active', activeIndex)
    console.log('detailProduct?.listVersions', detailProduct?.listVersions)

    const handleBuyClick = () => {
        // Xử lý khi người dùng nhấn mua
        console.log('Size đã chọn:', dataProduct[activeIndex]?.SizeItems[selectedSizeSelect]?.Size.sizeName);
        console.log('Số lượng đã chọn:', quantity);
        return [{
            versionId: dataProduct[activeIndex]?.id,
            total: quantity,
            sellingPrice: detailProduct?.discountedPrice,
            price: detailProduct?.price,
            image: dataProduct[activeIndex]?.image,
            sizeItems: [{
                sizeName: dataProduct[activeIndex]?.SizeItems[selectedSizeSelect]?.Size.sizeName,
                sizeItemId: dataProduct[activeIndex]?.SizeItems[selectedSizeSelect]?.id,
                quantity: quantity
            },]
        }]
        // return [{ sizeItemId: dataProduct[activeIndex]?.SizeItems[selectedSizeSelect].id, quantity: quantity }]

        // Thực hiện các xử lý khác nếu cần
    };

    const handleAddToCartClick = () => {
        // Xử lý khi người dùng nhấn thêm vào giỏ hàng
        console.log('Size đã chọn:', dataProduct[activeIndex]?.SizeItems[selectedSizeSelect]?.Size.sizeName);
        console.log('Size đã chọn:', dataProduct[activeIndex]?.SizeItems[selectedSizeSelect]);
        // console.log('Số lượng đã chọn:', quantity);
        const dataAdd = { sizeItem: dataProduct[activeIndex]?.SizeItems[selectedSizeSelect], quantity: quantity }
        return dataAdd
        // Thực hiện các xử lý khác nếu cần
    };

    return (
        <LoadingHasChil isLoading={isLoading}>
            <MDBContainer className="">
                <div className=" pt-3 px-5 titleMyCartContent bg-white mb-4">
                    Details Product
                    <hr className="my-3 pb-4" />
                </div>
                {dataProduct &&
                    <MDBRow className="">
                        <MDBCol lg="6" >
                            <div className="bg-white">
                                <Swiper
                                    style={{
                                        '--swiper-navigation-color': '#ccc',
                                        '--swiper-pagination-color': '#fff',
                                    }}
                                    spaceBetween={10}
                                    navigation={true}
                                    thumbs={{ swiper: thumbsSwiper }}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    onSlideChange={handleSlideChange}
                                    className="mySwiper2"
                                >
                                    {dataProduct?.map((version) => (
                                        <SwiperSlide key={version.id}>
                                            <img src={version.image} alt={`Slide ${version.id}`} style={{ width: '100%', height: 'auto', aspectRatio: '1/1', objectFit: 'contain' }} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <hr></hr>
                                <Swiper
                                    onSwiper={setThumbsSwiper}
                                    loop={true}
                                    spaceBetween={10}
                                    slidesPerView={dataProduct.length > 4 ? dataProduct.length : 4}
                                    freeMode={true}
                                    watchSlidesProgress={true}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    className="mySwiper"
                                >
                                    {dataProduct?.map((version) => (
                                        <SwiperSlide key={version.id}>
                                            <img className="p-2" src={version.image} alt={`Thumbnail ${version.id}`} style={{ width: '100%', height: 'auto', aspectRatio: '1/1' }} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </MDBCol>
                        <MDBCol lg="6" >
                            <div className="ps-lg-3 p-4" style={{ backgroundColor: 'white' }}>
                                <h4 className="title text-dark">
                                    {detailProduct?.name}
                                </h4>
                                <p>
                                    {detailProduct?.description}
                                </p>
                                <MDBRow>
                                    <MDBCol size="3">
                                        <MDBTypography tag="dt" className="col-3">
                                            Type:
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="9">
                                        <MDBTypography tag="dd" className="col-9">
                                            {detailProduct?.type}
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="3">
                                        <MDBTypography tag="dt" className="col-3">
                                            Brand:
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="9">
                                        <MDBTypography tag="dd" className="col-9">
                                            {detailProduct?.brand}
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="3">
                                        <MDBTypography tag="dt" className="col-3">
                                            Origin:
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="9">
                                        <MDBTypography tag="dd" className="col-9">
                                            {detailProduct?.origin}
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="3">
                                        <MDBTypography tag="dt" className="col-3">
                                            Color:
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="9">
                                        <MDBTypography tag="dd" className="col-9">
                                            {dataProduct[activeIndex]?.Color?.colorName}
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="3">
                                        <MDBTypography tag="dt" className="col-3">
                                            Stock:
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="9">
                                        <MDBTypography tag="dd" className="col-9">
                                            {dataProduct[activeIndex]?.SizeItems[selectedSizeSelect]?.quantity || <div className="textColorRed">Out of Stock</div>}
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="3">
                                        <MDBTypography tag="dt" className="col-3">
                                            Price:
                                        </MDBTypography>
                                    </MDBCol>
                                    <MDBCol size="9">
                                        <span className="h5 text-danger ">
                                            {detailProduct?.discountedPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </span>
                                        {detailProduct?.discountedPrice !== detailProduct?.price && <MDBTypography className=" ms-3 fs-5 text fw-light" tag='s'>
                                            {detailProduct?.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </MDBTypography>}
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow className="mb-4">
                                    <MDBCol md="4" xs="6">
                                        <label className="mb-2">Size</label>
                                        <select
                                            className="form-select border border-secondary"
                                            value={selectedSizeSelect}  // Giá trị đã chọn từ state hoặc props
                                            onChange={(e) => handleSizeChange(e.target.value)}
                                        >
                                            {dataProduct && dataProduct[activeIndex]?.SizeItems.map((sizeItem, index) => (
                                                <option key={sizeItem.Size.sizeName} value={index}>
                                                    {sizeItem.Size.sizeName}
                                                </option>
                                            ))}
                                        </select>
                                    </MDBCol>
                                    <MDBCol md="4" xs="6" className="mb-3">
                                        <label className="mb-2 d-block">Quantity</label>
                                        <InputQuantityDetailProduct
                                            onValueChange={handleQuantityChange}
                                            minValue={1}
                                            selectedSize={selectedSizeSelect}
                                            activeIndex={activeIndex}
                                            maxValue={getMaxQuantity(selectedSizeSelect)} // Sử dụng hàm getMaxQuantity để lấy giá trị maxValue
                                        />
                                    </MDBCol>
                                    <div className="mb-3">
                                        <span className="h6 text-danger">
                                            {detailProduct?.discountedPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </span>
                                        <span className="mx-2 ">x</span>
                                        <span className="text-muted">{quantity}</span>
                                        <span className="mx-2 ">=</span>
                                        <span className="h5 text-danger">
                                            {((detailProduct?.discountedPrice || 0) * quantity).toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            })}
                                        </span>
                                    </div>
                                </MDBRow>

                                <div className="me-2 d-inline-block">
                                    <ButtonBuyProduct
                                        color="danger"
                                        className="shadow-0"
                                        disabled={dataProduct[activeIndex]?.SizeItems[selectedSizeSelect]?.quantity ? false : true}
                                        onBuyClick={handleBuyClick}
                                    />
                                </div>
                                <ButtonAddCartComponent
                                    color="warning"
                                    className="shadow-0 ms-3"
                                    disabled={dataProduct[activeIndex]?.SizeItems[selectedSizeSelect]?.quantity ? false : true}
                                    onAddToCartClick={handleAddToCartClick}
                                >
                                    <MDBIcon fas icon="cart-plus" className="me-1" />
                                    Add to cart
                                </ButtonAddCartComponent>
                            </div>
                        </MDBCol>
                    </MDBRow>}
            </MDBContainer>
        </LoadingHasChil>
    );
}

export default DetailProductPage;



import { MDBBtn, MDBCol, MDBContainer, MDBRow } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardProductHome from '~/components/CardComponent/CardProductHome';
import LoadingHasChil from '~/components/LoadingComponent/LoadingHasChil';
import SliderComponent from '~/components/SliderComponent/SliderComponent';
import image1 from '~/assets/images/slider/document.jpg';
import image2 from '~/assets/images/slider/document (1).jpg';
import image3 from '~/assets/images/slider/document (2).jpg';
import * as CateService from '~/services/CateService'
import * as ProductService from '~/services/ProductService'

const HomePage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [listCate, setListCate] = useState([]);
    const [listProductHasPromotions, setListProductHasPromotions] = useState([]);
    const listImageSlider = [image1, image2, image3]
    const dataListProduct = [
        { title: 'Promotion Products', src: 'Promotion Product', products: listProductHasPromotions },
    ];
    const navigate = useNavigate()

    const getProductHasPromotion = async () => {
        setIsLoading(true)
        const res = await ProductService.getProductHasPromotion()
        setIsLoading(false)
        setListProductHasPromotions(res.products)
        return res
    }

    useEffect(() => {
        getProductHasPromotion()
    }, []);

    return (
        <>
            <MDBContainer>
                <LoadingHasChil isLoading={isLoading}>
                    <SliderComponent listImage={listImageSlider} />
                    {dataListProduct.map((listProducts, index) => (
                        <div key={index}>
                            <div style={{ marginTop: '20px' }}>
                                <MDBRow style={{ marginTop: '20px' }}>
                                    <div className="name-cate mb-5" >{listProducts?.title}</div>
                                    {listProducts?.products?.map((product, index) => (
                                        <MDBCol key={index} className='mb-3 sm-w-25' xl="3" lg="4" md="5" sm="6">
                                            <CardProductHome product={product} />
                                        </MDBCol>
                                    ))}
                                </MDBRow>
                            </div>
                        </div>
                    ))}
                    {/* <div className="d-flex justify-content-center mt-4 mb-5">
                        <MDBBtn style={{ width: '200px' }} color="info">
                            See more
                        </MDBBtn>
                    </div> */}
                </LoadingHasChil>
            </MDBContainer>
        </>
    );
};

export default HomePage;

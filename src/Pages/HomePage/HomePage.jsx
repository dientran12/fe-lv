
import { MDBBtn, MDBCol, MDBContainer, MDBRow } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardProductHome from '~/components/CardComponent/CardProductHome';
import LoadingHasChil from '~/components/LoadingComponent/LoadingHasChil';
import SliderComponent from '~/components/SliderComponent/SliderComponent';
import * as CateService from '~/services/CateService'
import * as ProductService from '~/services/ProductService'

const HomePage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [listCate, setListCate] = useState([]);
    const [listProductNew, setListProductNew] = useState([]);
    const [listProductHasPromotions, setListProductHasPromotions] = useState([]);
    const listImage = ["https://aristino.com/Data/upload/images/BANNER/N%C4%83m%202023/Banner-Aristino-Mobile-KV_1920x900.jpg",
        "https://aristino.com/Data/upload/images/BANNER/N%C4%83m%202023/Banner-Aristino-golf-1920x900-Zip.jpg",
        "https://aristino.com/Data/upload/images/BANNER/T03-2023/Banner-Aristino-Online-2023-Desktop.jpg"]

    const dataListProduct = [
        { title: 'Newest Products', src: '', products: listProductNew },
        { title: 'Promotion Products', src: 'Promotion Product', products: listProductHasPromotions },
    ];
    const navigate = useNavigate()

    const getProductsOfNewProduct = async (id) => {
        setIsLoading(true)
        const res = await CateService.getAllProductOnCate(id)
        setIsLoading(false)
        setListProductNew(res?.products)
        return res
    }

    const getProductHasPromotion = async () => {
        setIsLoading(true)
        const res = await ProductService.getProductHasPromotion()
        setIsLoading(false)
        setListProductHasPromotions(res.products)
        return res
    }

    useEffect(() => {
        const fetchCate = async () => {
            try {
                setIsLoading(true)
                const res = await CateService.getAllCate();
                setIsLoading(false)

                if (res && res.categories) {
                    setListCate(res.categories);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchCate()
        getProductHasPromotion()
    }, []);

    useEffect(() => {
        setIsLoading(true)
        const foundCate = listCate?.find(cate => cate.categoryName === "New Product");
        if (foundCate) {
            console.log('id new product', foundCate.id)
            getProductsOfNewProduct(foundCate.id)
        }
    }, [listCate]);

    return (
        <>
            <MDBContainer>
                <LoadingHasChil isLoading={isLoading}>
                    <SliderComponent listImage={listImage} />
                    {dataListProduct.map((listProducts, index) => (
                        <React.Fragment key={index}>
                            <div style={{ marginTop: '20px' }}>
                                <MDBRow style={{ marginTop: '20px' }}>
                                    <div className="name-cate mb-5" onClick={() => navigate('category')}>{listProducts?.title}</div>
                                    {listProducts?.products?.map((product, index) => (
                                        <MDBCol key={index} className='mb-3 sm-w-25' xl="3" lg="4" md="5" sm="6">
                                            <CardProductHome product={product} />
                                        </MDBCol>
                                    ))}
                                </MDBRow>
                            </div>
                        </React.Fragment>
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

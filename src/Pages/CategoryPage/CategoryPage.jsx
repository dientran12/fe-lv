import { Select, Space } from 'antd';
import { MDBBtn, MDBCardImage, MDBCol, MDBContainer, MDBIcon, MDBRow, MDBTypography } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import CardProductHome from '~/components/CardComponent/CardProductHome';
import SidebarComponent from '~/components/SidebarComponent/SidebarComponent';
import GlobeIcon from '@rsuite/icons/legacy/Globe';
import BarsIcon from '@rsuite/icons/legacy/Bars';
import SitemapIcon from '@rsuite/icons/legacy/Sitemap';
import RetentionIcon from '@rsuite/icons/legacy/Retention';
import BinocularsIcon from '@rsuite/icons/legacy/Binoculars';
import * as ProductService from '~/services/ProductService'
import * as CateService from '~/services/CateService'
import NavFilterComponent from '~/components/NavbarComponent/NavFilterComponent';
import LoadingHasChil from '~/components/LoadingComponent/LoadingHasChil';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CategoryPage = () => {
    const [listCate, setListCate] = useState([]);
    const [listType, setListType] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [listBrand, setListBrand] = useState([]);
    const [listOrigin, setListOrigin] = useState([]);
    const [key, setKey] = useState(null);
    const [dataProduct, setDataProduct] = useState([]);

    let search = useSelector((state) => state.product.search);
    console.log('search', search);

    useEffect(() => {
        setIsLoading(true)
        fetchDataAllProduct();
        setKey(null)
    }, [search]);

    const fetchDataProductOnCate = async (cateId) => {
        try {
            const products = await CateService.getAllProductOnCate(cateId);
            setIsLoading(false)
            console.log('products cate', products)
            if (products.success && Array.isArray(products.products)) {
                const filteredProducts = products.products.filter(product => product.Versions.length > 0);
                console.log('filteredProducts cate', filteredProducts);

                setDataProduct(filteredProducts);
            }
        } catch (error) {
            console.error("Error fetching products by category:", error);
        }
    };

    const fetchDataAllProduct = async () => {
        try {
            if (!!search) {
                const products = await ProductService.getProductSearch({ search });
                setDataProduct(products?.products);
            } else {
                const products = await ProductService.getAllProduct();
                console.log('products cate', products)
                setDataProduct(products?.products);
            }
            setIsLoading(false)
        } catch (error) {
            console.error("Error fetching products by category:", error);
        }
    };

    const fetchDataProductOnOrigin = async (origin) => {
        try {
            const products = await ProductService.getAllProductByOrigin(origin);
            setIsLoading(false)
            setDataProduct(products?.products); // Cập nhật dữ liệu sản phẩm mới dựa trên ID danh mục được chọn
        } catch (error) {
            console.error("Error fetching products by category:", error);
        }
    };
    const fetchDataProductOnBrand = async (brand) => {

        try {
            const products = await ProductService.getAllProductByBrand(brand);
            setIsLoading(false)
            setDataProduct(products?.products);
        } catch (error) {
            console.error("Error fetching products by category:", error);
        }
    };
    const fetchDataProductOnType = async (type) => {

        try {
            const products = await ProductService.getAllProductByType(type);
            setIsLoading(false)
            console.log('product type', products)
            setDataProduct(products?.products);
        } catch (error) {
            console.error("Error fetching products by category:", error);
        }
    };

    const fetchCate = async () => {
        try {
            const res = await CateService.getAllCate();
            if (res && res.categories) {
                setListCate(res.categories);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const fetchOrigin = async () => {
        try {
            const res = await ProductService.getAllOrigin();
            setListOrigin(res?.types);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const fetchType = async () => {
        try {
            const res = await ProductService.getAllType();
            if (res && res.types) {
                setListType(res.types);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const fetchBrand = async () => {
        try {
            const res = await ProductService.getAllBrand();
            if (res && res.types) {
                setListBrand(res.types);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchCate()
        fetchOrigin()
        fetchType()
        fetchBrand()
    }, []);

    useEffect(() => {
        // search = '';
        if (key === "category") {
            fetchDataAllProduct();
            return
        }
        if (key !== null) {
            setIsLoading(true)
            const parts = key?.split('-', 2);
            const itemTab = parts[0];
            const keySelected = parts[1] || listCate?.[0]?.id;
            switch (itemTab) {
                case 'allproduct':
                    fetchDataAllProduct();
                    return;
                case 'cate':
                    fetchDataProductOnCate(keySelected);
                    return;
                case 'origin':
                    fetchDataProductOnOrigin(keySelected);
                    return;
                case 'type':
                    fetchDataProductOnType(keySelected);
                    return;
                case 'brand':
                    fetchDataProductOnBrand(keySelected);
                    return;
                default:
                    return <></>;
            }
        }
    }, [key]);

    console.log("key", key);
    console.log("listCate", listCate);
    console.log("dataProduct", dataProduct);
    const items = [
        {
            eventKey: 'allproduct', name: 'All products', icon: <RetentionIcon />,
        },
        {
            eventKey: 'cate', name: 'Category', icon: <BarsIcon />,
            children: [],
        },
        {
            eventKey: 'origin', name: 'Origin', icon: <GlobeIcon />,
            children: [],
        },
        {
            eventKey: 'type', name: 'Type', icon: <SitemapIcon />,
            children: [],
        },
        {
            eventKey: 'brand', name: 'Brand', icon: <BinocularsIcon />,
            children: [],
        },
    ];

    if (listCate?.length > 0) {
        const categoryItem = items.find(item => item.eventKey === 'cate');
        if (categoryItem) {
            categoryItem.children = listCate.map((category) => ({
                eventKey: `cate-${category?.id}`,
                name: category.categoryName, // Sử dụng thuộc tính categoryName hoặc tên phù hợp
            }));
        }
    }
    if (listOrigin?.length > 0) {
        const originItem = items.find(item => item.eventKey === 'origin');
        if (originItem) {
            originItem.children = listOrigin.map((origin) => ({
                eventKey: `origin-${origin}`,
                name: origin, // Sử dụng thuộc tính originName hoặc tên phù hợp
            }));
        }
    }
    if (listType?.length > 0) {
        const typeItem = items.find(item => item.eventKey === 'type');
        if (typeItem) {
            typeItem.children = listType.map((type) => ({
                eventKey: `type-${type}`,
                name: type, // Sử dụng thuộc tính typeName hoặc tên phù hợp
            }));
        }
    }
    if (listBrand?.length > 0) {
        const brandItem = items.find(item => item.eventKey === 'brand');
        if (brandItem) {
            brandItem.children = listBrand.map((brand) => ({
                eventKey: `brand-${brand}`,
                name: brand, // Sử dụng thuộc tính brandName hoặc tên phù hợp
            }));
        }
    }

    const [currentPage, setCurrentPage] = React.useState(1);
    const totalPages = Math.ceil(5);

    return (
        <>
            <MDBContainer className='mt-2 d-flex'>
                <SidebarComponent
                    items={items} // Thay IconComponent bằng biểu tượng mong muốn
                    baseUrl="category" // Cần cung cấp baseUrl dựa trên các route của bạn
                    onItemSelected={setKey} // Viết hàm xử lý khi chọn danh mục
                    defaultSelected={listCate.length > 0 ? listCate[0].id : null} // Chọn mặc định danh mục đầu tiên hoặc null nếu không có danh mục
                />
                <div className="ms-2 flex-grow-1" style={{ overflowY: 'auto', maxHeight: '90vh' }}>
                    <NavFilterComponent />
                    <LoadingHasChil isLoading={isLoading}>
                        <MDBRow>
                            {
                                dataProduct?.length !== 0 ?
                                    dataProduct?.map((item, index) => (
                                        <MDBCol className='mb-3' key={index} xl="3" lg="4" md="6">
                                            <CardProductHome product={item} />
                                        </MDBCol>
                                    )) :
                                    <div> No Data </div>
                            }
                        </MDBRow>
                    </LoadingHasChil>
                </div>
            </MDBContainer >
        </>
    )
}

export default CategoryPage

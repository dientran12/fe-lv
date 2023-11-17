import React, { useEffect, useState } from 'react'
import { MDBBtn, MDBCard, MDBCardBody, MDBCardFooter, MDBCardImage, MDBCardText, MDBCol, MDBContainer, MDBIcon, MDBInput, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle, MDBRow, MDBTypography, MDBValidation, MDBValidationItem } from 'mdb-react-ui-kit';

import TableComponent from '../TableComponent/TableComponent';
import { useSelector } from 'react-redux';
import Loading from '../LoadingComponent/Loading';
import { useCustomMutation } from '~/hooks/useMutationHook';
import * as ProductService from '~/services/ProductService'
import * as PromotionService from '~/services/PromotionService'
import * as CateService from '~/services/CateService'
import { toast } from 'react-toastify';
import { Form, Input, Select } from 'antd';
import { useQuery } from '@tanstack/react-query';
import LoadingHasChil from '../LoadingComponent/LoadingHasChil';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import ModalDeleteComponent from '../ModalComponent/ModalDeleteComponent';
import InputSelectAndAddNew from '~/components/InputComponent/InputSelectAndAddNew';
import { useNavigate } from 'react-router-dom';
import InputSelectTagPickerComponent from '../InputComponent/InputSelectTagPickerComponent';
import ModalComponent from '../ModalComponent/ModalComponent';
import InputSelect from '../InputComponent/InpputSelect';

const AllProductsComponent = ({ page }) => {
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalDiscountOpen, setIsModalDiscountOpen] = useState(false)
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [titlePage, setTitlePage] = useState("All Products");
    const [listCate, setListCate] = useState([]);
    const [listType, setListType] = useState([]);
    const [listBrand, setListBrand] = useState([]);
    const [listOrigin, setListOrigin] = useState([]);
    const [listPromotion, setListPromotion] = useState([]);
    const user = useSelector((state) => {
        return state?.user
    })
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [rowSelectedDelete, setRowSelectedDelete] = useState('');
    const [selectedPromotionIndex, setSelectedPromotionIndex] = useState(0);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [stateProductDetails, setStateProductDetails] = useState(null);
    const [stateProductPromotion, setStateProductPromotion] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [valueChangePromotion, setValueChangePromotion] = useState('');
    const navigate = useNavigate()
    const getAllProducts = async () => {
        setIsFetchingData(true);
        const pageName = page?.split("-")[0];
        const id = page?.split("-")[1];
        if (pageName === "cate") {
            setTitlePage("Products in categories")
            const res = await CateService.getAllProductOnCate(id)
            setIsFetchingData(false);
            return res
        }
        if (pageName === "promotion") {
            setTitlePage("Products in promotions")
            const res = await PromotionService.getAllProductOnPromotion(id)
            setIsFetchingData(false);
            return res
        }
        const res = await ProductService.getAllProductForAd()
        setIsFetchingData(false);
        return res
    }

    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts })
    const { isLoading: isLoadingProduct, data: products } = queryProduct
    const refreshData = () => {
        queryProduct.refetch();
    }
    const fetchPromotions = async () => {
        try {
            const res = await PromotionService.getAllPromotion();
            console.log("list promottion", res)
            if (res) {
                setListPromotion(res)
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        refreshData(); // Gọi hàm này khi người dùng quay lại từ Category
        fetchPromotions()
    }, [page]);

    const handleDeleteProduct = () => {
        mutationDeleted.mutate({ id: rowSelectedDelete, token: user?.accessToken }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        });
        setOpenModalDelete(false)
    }

    const handleShowDetailsProduct = async (id) => {
        setDrawerVisible(true);
        setIsLoadingUpdate(true);
        const details = await fetchGetDetailsProduct(id);
        setStateProductDetails(details);
        if (details?.categories) {
            const listSelected = details.categories?.map(item => ({
                label: item.categoryName,
                value: item.id.toString(), // Chuyển id về kiểu string (nếu cần)
            }));
            setSelectedCategory(listSelected);
        }
    };

    const handleShowDisc = async (id) => {
        setIsModalDiscountOpen(true)
        setIsLoadingUpdate(true);
        const details = await fetchGetDetailsProduct(id);
        setStateProductPromotion(details);
    }

    const handleShowListVersionProducts = async (id) => {
        navigate(`/system/admin/details-version-product-${id}`)
    };

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
            const res = ProductService.deleteProduct(
                id,
                token
            )
            return res
        }
    )
    const mutationAddPromtionForProduct = useCustomMutation(
        (data) => {
            const res = PromotionService.addPromotionForProduct(
                data
            )
            return res
        }
    )
    const fetchGetDetailsProduct = async (id) => {
        const res = await ProductService.getDetailProduct(id)
        console.log("res detail product", res)
        if (res) {
            setIsLoadingUpdate(false)
            return {
                id: id,
                name: res?.name,
                price: res?.price,
                promotions: res?.Promotions,
                brand: res?.brand,
                gender: res?.gender,
                origin: res?.origin,
                categories: res?.Categories,
                type: res?.type,
                description: res?.description
            }
        }
        return {}
    }

    const mutation = useCustomMutation(
        (data) => {
            const {
                id,
                name,
                price,
                description,
                brand,
                type,
                origin,
                gender,
                categoryIds,
                token
            } = data
            // console.log('data', data)
            const res = ProductService.updateProduct({
                id,
                token,
                name,
                price,
                description,
                origin,
                type,
                categoryIds,
                gender,
                brand,
            })
            return res
        }
    )

    const { data, isLoading, isSuccess, isError } = mutation;

    const onFinish = (values) => {
        const categoryIds = values.categories.map(category => category);
        mutation.mutate({
            id: stateProductDetails?.id,
            name: values.name,
            brand: values.brand,
            origin: values.origin,
            type: values.type,
            price: values.price,
            description: values.description,
            categoryIds: categoryIds,
            gender: values.gender,
            token: user?.accessToken
        }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        });
    };

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 14,
        },
    };

    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };

    const [form] = Form.useForm();

    const handleSubmitDisc = () => {
        const promotionId = listPromotion[selectedPromotionIndex]?.id
        console.log("idPromotion", promotionId)
        console.log("productId", stateProductPromotion?.id)
        mutationAddPromtionForProduct.mutate({
            promotionId,
            productId: stateProductPromotion?.id,
            token: user?.accessToken
        }, {
            onSettled: () => {
                // queryProduct.refetch()
            }
        });
    }

    const handleCloseModalDisc = () => {
        setValueChangePromotion(""); // Giả sử hàm này là hàm set giá trị cho thanh select
        setIsModalDiscountOpen(false)
    }

    useEffect(() => {
        if (stateProductDetails) {
            form.setFieldsValue({ ...stateProductDetails });
        }
        // lay option
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
                if (res && res.types) {
                    setListOrigin(res.types);
                }
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
        fetchType()
        fetchOrigin()
        fetchBrand()
        fetchCate()
    }, [stateProductDetails, form]);
    const column = [
        {
            title: "ID",
            dataIndex: 'id',
        },
        {
            title: "Name",
            dataIndex: 'name'
        },
        {
            title: "Price",
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: "Gender",
            dataIndex: 'gender'
        },
        {
            title: "Total",
            dataIndex: 'total',
        },
        {
            title: "Action",
            dataIndex: 'action',
        },
    ]

    const handleOnchangePromotion = (selectedValue, selectedPromotionIndex) => {
        setSelectedPromotionIndex(selectedPromotionIndex)
        setValueChangePromotion(selectedValue)
    }

    const renderAction = (id) => {
        return (
            <div className="d-flex flex-column align-items-center" >
                <div className="p-1 bg-hover-green w-50 text-center" style={{ backgroundColor: '#55a0f5', borderRadius: '5px', color: '#fff', fontSize: '14px', cursor: 'pointer' }} onClick={() => handleShowDetailsProduct(id)} ><MDBIcon fas icon="edit" /> Edit</div>
                <div className="p-1 bg-hover-green mt-1 w-50 text-center" style={{ backgroundColor: '#ffd021', borderRadius: '5px', color: '#fff', fontSize: '14px', cursor: 'pointer' }} onClick={() => handleShowDisc(id)}  ><MDBIcon fas icon="money-bill-alt" /> Discount</div>
                <div className="p-1 bg-hover-green mt-1 w-50 text-center" style={{ backgroundColor: '#58e1b5', borderRadius: '5px', color: '#fff', fontSize: '14px', cursor: 'pointer' }} onClick={() => handleShowListVersionProducts(id)}><MDBIcon fas icon="th-list" /> Versions</div>
                <div className="p-1 bg-hover-green mt-1 w-50 text-center" style={{ backgroundColor: '#f13426', borderRadius: '5px', color: '#fff', fontSize: '14px', cursor: 'pointer' }} onClick={() => handleShowModelDelete(id)} ><MDBIcon fas icon="trash" /> Delete</div>
            </div>
        );
    };

    const dataTabel = products?.products?.length && products?.products?.map((product) => {
        return { ...product, action: renderAction(product.id), key: product.id };
    })

    const optionsCate = listCate?.map(item => ({
        label: item.categoryName,
        value: item.id.toString(), // Chuyển id về kiểu string (nếu cần)
    }));

    // console.log('stateProductDetails', stateProductDetails)
    // console.log('setStateProductPromotion', stateProductPromotion)

    return (
        <MDBContainer className="pt-3 pb-3 mx-2" style={{ backgroundColor: 'white' }}>
            <span className="h2 fw-bold mb-0">
                {titlePage}
                <hr className="my-3" /></span>
            <div style={{ marginTop: 20 }}>
                <TableComponent isLoading={isLoadingProduct || isFetchingData} columns={column} data={dataTabel} />
            </div>

            <DrawerComponent title='Edit Product' isOpen={drawerVisible} onClose={() => {
                setDrawerVisible(false);
                setStateProductDetails(null); // Reset stateProductDetails on drawer close
            }}>
                <LoadingHasChil isLoading={isLoadingUpdate}>
                    <MDBRow>
                        <div className="text-center " >
                            <div className=''>
                                {drawerVisible && ( // Check if the drawer is visible before rendering the form
                                    <Form
                                        {...layout}
                                        form={form}
                                        name="product_form"
                                        onFinish={onFinish}
                                        validateMessages={validateMessages}
                                        autoComplete="off"
                                        initialValues={stateProductDetails}
                                    >
                                        <Form.Item
                                            name="name"
                                            label="Product Name"

                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <Input size="large" placeholder="Product Name" />
                                        </Form.Item>
                                        <Form.Item
                                            name="type"
                                            label="Type"

                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <InputSelectAndAddNew
                                                label="Type"
                                                initialOptions={listType}
                                                placeholder="Type"
                                                value={form.getFieldValue('type')}
                                                onChange={value => form.setFieldsValue({ type: value })} />
                                        </Form.Item>
                                        <Form.Item
                                            name="brand"
                                            label="Brand"

                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <InputSelectAndAddNew
                                                label="Brand"
                                                initialOptions={listBrand}
                                                placeholder="Brand"
                                                value={form.getFieldValue('brand')}
                                                onChange={value => form.setFieldsValue({ brand: value })} />
                                        </Form.Item>
                                        <Form.Item
                                            name="origin" // Đặt name tương ứng với tên trường trong form
                                            label="Origin"
                                        >
                                            <InputSelectAndAddNew
                                                label="Origin"
                                                initialOptions={listOrigin}
                                                placeholder="Origin"
                                                value={form.getFieldValue('origin')}
                                                onChange={value => form.setFieldsValue({ origin: value })}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="categories"
                                            label="Category"
                                        >
                                            <InputSelectTagPickerComponent
                                                onChange={value => {
                                                    form.setFieldsValue({ categories: value });
                                                    setSelectedCategory(value);
                                                }}
                                                options={optionsCate}
                                                values={selectedCategory}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="gender"
                                            label="Gender"
                                            // initialValue="male"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <Select placeholder="select your gender" size="large">
                                                <Select.Option value="male">Male</Select.Option>
                                                <Select.Option value="female">Female</Select.Option>
                                                <Select.Option value="unisex">Unisex</Select.Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            name="description"
                                            label="Description"
                                        >
                                            <Input.TextArea size="large" placeholder="Description" />
                                        </Form.Item>
                                        <Form.Item
                                            name="importPrice"
                                            label="Import Price"

                                        >
                                            <Input size="large" placeholder="Import Price" />
                                        </Form.Item>
                                        <Form.Item
                                            name="price"
                                            label="Selling Price"

                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <Input size="large" placeholder="Selling Price" />
                                        </Form.Item>
                                        <Form.Item className='d-flex justify-content-center mt-5'>
                                            <MDBBtn color='info' style={{ width: '200px' }} >
                                                <Loading isLoading={isLoading} color='#fff'>
                                                    Save changes
                                                </Loading>
                                            </MDBBtn>
                                        </Form.Item>
                                    </Form>
                                )}
                            </div>
                        </div>
                    </MDBRow>
                </LoadingHasChil>
            </DrawerComponent>
            <ModalComponent
                size="sm" title="Discount"
                nameBtnSub='Save'
                isOpen={isModalDiscountOpen}
                onOke={handleSubmitDisc}
                onClose={handleCloseModalDisc}
            >
                <MDBModalBody className='d-flex justify-content-center'>
                    <LoadingHasChil isLoading={isLoadingUpdate}>
                        <div className='w-75'>
                            <MDBRow>
                                <MDBCol size="4">
                                    <MDBTypography tag="dt" >
                                        Promotion:
                                    </MDBTypography>
                                </MDBCol>
                                <MDBCol size="8">
                                    <MDBTypography tag="dd" >
                                        {stateProductPromotion?.promotions[0]?.name || "No promotions available"}
                                    </MDBTypography>
                                </MDBCol>
                                {stateProductPromotion?.promotions.length > 0 &&
                                    <>
                                        <MDBCol size="4">
                                            <MDBTypography tag="dt" >
                                                Event time:
                                            </MDBTypography>
                                        </MDBCol>
                                        <MDBCol size="8">
                                            <MDBTypography tag="dd" >
                                                {stateProductPromotion?.promotions[0]?.startDate} - {stateProductPromotion?.promotions[0]?.endDate}
                                            </MDBTypography>
                                        </MDBCol>
                                        <MDBCol size="4">
                                            <MDBTypography tag="dt" >
                                                Discount Rate:
                                            </MDBTypography>
                                        </MDBCol>
                                        <MDBCol size="8">
                                            <MDBTypography tag="dd" >
                                                {stateProductPromotion?.promotions[0]?.percentage}%
                                            </MDBTypography>
                                        </MDBCol>
                                    </>
                                }
                                <MDBCol size="4">
                                    <MDBTypography tag="dt" >
                                        Choose new:
                                    </MDBTypography>
                                </MDBCol>
                                <MDBCol size="8">
                                    <MDBTypography tag="dd" >
                                        <InputSelect
                                            initialOptions={listPromotion?.map(promotion => promotion?.name)}
                                            onChange={handleOnchangePromotion}
                                            value={valueChangePromotion}
                                        />
                                    </MDBTypography>
                                </MDBCol>
                            </MDBRow>
                        </div>
                    </LoadingHasChil>
                </MDBModalBody>
            </ModalComponent>
            <ModalDeleteComponent size="xs" title="Delete Product" isOpen={openModalDelete} onOke={handleDeleteProduct} onClose={() => setOpenModalDelete(false)}>
                <div>You are sure you want to delete this user?</div>
            </ModalDeleteComponent>
        </MDBContainer >
    )
}

export default AllProductsComponent

import { Badge, Form, Input, Select } from 'antd';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardText, MDBCol, MDBContainer, MDBRow } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import InputSelectAndAddNew from '../InputComponent/InputSelectAndAddNew';
import { useCustomMutation } from '~/hooks/useMutationHook'
import * as ProductService from '~/services/ProductService'
import * as CateService from '~/services/CateService'
import Loading from '../LoadingComponent/Loading';
import { toast } from 'react-toastify';
import InputSelectTagPickerComponent from '../InputComponent/InputSelectTagPickerComponent';

const CreateProductComponent = () => {
    const [listCate, setListCate] = useState([]);
    const [listType, setListType] = useState([]);
    const [listBrand, setListBrand] = useState([]);
    const [listOrigin, setListOrigin] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const mutation = useCustomMutation(
        (data) => {
            const { name,
                price,
                description,
                brand,
                type,
                origin,
                categoryIds,
                gender,
            } = data
            // console.log('data', data)
            const res = ProductService.createProduct({
                name,
                price,
                description,
                origin,
                type,
                gender,
                categoryIds,
                brand,
            })
            return res
        }
    )
    const { data, isLoading, isSuccess, isError } = mutation;

    const onFinish = (values) => {
        console.log('Form values', values);
        const categoryIds = values?.categories?.map(category => category);
        console.log('Form categoryIds', categoryIds);
        mutation.mutate({
            name: values.name,
            brand: values.brand,
            origin: values.origin,
            type: values.type,
            price: values.price,
            description: values.description,
            categoryIds: categoryIds,
            gender: values.gender
        });
    };

    useEffect(() => {
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
    }, []);
    console.log('List Type', listType);
    useEffect(() => {
        if (isSuccess) {
            toast.success('Product created successfully', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        } else if (isError) {
            toast.error('"Failed to create the product', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
        mutation.reset();

    }, [isSuccess, isError])

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
    const optionsCate = listCate?.map(item => ({
        label: item.categoryName,
        value: item.id.toString(), // Chuyển id về kiểu string (nếu cần)
    }));
    const [form] = Form.useForm();

    return (
        <MDBContainer className="pt-3 pb-3 mx-2" style={{ backgroundColor: 'white' }}>
            <span className="h2 fw-bold mb-0">
                Create Product
                <hr className="my-3" />
            </span>
            <div className=''>
                <Form
                    {...layout}
                    name="product_form"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                    autoComplete="off"
                    form={form}
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
                            value={form.getFieldValue('type')}
                            placeholder="Type"
                            onChange={value => form.setFieldsValue({ type: value })}
                        />
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
                            value={form.getFieldValue('brand')}
                            placeholder="Brand"
                            onChange={value => form.setFieldsValue({ brand: value })} />
                    </Form.Item>
                    <Form.Item
                        name="origin"
                        label="Origin"
                    >
                        <InputSelectAndAddNew
                            label="Origin"
                            initialOptions={listOrigin}
                            value={form.getFieldValue('origin')}
                            placeholder="Origin"
                            onChange={value => form.setFieldsValue({ origin: value })} />
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
                        initialValue="male"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select placeholder="select your gender" size="large">
                            <Select.Option value="male">Male</Select.Option>
                            <Select.Option value="female">Female</Select.Option>
                            <Select.Option value="uniset">Uniset</Select.Option>
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
                        <MDBBtn color='info' style={{ width: '200px' }} type="submit">
                            <Loading isLoading={isLoading} color='#fff'>
                                Create
                            </Loading>
                        </MDBBtn>
                    </Form.Item>
                </Form>
            </div>
        </MDBContainer>
    )
}

export default CreateProductComponent;

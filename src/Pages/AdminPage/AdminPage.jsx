import { MDBIcon } from 'mdb-react-ui-kit';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminUser from '~/components/AdminUser/AdminUser';
import HeaderComponent from '~/components/HeaderComponent/HeaderComponent';
import SidebarAdmin from '~/components/SidebarComponent/SidebarAdminComponent';
import MemberIcon from '@rsuite/icons/Member';
import GavelIcon from '@rsuite/icons/legacy/Gavel';
import CogIcon from '@rsuite/icons/legacy/Cog';
import AreaChartIcon from '@rsuite/icons/legacy/AreaChart';
import MiniProgramIcon from '@rsuite/icons/MiniProgram';
import BlackTieIcon from '@rsuite/icons/legacy/BlackTie';
import AllProductsComponent from '~/components/AllProductsComponent/AllProductsComponent';
import CreateProductComponent from '~/components/CreateProductComponent/CreateProductComponent';
import CategoryProductComponent from '~/components/CategoryProductComponent/CategoryProductComponent';
import VersionProduct from '~/components/VersionProductComponent/VersionProduct';
import PromotionComponent from '~/components/PromotionComponent/PromotionComponent';
import OrderComponent from '~/components/OrderComponent/OrderComponent';

const AdminPage = () => {
    const { keyFromURL } = useParams();
    const [key, setKey] = useState(keyFromURL || 'user');

    useEffect(() => {
        if (keyFromURL) {
            setKey(keyFromURL);
        }
    }, [keyFromURL]);

    const renderPage = (key) => {
        console.log('key', key)
        if (key.startsWith("details-version-product-")) {
            const id = key.split("details-version-product-")[1];
            // Kiểm tra nếu id không phải là số hoặc chuỗi rỗng
            if (!isNaN(id) && id !== "") {
                return <VersionProduct id={parseInt(id)} />;
            }
        }
        if (key.startsWith("all-products-")) {
            const page = key.split("all-products-")[1];
            console.log('route', page)
            if (page !== "") {
                // const page = route.split("-")[0];
                // const id = route.split("-")[1];
                console.log('page', page)
                return <AllProductsComponent page={page} />;
            }
        }
        switch (key) {
            case 'user':
            case 'admin':
                return <AdminUser />;
            case 'order':
                return <OrderComponent />;
            case 'all-products':
                return <AllProductsComponent />;
            case 'product-categories':
                return <CategoryProductComponent />;
            case 'create-product':
                return <CreateProductComponent />;
            case 'promotions':
                return <PromotionComponent />;
            default:
                return <></>;
        }
    }

    const items = [
        { eventKey: 'dashboard', name: 'Dashboard', icon: <AreaChartIcon /> },
        { eventKey: 'user', name: 'User', icon: <MemberIcon /> },
        {
            eventKey: 'product',
            name: 'Products',
            icon: <BlackTieIcon />,
            children: [
                { eventKey: 'all-products', name: 'Product List' },
                { eventKey: 'create-product', name: 'Create New Product' },
                { eventKey: 'product-categories', name: 'Categories' },
            ],
        },
        { eventKey: 'order', name: 'Orders', icon: <GavelIcon /> },
        { eventKey: 'promotions', name: 'Promotions', icon: <MiniProgramIcon spin /> },
        { eventKey: 'setting', name: 'Settings', icon: <CogIcon spin /> },
    ];

    return (
        <>
            <HeaderComponent showNav={false} color="#f06824" />
            <div className="d-flex">
                <SidebarAdmin
                    items={items}
                    baseUrl="/system/admin"
                    defaultSelected='user'
                    onItemSelected={setKey} />
                <div className="flex-grow-1 mt-3 ps-3 ">
                    {renderPage(key)}
                </div>
            </div>
        </>
    );
};

export default AdminPage;

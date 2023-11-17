import { Select, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import { MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem } from 'mdb-react-ui-kit';
import SimplePagination from '~/components/PaginationComponent/PaginationComponent';

const NavFilterComponent = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 780);

    const totalPages = Math.ceil(5);
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleWindowSizeChange = () => {
        setIsMobile(window.innerWidth <= 780);
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);

        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    return (
        <>
            <div className="mb-2 p-2 d-flex justify-content-between" style={{ backgroundColor: 'rgb(227 227 227)' }}>
                <div className='d-flex justify-content-start align-items-center'>
                    {isMobile ? (
                        <MDBDropdown>
                            <MDBDropdownToggle color='light' style={{}}>Sort by</MDBDropdownToggle>
                            <MDBDropdownMenu>
                                <MDBDropdownItem link>Popular</MDBDropdownItem>
                                <MDBDropdownItem link>Latest</MDBDropdownItem>
                                <MDBDropdownItem style={{ whiteSpace: 'nowrap !important' }} link>Top Sales</MDBDropdownItem>
                                <Space wrap style={{ backgroundColor: '#fff' }}>
                                    <Select
                                        defaultValue="Price"
                                        style={{ width: 180 }}
                                        bordered={false}
                                        size='middle'
                                        options={[
                                            { value: 'ascending', label: <MDBDropdownItem link>Price: Low to Height</MDBDropdownItem> },
                                            { value: 'descending', label: <MDBDropdownItem link>Price: Height to Low</MDBDropdownItem> },
                                        ]}
                                    />
                                </Space>
                            </MDBDropdownMenu>
                        </MDBDropdown>
                    ) : (
                        <>
                            <span style={{ fontSize: 14 }}>Sort by: </span>
                            <div className="name-filter px-3 py-1 ms-1" >Popular</div>
                            <div className="name-filter px-3 py-1">Latest</div>
                            <div className="name-filter px-3 py-1">Top Sales</div>
                            <Space wrap style={{ backgroundColor: '#fff', marginLeft: '10px' }}>
                                <Select
                                    defaultValue="Price"
                                    style={{ width: 180 }}
                                    bordered={false}
                                    size='middle'
                                    options={[
                                        { value: 'ascending', label: 'Price: Low to Height' },
                                        { value: 'descending', label: 'Price: Height to Low' },
                                    ]}
                                />
                            </Space>
                        </>
                    )}
                </div>
                <SimplePagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
        </>
    )
}

export default NavFilterComponent;

import React, { useEffect, useState } from 'react'
import {
    MDBContainer,
    MDBNavbar,
    MDBBtn,
    MDBInputGroup,
    MDBIcon,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
} from 'mdb-react-ui-kit';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { searchProduct } from '~/redux/slides/productSlide';
const NavbarCompoent = () => {
    const menuList = [{ name: "Category", path: "category" }, { name: "Promotion", path: "promotion" }]
    const navigation = useNavigate()
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation(); // Sử dụng hook này
    const dispatch = useDispatch();

    const handleNavigateToHome = () => {
        navigation('/')
    }

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 780);

    const handleWindowSizeChange = () => {
        setIsMobile(window.innerWidth <= 780);
    };


    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = () => {
        dispatch(searchProduct(searchQuery));
        console.log('window.location.pathname', window.location.pathname, 'search', searchQuery)
        if (window.location.pathname !== '/category' && searchQuery === '') {
            return
        }
        setSearchQuery("");
        navigation('/category');
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);

        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);
    return (
        <>
            <MDBNavbar dark bgColor='dark' >
                <MDBContainer fluid className='d-flex justify-content-between'>
                    <div>
                        {isMobile ?
                            (<MDBDropdown >
                                <MDBDropdownToggle color='light'><MDBIcon fas icon="bars" /></MDBDropdownToggle>
                                <MDBDropdownMenu style={{ minWidth: 300 }}>
                                    <MDBDropdownItem    >
                                        <div className={`name-tab-nav ${location.pathname === '/' ? 'active-tab' : ''} `} color='dark' stype={{ width: "100%" }} onClick={handleNavigateToHome}>
                                            <MDBIcon fas icon="home" className='me-1' />
                                            Home
                                        </div>
                                    </MDBDropdownItem>
                                    {menuList.map((menuItem, index) => (
                                        <MDBDropdownItem key={index} >
                                            <div className={`name-tab-nav ${location.pathname.includes(menuItem.name.toLowerCase()) ? 'active-tab' : ''} `} onClick={() => navigation(`/${menuItem.path}`)} color='dark'>{menuItem.name}</div>
                                        </MDBDropdownItem>
                                    ))}
                                </MDBDropdownMenu>
                            </MDBDropdown>)
                            :
                            (<div>
                                <MDBBtn className={`name-tab-nav ${location.pathname === '/' ? 'active-tab' : ''}`} color='dark' onClick={handleNavigateToHome}>
                                    <MDBIcon fas icon="home" className='me-1' />
                                    Home
                                </MDBBtn>
                                {menuList.map((menuItem, index) => (
                                    <MDBBtn className={`name-tab-nav ${location.pathname.includes(menuItem.name.toLowerCase()) ? 'active-tab' : ''}`} onClick={() => navigation(`/${menuItem.path}`)} key={index} color='dark'>{menuItem.name}</MDBBtn>
                                ))}
                            </div>)
                        }
                    </div>
                    <div>
                        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                            <MDBInputGroup>
                                <input
                                    className='form-control'
                                    placeholder="Type query"
                                    aria-label="Search"
                                    type='Search'
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                />
                                <MDBBtn outline type="submit">{isMobile ? <MDBIcon fas icon="search" /> : "Search"}</MDBBtn>
                            </MDBInputGroup>
                        </form>
                    </div>
                </MDBContainer>
            </MDBNavbar>
        </>
    )
}

export default NavbarCompoent


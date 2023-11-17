import React, { useEffect, useState } from 'react'
import logo from '~/assets/images/logoShop.png'
import {
    MDBContainer,
    MDBBtn,
    MDBRow,
    MDBCol,
    MDBIcon,
    MDBPopover,
    MDBPopoverHeader,
    MDBPopoverBody,
    MDBListGroup,
    MDBListGroupItem,
    MDBRipple,
} from 'mdb-react-ui-kit';
import NavbarCompoent from '../NavbarComponent/NavbarComponent';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '~/services/UserService'
import { resetUser } from '~/redux/slides/userSlide';
import Loading from '../LoadingComponent/Loading';

const HeaderComponent = ({ showNav = true, color = '#007bff' }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [userName, setUserName] = useState(false)
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const handleNavigateLogin = () => {
        navigate('/sign-in')
    }
    useEffect(() => {
        setLoading(true)
        setUserName(user?.name)
        setLoading(false)
    }, [user?.name])

    const contentChildren = (
        <div style={{ display: 'inline-block' }}>
            <Loading isLoading={loading} color='#54b4d3'>
                {userName}
            </Loading>
        </div>
    )
    const handleLogout = async () => {
        setLoading(true)
        console.log('Logout')
        await UserService.logoutUser()
        dispatch(resetUser())
        setLoading(false)
    }
    return (
        <>
            <div className="p-2 text-dark header-container" style={{ backgroundColor: color }}>
                <MDBContainer>
                    <MDBRow className="header-row">
                        <MDBCol md='9'>
                            <MDBCol lg='6' className='d-flex justify-content-start'>
                                <div className='d-flex align-items-center' style={{ fontSize: '40px', fontWeight: 'bold', color: 'white' }}>
                                    <img src={logo} className='img-fluid' style={{ width: '80px' }} alt='' />
                                    <div>HKT-D-SHOP</div>
                                </div>
                            </MDBCol>
                        </MDBCol>
                        <MDBCol md='3' className='d-flex justify-content-end align-items-end actions-col'>
                            {user?.name ? (
                                <MDBPopover className='mt-2' btnChildren={contentChildren} placement='bottom' color='light' rippleColor='dark' dismiss>
                                    <MDBPopoverBody className='p-2'>
                                        <MDBListGroup style={{ minWidth: '150px' }} light>
                                            <MDBRipple>
                                                <MDBListGroupItem aria-current='true' onClick={() => navigate('/profile-user')} noBorders className='nameListTitle mb-1 rounded-1'>
                                                    Details Profile
                                                </MDBListGroupItem>
                                            </MDBRipple>
                                            <MDBRipple>
                                                {user?.role === 'admin' && (
                                                    <MDBListGroupItem aria-current='true' noBorders className='nameListTitle mb-1 rounded-1' onClick={() => { navigate('/system/admin') }} >
                                                        Admin Panel
                                                    </MDBListGroupItem>
                                                )}
                                            </MDBRipple>
                                            <MDBRipple>
                                                <MDBListGroupItem aria-current='true' onClick={handleLogout} noBorders className='nameListTitle logout textColorRed rounded-1'>
                                                    Log out
                                                </MDBListGroupItem>
                                            </MDBRipple>
                                        </MDBListGroup>
                                    </MDBPopoverBody>
                                </MDBPopover>
                            ) : (
                                <MDBBtn onClick={handleNavigateLogin} color='light' rippleColor='dark'>
                                    <MDBIcon className='me-1' icon="smile-wink" size='lg' />
                                    Account
                                </MDBBtn>
                            )}
                            {user?.role !== 'admin' && <Link to='/cart'>
                                <MDBBtn className='ms-1' color='light' rippleColor='dark'>
                                    <MDBIcon fas icon="shopping-cart" size='lg' />
                                </MDBBtn>
                            </Link>}
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
            {showNav && <MDBContainer>
                <NavbarCompoent />
            </MDBContainer>}
        </>
    )
}

export default HeaderComponent

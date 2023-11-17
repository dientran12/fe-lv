import React, { useEffect, useState } from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox,
    MDBIcon,
    MDBCardImage,
    MDBValidation,
    MDBValidationItem
}
    from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import * as UserService from '~/services/UserService'
import { useCustomMutation } from '~/hooks/useMutationHook';
import { toast } from 'react-toastify';
import Loading from '~/components/LoadingComponent/Loading';

function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const mutation = useCustomMutation(
        data => UserService.createUser(data)
    )
    const { data, isLoading, isSuccess, isError } = mutation;
    console.log('data status', data?.status)

    const handleCheckboxChange = () => {
        setShowPassword(!showPassword);
    };

    const handleOnchangeEmail = (e) => {
        setEmail(e.target.value)
    }
    const handleOnchangePassword = (e) => {
        setPassword(e.target.value)
    }
    const handleOnchangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value)
    }

    useEffect(() => {
        if (data?.status === 'OK') {
            toast.success('Create account is Success', {
                // position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
            navigate('/sign-in');
        }
        if (data?.status === 'error') {
            toast.error(<div>Create account is fail!<br /><div style={{ color: 'red', fontWeight: 'bold' }}>{data?.message}</div></div>, {
                // position: "top-center",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.status])

    const handleSignUp = (e) => {
        console.log('sign in', email, password, confirmPassword)
        try {
            mutation.mutate({
                email,
                password,
                confirmPassword
            })
        } catch (error) {
            console.log('error', error)
            toast.error('Sign Up Fail');
        }
    }

    const handleNavigateLogin = () => {
        navigate('/sign-in')
    }
    return (
        <div className='blur-background'>
            <MDBContainer >
                <MDBRow className="my-5 d-flex justify-content-center align-content-center" style={{ height: '90vh' }}>
                    <MDBCard className="my-5 pt-5 pb-3" style={{ maxWidth: '800px' }}>
                        <div className=" d-flex justify-content-center ">
                            <MDBCardBody className='d-flex flex-column' style={{ maxWidth: '500px' }}>

                                <div className='d-flex flex-row mt-2'>
                                    <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#ff6219' }} />
                                    <span className="h1 fw-bold mb-0">Sign Up</span>
                                </div>

                                <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>Create your account</h5>
                                <MDBValidation>
                                    <MDBValidationItem feedback='Please enter an email address' invalid>
                                        <MDBInput wrapperClass='mb-4' value={email} onChange={handleOnchangeEmail} required label='Email address' id='inputEmail' type='email' size="lg" />
                                    </MDBValidationItem>
                                    <MDBValidationItem feedback='Password is required' invalid>
                                        <MDBInput wrapperClass='mb-4' label='Password' id='inputPass' type={showPassword ? 'text' : 'password'} required value={password} onChange={handleOnchangePassword} size='lg' />
                                    </MDBValidationItem>
                                    <MDBValidationItem feedback='Please confirm your password' invalid>
                                        <MDBInput label='Confirm password' id='inputConFirmPass' type={showPassword ? 'text' : 'password'} required value={confirmPassword} onChange={handleOnchangeConfirmPassword} size='lg' />
                                    </MDBValidationItem>
                                    <div className='mb-4'>
                                        <input
                                            type='checkbox'
                                            name='flexCheck'
                                            id='flexCheckDefault'
                                            checked={showPassword}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor='flexCheckDefault' className='ms-2' style={{ fontSize: '14px' }}>
                                            Show
                                        </label>
                                    </div>

                                    <a className="small text-muted" href="/sign-in" >Have account?</a>
                                    <MDBBtn className="mb-4 px-5" onClick={handleSignUp} color='dark' size='lg' style={{ float: 'right' }}>
                                        <Loading isLoading={isLoading} color='#b9cdc9'>
                                            Sign Up
                                        </Loading>
                                    </MDBBtn>
                                </MDBValidation>
                            </MDBCardBody>
                        </div>
                    </MDBCard>
                </MDBRow>

            </MDBContainer>

        </div>
    );
}

export default App;

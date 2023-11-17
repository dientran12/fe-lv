import React from 'react';
import {
    MDBFooter,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBCol,
    MDBRow,
    MDBBtn
} from 'mdb-react-ui-kit';

export default function FooterComponent() {
    return (
        <MDBFooter className='text-center' color='white' bgColor='dark'>
            <MDBContainer className='p-4'>
                <section className='mb-4'>
                    <MDBBtn className='m-1' style={{ backgroundColor: '#3b5998' }} href='#'>
                        <MDBIcon fab icon='facebook-f' />
                    </MDBBtn>

                    <MDBBtn className='m-1' style={{ backgroundColor: '#55acee' }} href='#'>
                        <MDBIcon fab icon='twitter' />
                    </MDBBtn>

                    <MDBBtn className='m-1' style={{ backgroundColor: '#dd4b39' }} href='#'>
                        <MDBIcon fab icon='google' />
                    </MDBBtn>

                    <MDBBtn className='m-1' style={{ backgroundColor: '#ac2bac' }} href='#'>
                        <MDBIcon fab icon='instagram' />
                    </MDBBtn>

                    <MDBBtn className='m-1' style={{ backgroundColor: '#0082ca' }} href='#'>
                        <MDBIcon fab icon='linkedin-in' />
                    </MDBBtn>
                </section>

                <section className=''>
                </section>

                {/* <section className=''>
                    <MDBRow>
                        <MDBCol lg='3' md='6' className='mb-4 mb-md-0'>
                            <h5 className='text-uppercase'>Links</h5>

                            <ul className='list-unstyled mb-0'>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Link 1
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Link 2
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Link 3
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Link 4
                                    </a>
                                </li>
                            </ul>
                        </MDBCol>

                        <MDBCol lg='3' md='6' className='mb-4 mb-md-0'>
                            <h5 className='text-uppercase'>Links</h5>

                            <ul className='list-unstyled mb-0'>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Link 1
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Link 2
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Link 3
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Link 4
                                    </a>
                                </li>
                            </ul>
                        </MDBCol>

                        <MDBCol lg='3' md='6' className='mb-4 mb-md-0'>
                            <h5 className='text-uppercase'>Links</h5>

                            <ul className='list-unstyled mb-0'>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Link 1
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Link 2
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Link 3
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Link 4
                                    </a>
                                </li>
                            </ul>
                        </MDBCol>

                        <MDBCol lg='3' md='6' className='mb-4 mb-md-0'>
                            <h5 className='text-uppercase'>Links</h5>

                            <ul className='list-unstyled mb-0'>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Link 1
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Link 2
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Link 3
                                    </a>
                                </li>
                                <li>
                                    <a href='#!' className='text-white'>
                                        Link 4
                                    </a>
                                </li>
                            </ul>
                        </MDBCol>
                    </MDBRow>
                </section> */}
            </MDBContainer>

            <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                © 2023 Copyright:
                <a className='text-white' href='#'>
                    HKTDshop.com
                </a>
            </div>
        </MDBFooter>
    );
}

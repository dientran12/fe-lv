import React, { useEffect, useState } from 'react';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
} from 'mdb-react-ui-kit';
import InputAndSubmit from '~/components/InputComponent/InputAndSubmit';
import ChooseImageAndSubmit from '~/components/InputComponent/ChooseImageAndSubmit';
import { useSelector } from 'react-redux';
import Loading from '~/components/LoadingComponent/Loading';

export default function ProfilePage() {
    const user = useSelector((state) => state.user)
    const [image, setImage] = useState(user?.image);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        setImage(user?.image)
        setLoading(false)
    }, [user?.image])

    return (
        <section>
            <MDBContainer className="py-5">
                <MDBRow>
                    <MDBCol lg="4">
                        <MDBCard className="mb-4" >
                            <MDBCardBody className="text-center" style={{ height: "300px" }}>
                                <Loading isLoading={loading}>
                                    {image ?
                                        <MDBCardImage
                                            src={image}
                                            alt="avatar"
                                            className="rounded-circle"
                                            style={{ width: '150px', height: '150px' }}
                                            fluid />
                                        :
                                        <MDBCardImage
                                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                                            alt="avatar"
                                            className="rounded-circle"
                                            style={{ width: '150px', height: '150px' }}
                                            fluid />
                                    }
                                </Loading>
                                <div className="d-flex justify-content-center mb-2 mt-5">
                                    <ChooseImageAndSubmit />
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol lg="8">
                        <MDBCard className="mb-4">
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Full Name</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <InputAndSubmit nameDataFile='name' />
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Email</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <InputAndSubmit nameDataFile='email' />
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Phone</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <InputAndSubmit nameDataFile='phone' type='number' />
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Address</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <InputAndSubmit nameDataFile='address' />
                                    </MDBCol>
                                </MDBRow>

                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
    );
}

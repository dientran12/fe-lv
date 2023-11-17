import { MDBBtn } from 'mdb-react-ui-kit'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const ButtonDetailProductComponent = () => {
    const navigate = useNavigate()

    return (
        <MDBBtn color='dark' className='p-2 bg-hover-red' onClick={() => navigate('/detail-product')}>Details</MDBBtn>
    )
}

export default ButtonDetailProductComponent

import { MDBContainer } from 'mdb-react-ui-kit';
import React from 'react'
import TableComponent from '../TableComponent/TableComponent';

const OrderComponent = () => {
    return (
        <MDBContainer className="pt-3 pb-3 mx-2" style={{ backgroundColor: 'white' }}>
            <span className="h2 fw-bold mb-0">
                Orders
                <hr className="my-3" /></span>
            <div style={{ marginTop: 20 }}>
                {/* <TableComponent  columns={column} data={dataTabel} /> */}
            </div>

        </MDBContainer >
    )
}

export default OrderComponent

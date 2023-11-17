import React from 'react';
import { MDBIcon, MDBBtn } from 'mdb-react-ui-kit';

function SimplePagination({ currentPage, totalPages, onPageChange }) {

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="d-flex justify-content-center">
            <div className="me-3 d-flex align-items-center" >
                <span className="text-danger" >{currentPage}</span>
                <span> / </span>
                <span>{totalPages}</span>
            </div>
            <MDBBtn className='px-3 py-2' color='light' disabled={currentPage <= 1} onClick={handlePrevious}>
                <MDBIcon fas icon="angle-left" size='xl' />
            </MDBBtn>
            <MDBBtn className='px-3 py-2' color='light' disabled={currentPage >= totalPages} onClick={handleNext}>
                <MDBIcon fas icon="angle-right" size='xl' />
            </MDBBtn>
        </div>
    );
}

export default SimplePagination;

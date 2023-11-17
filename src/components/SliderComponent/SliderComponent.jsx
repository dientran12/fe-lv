import React from 'react';
import {
    MDBCarousel,
    MDBCarouselItem,
} from 'mdb-react-ui-kit';

export default function SliderComponent({ listImage }) {
    return (
        <MDBCarousel showControls showIndicators>
            {listImage && listImage.map((item, index) => (
                <MDBCarouselItem
                    className='w-100 d-block'
                    itemId={index + 1}
                    key={index}
                    src={item}
                    alt='...'
                >
                </MDBCarouselItem>))}
        </MDBCarousel>
    );
}


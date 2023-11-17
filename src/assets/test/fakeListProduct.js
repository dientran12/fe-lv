import slider1 from '~/assets/images/slider_image1.jpg'
import slider2 from '~/assets/images/slider_image2.jpg'
import slider3 from '~/assets/images/slider_image3.jpg'
import slider4 from '~/assets/images/slider_image4.jpg'
import sp1 from '~/assets/images/chuot1.jpg'
import sp2 from '~/assets/images/banphim1.jpg'

export const listProduct1 = [
    { id: 1, name: 'Product 1', price: 10, image: slider1 },
    { id: 2, name: 'Product 2', price: 20, image: slider2 },
    { id: 3, name: 'Product 3', price: 30, image: slider3 },
    { id: 4, name: 'Product 4', price: 40, image: slider4 },
    { id: 5, name: 'Product 5', price: 50, image: sp1 },
    { id: 6, name: 'Product 6', price: 60, image: sp2 }
];
export const listProduct2 = [
    { id: 1, name: 'Product 1', price: 10, image: slider1 },
    { id: 2, name: 'Product 2', price: 20, image: slider2 },
    { id: 5, name: 'Product 5', price: 50, image: sp1 },
    { id: 6, name: 'Product 6', price: 60, image: sp2 }
];

export const listProduct3 = [
    { id: 1, name: 'Product 1', price: 10, image: slider1 },
    { id: 3, name: 'Product 3', price: 30, image: slider3 },
    { id: 4, name: 'Product 4', price: 40, image: slider4 },
    { id: 5, name: 'Product 5', price: 50, image: sp1 },
    { id: 6, name: 'Product 6', price: 60, image: sp2 }
];

export const listProduct4 = [
    { id: 1, name: 'Product 1', price: 10, image: slider1 },
    { id: 6, name: 'Product 6', price: 60, image: sp2 }
];

export const categoryList = [
    { idCat: 1, nameCat: 'Top sellers', listProduct: listProduct1 },
    { idCat: 2, nameCat: 'Computer Mouse', listProduct: listProduct2 },
    { idCat: 3, nameCat: 'Latest products', listProduct: listProduct3 },
    { idCat: 4, nameCat: 'Deals and discounts', listProduct: listProduct4 },
]


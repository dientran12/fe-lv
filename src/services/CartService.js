import axios from "axios"
import { axiosJWT } from "./UserService"

export const addProductToCart = async ({ sizeItemId, userId, token }) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/cart/addtocart`, { userId, sizeItemId }, {
        headers: {
            token: `Beare ${token}`
        }
    })
    return res.data
}

export const getAllProductOnCart = async (userId) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/cart/getalldata/${userId}`)
    return res.data
}

export const deleteProductOnCart = async ({ userId, sizeItemId, token }) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL_BACKEND}/cart/deletecart/${userId}/${sizeItemId}`, {
        headers: {
            token: `Beare ${token}`
        }
    })
    return res.data
}

export const updateCate = async ({ id, token, ...dataUpdate }) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL_BACKEND}/category/update/${id}`, dataUpdate, {
        headers: {
            token: `Beare ${token}`
        }
    })
    return res.data
}



export const getProductType = async ({ type, page = 1, limit = 6 }) => {
    if (type) {
        const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/category/get-all/?filter=type&filter=${type}&limit=${limit}&page=${page}`)
        return res.data
    }
}

export const getAllTypeProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/product/get-all-type`, {})
    return res.data
}

export const getDetailProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/product/get-product-by-id/${id}`)
    return res.data
}


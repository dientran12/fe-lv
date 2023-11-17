import axios from "axios"
import { axiosJWT } from "./UserService"

export const getAllPromotion = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/promotion/get-all`)
    return res.data
}

export const getAllProductOnPromotion = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/promotion/get-by-promotion/${id}`)
    return res.data
}

export const createPromotion = async ({ token, ...data }) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/promotion/create`, data, {
        headers: {
            token: `Beare ${token}`
        }
    })
    return res.data
}

export const updatePromotion = async ({ id, token, ...dataUpdate }) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL_BACKEND}/promotion/update/${id}`, dataUpdate, {
        headers: {
            token: `Beare ${token}`
        }
    })
    return res.data
}

export const deletePromotion = async (id, token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL_BACKEND}/promotion/delete/${id}`, {
        headers: {
            token: `Beare ${token}`
        }
    })
    return res.data
}

export const getDetailPromotion = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/promotion/get-by-id/${id}`)
    console.log("detail promotion", res.data)
    return res.data
}

export const addPromotionForProduct = async ({ productId, promotionId, token }) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL_BACKEND}/promotion/products/${productId}/promotions/${promotionId}`, {
        headers: {
            token: `Beare ${token}`
        }
    })
    return res.data
}

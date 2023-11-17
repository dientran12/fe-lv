import axios from "axios"
import { axiosJWT } from "./UserService"

export const getAllColor = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/color/get-all`)
    return res.data
}

export const createColor = async ({ token, ...data }) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/category/create`, data, {
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

export const deleteCate = async (id, token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL_BACKEND}/category/delete/${id}`, {
        headers: {
            token: `Beare ${token}`
        }
    })
    return res.data
}

export const getAllProductOnCate = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/category/get-by-category/${id}`)
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


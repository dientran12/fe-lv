import axios from "axios"
import { axiosJWT } from "./UserService"

export const getAllSize = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/size/all}`)
    return res.data
}

export const createSize = async ({ token, ...data }) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/size/create`, data, {
        headers: {
            token: `Beare ${token}`
        }
    })
    return res.data
}
export const createSizeItem = async ({ token, ...data }) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/sizeitem/add-sizeitem`, data, {
        headers: {
            token: `Beare ${token}`
        }
    })
    return res.data
}

export const getDetailSizeItem = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/sizeitem/get-detail/${id}`)
    return res.data
}

export const updateSizeItem = async ({ id, token, ...dataUpdate }) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL_BACKEND}/sizeitem/update-sizeitem/${id}`, dataUpdate, {
        headers: {
            token: `Beare ${token}`
        }
    })
    return res.data
}

export const deleteSizeItem = async (id, token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL_BACKEND}/sizeitem/delete-sizeitem/${id}`, {
        headers: {
            token: `Beare ${token}`
        }
    })
    return res.data
}

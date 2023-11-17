import axios from "axios";

export const axiosJWT = axios.create()

export const loginUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/sign-in`, data)
    return res.data
}

export const createUser = async (data) => {
    console.log('data createuser', data)
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/sign-up`, data)
    return res.data
}

export const getDetailsUser = async (id, accessToken) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL_BACKEND}/user/get-details/${id}`, {
        headers: {
            token: `Beare ${accessToken}`
        }
    })
    return res.data
}

export const deleteUser = async (id, accessToken) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL_BACKEND}/user/delete/${id}`, {
        headers: {
            token: `Beare ${accessToken}`
        }
    })
    return res.data
}

export const getAllUser = async (accessToken) => {
    console.log('accessToken', accessToken)
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL_BACKEND}/user/get-all`, {
        headers: {
            token: `Beare ${accessToken}`
        }
    })
    return res.data
}

export const refreshToken = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/refresh-token`, {
        withCredentials: true
    })
    return res.data
}

export const logoutUser = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/log-out`)
    localStorage.removeItem('accessToken');
    return res.data
}

export const updateUser = async (id, data, accessToken) => {
    console.log("data in updateUser", data)
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL_BACKEND}/user/update/${id}`, data, {
        headers: {
            token: `Beare ${accessToken}`
        }
    })
    return res.data
}

import React, { Fragment, useEffect, useState } from 'react'
import { routes } from "~/routes";
import DefaultComponent from "~/components/DefaultComponent/DefaultComponent.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isJsonString } from './utils';
import jwt_decode from "jwt-decode";
import { useDispatch } from 'react-redux';
import { updateUser } from './redux/slides/userSlide';
import * as UserService from '~/services/UserService'
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true)
    setIsLogin(localStorage.getItem('accessToken'))
    const { storageData, decoded } = handleDecoded()
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData)
    }
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDecoded = () => {
    let storageData = localStorage.getItem('accessToken')
    let decoded = {}
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      decoded = jwt_decode(storageData)
    }
    return { decoded, storageData }
  }

  const handleGetDetailsUser = async (id, token) => {
    const response = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...response?.data, accessToken: token }))
    setIsLoading(false)
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const { storageData, decoded } = handleDecoded()
    const currentTime = new Date().getTime()
    if (decoded?.exp < currentTime / 1000) {
      const data = await UserService.refreshToken()
      config.headers['token'] = `Beare ${data?.accessToken}`
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  return (
    <>
      <Router>
        <Routes>
          {
            routes.map((route, index) => {
              const Page = route.page
              let Layout = route.isShowHeader ? DefaultComponent : Fragment
              return (
                <Route path={route.path} key={index} element={
                  <Layout>
                    <Page />
                  </Layout>
                } />
              )
            })}
        </Routes>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App;

import HomePage from "~/Pages/HomePage/HomePage";
import OrderPage from "~/Pages/OrderPage/OrderPage";
import CartPage from "~/Pages/CartPage/CartPage";
import NotFoundPage from "~/Pages/NotFoundPage/NotFoundPage";
import SignInPage from "~/Pages/SignInPage/SignInPage";
import SignUpPage from "~/Pages/SignUpPage/SignUpPage";
import DetailProductPage from "~/Pages/DetailProductPage/DetailProductPage";
import ProfilePage from "~/Pages/ProfilePage/ProfilePage";
import AdminPage from "~/Pages/AdminPage/AdminPage";
import CategoryPage from "~/Pages/CategoryPage/CategoryPage";
import PagementPage from "~/Pages/PagementPage/PagementPage";
import PromotionPage from "~/Pages/PromotionPage/PromotionPage";


export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true
    },
    {
        path: '/promotion',
        page: PromotionPage,
        isShowHeader: true
    },
    {
        path: '/sign-in',
        page: SignInPage,
    },
    {
        path: '/sign-up',
        page: SignUpPage,
    },
    {
        path: '/detail-product/:key?',
        page: DetailProductPage,
        isShowHeader: true
    },
    {
        path: '/payment',
        page: PagementPage,
        isShowHeader: true
    },
    {
        path: '/system/admin/:key?',
        page: AdminPage,
        isShowHeaderAdmin: true
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true
    },
    {
        path: '/cart',
        page: CartPage,
        isShowHeader: true
    },
    {
        path: '/profile-user',
        page: ProfilePage,
        isShowHeader: true
    },
    {
        path: '/category',
        page: CategoryPage,
        isShowHeader: true
    },
    {
        path: '*',
        page: NotFoundPage
    }
]

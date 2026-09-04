import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Categories } from './components/manage/categories/categories';
import { CategoryForm } from './components/manage/category-form/category-form';
import { BrandsForm } from './components/manage/brands-form/brands-form';
import { Brands } from './components/manage/brands/brands';
import { Product } from './components/manage/product/product';
import { ProductForm } from './components/manage/product-form/product-form';
import { ProductList } from './components/product-list/product-list';
import { ProductDetail } from './components/product-detail/product-detail';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { ForgetPassword } from './components/forget-password/forget-password';
import { ResetPassword } from './components/reset-password/reset-password';
import { AdminDashboard } from './components/manage/admin-dashboard/admin-dashboard';
import { authGuard } from './core/guards/auth-guard';
import { CustomerProfile } from './components/customer-profile/customer-profile';
import { Wishlists } from './components/wishlists/wishlists';
import { ShoppingCart } from './components/shopping-cart/shopping-cart';

export const routes: Routes = [
    {
        path:"",
        component:Home
    },
    {
        path:"admin/categories",
        component:Categories,
        canActivate: [authGuard]
    },
    {
        path:"admin/categories/add",
        component:CategoryForm,
        canActivate: [authGuard]
    },
    {
        path:"admin/categories/:id",
        component:CategoryForm,
        canActivate: [authGuard]
    },
    {
        path:"admin/brands",
        component:Brands,
        canActivate: [authGuard]
    },
    {
        path:"admin/brands/add",
        component:BrandsForm,
        canActivate: [authGuard]
    },
    {
        path:"admin/brands/:id",
        component:BrandsForm,
        canActivate: [authGuard]
    },
    {
        path:"admin/products",
        component:Product,
        canActivate: [authGuard]
    },
    {
        path:"admin/products/add",
        component:ProductForm,
        canActivate: [authGuard]
    },
    { 
    path: 'admin/products/add/:id', 
    component: ProductForm ,
    canActivate: [authGuard]
    },
    { 
    path: 'products', 
    component: ProductList 
    },
    { 
    path: 'products/:id', 
    component: ProductDetail 
    },
    {
        path:'register',
        component:Register
    },
    {
    path: 'login',
    component: Login
  },
  {
  path: 'forgot-password',
  component: ForgetPassword
  },
  {
  path: 'reset-password',
  component: ResetPassword
  },
  {
  path: 'admin',
  component: AdminDashboard,
  canActivate: [authGuard]
  },
  {
  path: 'profile',
  component: CustomerProfile,
  },
  {
  path: 'wishlist',
  component: Wishlists,
  canActivate: [authGuard]
  },
  {
  path: 'cart',
  component: ShoppingCart,
  canActivate: [authGuard]
  }

];

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

export const routes: Routes = [
    {
        path:"",
        component:Home
    },
    {
        path:"admin/categories",
        component:Categories
    },
    {
        path:"admin/categories/add",
        component:CategoryForm
    },
    {
        path:"admin/categories/:id",
        component:CategoryForm
    },
    {
        path:"admin/brands",
        component:Brands
    },
    {
        path:"admin/brands/add",
        component:BrandsForm
    },
    {
        path:"admin/brands/:id",
        component:BrandsForm
    },
    {
        path:"admin/products",
        component:Product
    },
    {
        path:"admin/products/add",
        component:ProductForm
    },
    { 
    path: 'admin/products/add/:id', 
    component: ProductForm 
    },
    { 
    path: 'products', 
    component: ProductList 
    },
    { 
    path: 'products/:id', 
    component: ProductDetail 
    }

];

import React, { useContext } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from '../pages/home.jsx'
import About from '../pages/about.jsx'
import AdminService from '../pages/admin/adminservice.jsx'
import AdminKnowledge from '../pages/admin/adminknowledge.jsx'

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import App from '../App.jsx'
import AdminLayout from '../AdminLayout.jsx'
import ServiceForm from '../pages/admin/serviceForm.jsx'
import KnowledgeForm from '../pages/admin/knowledgeForm.jsx'
import AdminSecerity from '../pages/admin/adminsecurity.jsx'
import SecurityForm from "../pages/admin/securityForm.jsx"
import AdminSystem from "../pages/admin/adminsystem.jsx"
import SystemForm from '../pages/admin/systemForm.jsx'
import AdminNetWork from "../pages/admin/adminnetwork.jsx"
import NetWorkForm from '../pages/admin/networkForm.jsx'
import RegisterForm from '../pages/admin/registerForm.jsx'
import LoginForm from '../pages/admin/LoginForm.jsx'
import { AuthContext } from '../contexts/AuthContext.jsx'

import System from '../pages/system.jsx'
import Network from '../pages/network.jsx'
import Security from '../pages/security.jsx'
import Knowledge from '../pages/knowledge.jsx'
import Service from '../pages/service.jsx'
import ServiceDetail from '../pages/servicedetail.jsx'
import SystemDetail from "../pages/systemdetail.jsx"
import NetworkDetail from "../pages/networkdetail.jsx"
import KnowledgeDetail from "../pages/knowledgedetail.jsx"
import SecurityDetail from "../pages/securitydetail.jsx"
import AdminServiceDetail from "../pages/admin/adminservicedetail.jsx"
import AdminKnowledgeDetail from '../pages/admin/adminknowledgedetail.jsx'
import AdminSecerityDetail from '../pages/admin/adminseceritydetail.jsx'
import AdminSystemDetail from '../pages/admin/adminsystemdetail.jsx'
import AdminNetWorkDetail from '../pages/admin/adminnetworkdetail.jsx'
import AdminCategory from '../pages/admin/admincategory.jsx'
import AdminContactus from '../pages/admin/admincontact.jsx'
import Contactus from '../pages/contactus.jsx'
import AdminContactusDetail from '../pages/admin/admincontactdetail.jsx'
function Index() {
    let {user}=useContext(AuthContext)
    const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path : "/",
        element: <Home></Home>
      },
      {
        path : "/about",
        element: <About></About>
      },
     
       {
        path : "/network",
        element: <Network></Network>
      },
      {
        path : "/network/:id",
        element: <NetworkDetail></NetworkDetail>
      },
       {
        path : "/system",
        element: <System></System>
      },
      {
        path : "/system/:id",
        element: <SystemDetail></SystemDetail>
      },
       {
        path : "/security",
        element: <Security></Security>
      },
       {
        path : "/security/:id",
        element: <SecurityDetail></SecurityDetail>
      },
        {
        path : "/knowledge",
        element: <Knowledge></Knowledge>
      },
      {
        path : "/knowledge/:id",
        element: <KnowledgeDetail></KnowledgeDetail>
      },
       {
        path : "/service",
        element: <Service></Service>
      },
      {
        path : "/service/:id",
        element: <ServiceDetail></ServiceDetail>
      },
      {
        path : "/contactus",
        element: <Contactus></Contactus>
      }
      
    ]
  },
   {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path : "adminservice",
        element:  user ? <AdminService></AdminService> : <Navigate to={'/admin/login'}/>
      },
      {
        path : "adminservice/:id",
        element:  user ? <AdminServiceDetail></AdminServiceDetail> : <Navigate to={'/admin/login'}/>
      },
       {
        path : "adminservice/create",
        element: <ServiceForm></ServiceForm>
      },
       {
        path : "adminservice/edit/:id",
        element:  <ServiceForm></ServiceForm>
      },
       {
        path : "adminknowledge",
        element: <AdminKnowledge></AdminKnowledge>
      },
      {
        path : "adminknowledge/:id",
        element: <AdminKnowledgeDetail></AdminKnowledgeDetail>
      },
       {
        path : "adminknowledge/create",
        element: <KnowledgeForm></KnowledgeForm>
      },
      {
        path : "adminknowledge/edit/:id",
        element: <KnowledgeForm></KnowledgeForm>
      },  {
        path : "adminsecurity/:id",
        element: <AdminSecerityDetail></AdminSecerityDetail>
      },
      {
        path : "adminsecurity",
        element: <AdminSecerity></AdminSecerity>
      },
       {
        path : "adminsecurity/create",
        element: <SecurityForm ></SecurityForm >
      },
        {
        path : "adminsecurity/edit/:id",
        element: <SecurityForm ></SecurityForm >
      }
      ,{
        path:"adminsystems",
        element:<AdminSystem></AdminSystem>
      },
      {
        path:"adminsystems/:id",
        element:<AdminSystemDetail></AdminSystemDetail>
      },
      {
        path:"adminsystems/create",
        element:<SystemForm></SystemForm>
      },
       {
        path:"adminsystems/edit/:id",
        element:<SystemForm></SystemForm>
      },
       {
        path:"adminnetwork",
        element:<AdminNetWork></AdminNetWork>
      },
      {
        path:"adminnetwork/:id",
        element:<AdminNetWorkDetail></AdminNetWorkDetail>
      },
             {
        path:"adminnetwork/create",
        element:<NetWorkForm></NetWorkForm>
      },
        {
        path:"adminnetwork/edit/:id",
        element:<NetWorkForm></NetWorkForm>
      },
       {
        path:"admincategories",
        element:<AdminCategory></AdminCategory>
      },
      {
        path:"admincontactus",
        element:<AdminContactus></AdminContactus>
      },
      {
        path:"admincontactus/:id",
        element:<AdminContactusDetail></AdminContactusDetail>
      },
      {
        path:"register",
        element:!user ? <RegisterForm></RegisterForm> : <Navigate to={'/admin/adminservice'}/>
    
       },
            {
        path:"login",
        element: !user ? <LoginForm></LoginForm>  : <Navigate to={'/admin/adminservice'}/>
      
      }
      
      

    ]
  }
]);
  return (
    <RouterProvider router={router} />
  )
}

export default Index
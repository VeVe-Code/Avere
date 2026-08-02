import React from 'react'
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
import Product from '../pages/product.jsx'
import AdminSecerity from '../pages/admin/adminsecurity.jsx'
import SecurityForm from "../pages/admin/securityForm.jsx"
import AdminSystem from "../pages/admin/adminsystem.jsx"
import SystemForm from '../pages/admin/systemForm.jsx'
import AdminNetWork from "../pages/admin/adminnetwork.jsx"
import NetWorkForm from '../pages/admin/networkForm.jsx'
import RegisterForm from '../pages/admin/registerForm.jsx'
import LoginForm from '../pages/admin/LoginForm.jsx'
import VerifyEmail from '../pages/VerifyEmail.jsx'

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
import Adminevents from '../pages/admin/adminevents.jsx' 
import EventsForm from '../pages/admin/eventsForm.jsx'
import AdminEventDetail from '../pages/admin/admineventdetail.jsx'
import Contactus from '../pages/contactus.jsx'
import Events from "../pages/Events.jsx"
import EventDetail from '../pages/EventDetail.jsx'
import AdminContactusDetail from '../pages/admin/admincontactdetail.jsx'
import Position from '../pages/position.jsx'
import PositionDetail from '../pages/positiondetail.jsx'
import AdminPosition from '../pages/admin/adminposition.jsx'
import AdminPositionDetail from '../pages/admin/adminpositiondetail.jsx'
import AdminSettings from '../pages/admin/adminsettings.jsx'
import AdminUsers from '../pages/admin/adminusers.jsx'
import Library from '../pages/library.jsx'
import Profile from '../pages/profile.jsx'
import Settings from '../pages/settings.jsx'
function Index() {
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
        path : "/product",
        element: <Product></Product>
      },
      {
        path : "/about",
        element: <About></About>
      },
      {
        path : "/login",
        element: <LoginForm />
      },
      {
        path : "/register",
        element: <RegisterForm />
      },
      {
        path : "/verify-email",
        element: <VerifyEmail />
      },
      {
        path : "/library",
        element: <Library />
      },
      {
        path : "/profile",
        element: <Profile />
      },
      {
        path : "/settings",
        element: <Settings />
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
      },
         {
        path : "/events",
        element: <Events></Events>
      },
      {
        path : "/events/:id",
        element: <EventDetail></EventDetail>
      },
      {
        path : "/position",
        element: <Position></Position>
      },
      {
        path : "/position/:id",
        element: <PositionDetail></PositionDetail>
      },
      
    ]
  },
   {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path : "adminservice",
        element: <AdminService></AdminService>
      },
      {
        path : "adminservice/:id",
        element: <AdminServiceDetail></AdminServiceDetail>
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
        path:"adminevents",
        element:<Adminevents></Adminevents>
      },
      {
        path:"adminevents/:id",
        element:<AdminEventDetail></AdminEventDetail>
      },
      {
        path:"adminevents/create",
        element:<EventsForm></EventsForm>
      },
      {
        path:"adminevents/edit/:id",
        element:<EventsForm></EventsForm>
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
        path:"adminposition",
        element:<AdminPosition></AdminPosition>
      },
      {
        path:"adminposition/:id",
        element:<AdminPositionDetail></AdminPositionDetail>
      },
      {
        path:"adminusers",
        element:<AdminUsers></AdminUsers>
      },
      {
        path:"adminsettings",
        element:<AdminSettings />
      },
      {
        path:"register",
        element: <Navigate to="/register" replace />
       },
            {
        path:"login",
        element: <Navigate to="/login" replace />
      }
      
      

    ]
  }
]);
  return (
    <RouterProvider router={router} />
  )
}

export default Index

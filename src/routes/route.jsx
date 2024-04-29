import {createBrowserRouter} from "react-router-dom";
import Login from "@pages/Authentication/Login";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "@/layout/DashboardLayout";
import Dashboard from "@pages/Dashboard/Dashboard";
import Table from "@/pages/Table/Table";
import TableList from "@/pages/Table/components/TableList";
import TableForm from "@/pages/Table/components/TableForm";
import Menu from "@/pages/Menu/Menu";
import MenuList from "@/pages/Menu/components/MenuList";
import MenuForm from "@/pages/Menu/components/MenuForm";
import Customer from "@/pages/Customer/Customer";
import CustomerList from "@/pages/Customer/components/CustomerList";
import CosutomerUpdate from "@pages/Customer/components/CosutomerUpdate.jsx";
import CustomerCreate from "@pages/Customer/components/CustomerCreate.jsx";
import NotFound from "@shared/components/Error/NotFound.jsx";
import TransactionList from "@pages/Transaction/components/TransactionList.jsx";
import TransactionOrder from "@pages/Transaction/components/TransactionOrder.jsx";

const router = createBrowserRouter([
    {
        path: "*",
        element: <NotFound/>
    },
    {
        path: "/",
        element: <Login/>
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <DashboardLayout/>
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard/>
            },
            {
                path: "table",
                element: <Table/>,
                children: [
                    {
                        index: true,
                        element: <TableList/>,
                    },
                    {
                        path: "new",
                        element: <TableForm/>,
                    },
                    {
                        path: "update/:id",
                        element: <TableForm/>,
                    },
                ],
            },
            {
                path: "menu",
                element: <Menu/>,
                children: [
                    {
                        index: true,
                        element: <MenuList/>,
                    },
                    {
                        path: "new",
                        element: <MenuForm/>,
                    },
                    {
                        path: "update/:id",
                        element: <MenuForm/>,
                    },
                ],
            },
            {
                path: "customer",
                element: <Customer/>,
                children: [
                    {
                        index: true,
                        element: <CustomerList pageName="customer"/>,
                    },
                    {
                        path: "new",
                        element: <CustomerCreate pageName="customer"/>,
                    },
                    {
                        path: "update/:id",
                        element: <CosutomerUpdate pageName="customer"/>,
                    },
                ],
            },
            {
                path: "admin",
                element: <Customer/>,
                children: [
                    {
                        index: true,
                        element: <CustomerList pageName="admin"/>,
                    },
                    {
                        path: "new",
                        element: <CustomerCreate pageName="admin"/>,
                    },
                    {
                        path: "update/:id",
                        element: <CosutomerUpdate pageName="admin"/>,
                    },
                ],
            },
            {
                path: "transaction",
                element: <Customer/>,
                children: [
                    {
                        index: true,
                        element: <TransactionList/>,
                    },
                    {
                        path: "order",
                        element: <TransactionOrder/>,
                    },
                ],
            },
        ]
    },
]);

export default router;
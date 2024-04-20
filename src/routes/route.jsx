import { createBrowserRouter } from "react-router-dom";
import Login from "@pages/Authentication/Login";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "@/layout/DashboardLayout";
import Dashboard from "@pages/Dashboard/Dashboard";
import Table from "../pages/Table/Table";
import TableList from "../pages/Table/components/TableList";
import TableForm from "../pages/Table/components/TableForm";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: "table",
                element: <Table />,
                children: [
                    {
                        index: true,
                        element: <TableList />,
                    },
                    {
                        path: "new",
                        element: <TableForm />,
                    },
                    {
                        path: "update",
                        element: <TableForm />,
                    },
                ],
            },
        ]
    },
]);

export default router;
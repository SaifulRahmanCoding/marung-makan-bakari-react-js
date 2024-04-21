import { Outlet } from "react-router-dom"

function Customer() {
    return (
        <div className="p-4">
            <Outlet />
        </div>
    )
}

export default Customer

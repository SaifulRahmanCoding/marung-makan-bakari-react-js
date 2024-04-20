import { Outlet } from "react-router-dom"

function Table() {
    return (
        <div>
            <div className="p-4">
                <Outlet />
            </div>
        </div>
    )
}

export default Table

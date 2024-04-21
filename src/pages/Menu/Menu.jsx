import { Outlet } from "react-router-dom"

function Menu() {
    return (
        <div className="p-4">
            <Outlet />
        </div>
    )
}

export default Menu;

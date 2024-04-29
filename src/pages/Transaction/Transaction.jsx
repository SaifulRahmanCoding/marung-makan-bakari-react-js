import {Outlet} from "react-router-dom";

function Transaction() {
    return (
        <div className="p-4">
            <Outlet/>
        </div>
    );
}

export default Transaction;
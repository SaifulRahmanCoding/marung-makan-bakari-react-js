import errorImage from "@assets/images/not_found.svg"
import {Link} from "react-router-dom";

function NotFound() {
    return (
        <div className="page-not-found">
            <img
                style={{width: 600}}
                className="img-fluid my-4"
                src={errorImage}
                alt="page not found"
            />
            <Link to={"/"} className="btn btn-primary mt-4">Kembali ke menu utama</Link>
        </div>
    );
}

export default NotFound;
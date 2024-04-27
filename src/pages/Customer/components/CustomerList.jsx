import {IconEditCircle} from "@tabler/icons-react";
import {IconTrash} from "@tabler/icons-react";
import {IconPlus} from "@tabler/icons-react";
import {useMemo} from "react";
import {useState} from "react";
import {Link} from "react-router-dom";
import CustomerService from "@/services/CustomerService";
import {useEffect} from "react";
import {useContext} from "react";
import {MyContext} from "@/MyContext";
import Swal from 'sweetalert2';
import {useSearchParams} from "react-router-dom";
import {useForm} from "react-hook-form";

function CustomerList({pageName}) {
    const [customers, setCustomers] = useState([]);
    const [searchParam, setSearchParam] = useSearchParams();
    const {handleSubmit, register} = useForm();
    const customerService = useMemo(() => CustomerService(), []);
    const {showPopup} = useContext(MyContext);
    const [reload, setReload] = useState(false);

    const search = searchParam.get("q") || "";
    const page = searchParam.get("page") || "1";
    const size = searchParam.get("size") || "10";

    const [paging, setPaging] = useState({
        page: page,
        size: size,
        totalElement: 0,
        totalPages: 1,
        hasPrevious: false,
        hasNext: false,
    });
    let index = (paging.page - 1) * paging.size;
    const onSubmitSearch = ({search}) => {
        setSearchParam({q: search || "", page: page, size: size});
    }
    const handleNavigatePage = (number) => {
        setSearchParam({q: "", page: +page + number, size: size});
    }

    const navigatePage = (page) => {
        if (!page) return;
        setSearchParam({q: "", page: page, size: size});
    };

    function capitalizeFirstWord(sentence) {
        return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    }

    const onChangeSize = (e) => {
        setPaging({
            ...paging,
            size: e.target.value,
        });
        setSearchParam({size: e.target.value});
    };
    const handleDelete = async (id) => {
        const confirmation = await Swal.fire({
            title: 'Hapus Data',
            text: 'Apakah Anda yakin ingin melanjutkan?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak',
        });

        if (!confirmation.isConfirmed) return;
        try {
            const response = await customerService.deleteById(id);
            showPopup("Hapus", response.statusCode);
            if (response.statusCode === 200) {
                const data = await customerService.getAll();
                setCustomers(data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const updateStatusMember = async (id, statusMember) => {
        const confirmation = await Swal.fire({
            title: 'Ubah Data Status Member',
            text: 'Apakah Anda yakin ingin melanjutkan?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak',
        });
        if (!confirmation.isConfirmed) return;
        try {
            const response = await customerService.updateStatus(id, statusMember);
            setReload(!reload);
            showPopup("Update", response.statusCode);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        const getCustomers = async () => {
            try {
                const data = await customerService.getAll({
                    q: search,
                    size: size,
                    page: page,
                });
                pageName !== "admin" ? setCustomers(data.data.filter((cs) => cs.role === "ROLE_CUSTOMER")) : setCustomers(data.data.filter((cs) => cs.role === "ROLE_ADMIN"));
                setPaging(data.paging);
            } catch (error) {
                console.log(error);
            }
        };
        getCustomers();
    }, [customerService, search, searchParam, size, page, reload, pageName]);

    return (
        <div className="p-4 shadow-sm rounded-2">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>{capitalizeFirstWord(pageName.toString())} List</h3>
                <Link className="btn btn-primary"
                      to={pageName !== "admin" ? "/dashboard/customers/new" : "/dashboard/admin/new"}>
                    <i className="me-2">
                        <IconPlus/>
                    </i>
                    Tambah {capitalizeFirstWord(pageName.toString())}
                </Link>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="row">
                    <div className="col-12">
                        <select onChange={onChangeSize} value={size} className="form-select" name="sizeOpt"
                                id="sizeOpt">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmitSearch)} autoComplete="off">
                    <input
                        {...register("search")}
                        placeholder="search"
                        className="form-control"
                        type="search"
                        name="search"
                        id="search"
                    />
                </form>
            </div>

            <hr/>
            <div className="table-responsive mt-4">
                <table className="table overflow-auto">
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Username</th>
                        <th>Nama</th>
                        <th>Nomor Handpone</th>
                        <th>Status Member</th>
                        <th>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        (customers.length < 1)
                            ?
                            <>
                                <tr>
                                    <td colSpan="6" style={{textAlign: "center"}}>Tidak Ada Data</td>
                                </tr>
                            </>
                            :
                            customers.map((customer) => {
                                return (
                                    <tr key={customer.id}>
                                        <td>{++index}</td>
                                        <td>{customer.username}</td>
                                        <td>{customer.name}</td>
                                        <td>{customer.mobilePhoneNo}</td>
                                        <td>
                                            <div onClick={() => updateStatusMember(customer.id, !customer.isMember)}
                                                 className="form-check form-switch">
                                                <input className="form-check-input" style={{width: 40, height: 20}}
                                                       type="checkbox"
                                                       role="switch"
                                                       id={`isMember${index}`} checked={customer.isMember}/>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="btn-group">
                                                <Link
                                                    to={pageName !== "admin" ? `/dashboard/customers/update/${customer.id}` : `/dashboard/admin/update/${customer.id}`}
                                                    className="btn btn-primary">
                                                    <i><IconEditCircle/></i>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(customer.id)}
                                                    className="btn btn-danger">
                                                    <i className="text-white">
                                                        <IconTrash/>
                                                    </i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>

            <div className="d-flex align-items-center justify-content-between mt-4">
                <small>Show
                    data {((paging.page - 1) * paging.size) + 1} to {paging.size * paging.page > paging.totalElement ? paging.totalElement : paging.size * paging.page} of {paging.totalElement} entries</small>
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li
                            className={`page-item ${!paging.hasPrevious ? "disabled" : ""}`}
                        >
                            <button
                                disabled={!paging.hasPrevious}
                                onClick={() => handleNavigatePage(-1)}
                                className="page-link"
                            >
                                Previous
                            </button>
                        </li>
                        {[...Array(paging.totalPages)].map((_, index) => {
                            const currentPage = index + 1;
                            return (
                                <li
                                    key={index}
                                    className={`page-item ${paging.page === currentPage ? "active" : ""
                                    }`}
                                >
                                    <button
                                        onClick={() => navigatePage(currentPage)}
                                        className="page-link"
                                    >
                                        {currentPage}
                                    </button>
                                </li>
                            );
                        })}
                        <li className={`page-item ${!paging.hasNext ? "disabled" : ""}`}>
                            <button
                                disabled={!paging.hasNext}
                                className="page-link"
                                onClick={() => handleNavigatePage(1)}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default CustomerList

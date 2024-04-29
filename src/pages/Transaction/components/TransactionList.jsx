import {useEffect, useMemo, useState} from "react";
import TransactionService from "@services/TransactionService.js";
import {useSearchParams} from "react-router-dom";
import {IconPlus} from "@tabler/icons-react";
import {Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import {IconChevronDown} from "@tabler/icons-react";

function TransactionList() {
    const [transactions, setTransactions] = useState([]);
    const [transactionsDetails, setTransactionsDetails] = useState([]);
    const transactionService = useMemo(() => TransactionService(), []);
    const {handleSubmit, register} = useForm();
    const [searchParam, setSearchParam] = useSearchParams();

    const search = searchParam.get("q") || "";
    const page = searchParam.get("page") || "1";
    const size = searchParam.get("size") || "10";
    const [reload, setReload] = useState(false);
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
    const onChangeSize = (e) => {
        setPaging({
            ...paging,
            size: e.target.value,
        });
        setSearchParam({size: e.target.value});
    };
    const convertToRupiah = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR"
        }).format(price);
    }
    const getTransactionDetails = (id) => {
        const trx = transactions.filter((transaction) => transaction.id === id);
        setTransactionsDetails(trx[0].billDetails);
    }
    const getTotalPriceTransactionDetails = (trxDetails) => {
        let total = 0;
        for (let i = 0; i < trxDetails.length; i++) {
            total += (trxDetails[i].price * trxDetails[i].quantity)
        }
        return total;
    }
    useEffect(() => {
        const getTransaction = async () => {
            try {
                const data = await transactionService.getAll({
                    q: search,
                    size: size,
                    page: page,
                });
                setTransactions(data.data);
                setPaging(data.paging);
            } catch (error) {
                console.log(error);
            }
        };
        getTransaction();
    }, [transactionService, search, searchParam, size, page, reload]);
    return (
        <div className="p-4 shadow-sm rounded-2">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Transaction List</h3>
                <Link className="btn btn-primary"
                      to={"/dashboard/transaction/new"}>
                    <i className="me-2">
                        <IconPlus/>
                    </i>
                    Tambah Transaction
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
                        <th>Nama</th>
                        <th>Transaction Date</th>
                        <th>Tipe</th>
                        <th>Meja</th>
                        <th>Status Pembayaran</th>
                        <th>Detail Transaksi</th>
                        <th>Total Harga</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        (transactions.length < 1)
                            ?
                            <>
                                <tr>
                                    <td colSpan="6" style={{textAlign: "center"}}>Tidak Ada Data</td>
                                </tr>
                            </>
                            :
                            transactions.map((transaction) => {
                                return (
                                    <tr key={transaction.id}>
                                        <td>{++index}</td>
                                        <td>{transaction.customerName}</td>
                                        <td>{transaction.transDate}</td>
                                        <td>{transaction.transType}</td>
                                        <td>{transaction.tableName !== null ? transaction.tableName : "-"}</td>
                                        <td>
                                            <span
                                                className="badge text-bg-secondary">{transaction.paymentResponse.transactionStatus}</span>
                                        </td>
                                        <td>
                                            <button onClick={() => getTransactionDetails(transaction.id)} type="button"
                                                    className="btn btn-primary btn-sm"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#staticBackdrop">
                                                view details
                                                <IconChevronDown className="ms-1" size={16}/>
                                            </button>
                                        </td>
                                        <td>{convertToRupiah(getTotalPriceTransactionDetails(transaction.billDetails))}</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>

            <div className="d-flex align-items-center justify-content-between mt-4">
                <small>Show
                    data {((paging.page - 1) * paging.size) + 1} to {paging.size * paging.page > transactions.length ? transactions.length : paging.size * paging.page} of {transactions.length} entries</small>
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
            {/*Moadl Transaction Details*/}
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"
                 tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Detail Transaksi</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="table-responsive">
                                <table className="table overflow-auto">
                                    <thead>
                                    <tr>
                                        <th>Menu</th>
                                        <th>Harga</th>
                                        <th>Kuantitas</th>
                                        <th>Sub Total</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        transactionsDetails.map((detail) => {
                                            return (
                                                <tr key={detail.id}>
                                                    <td>{detail.menuName}</td>
                                                    <td>{convertToRupiah(detail.price)}</td>
                                                    <td>{detail.quantity}</td>
                                                    <td>{convertToRupiah(detail.price * detail.quantity)}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                    <tr>
                                        <td colSpan="4"></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2"></td>
                                        <td className="fw-bold">Grand Total</td>
                                        <td className="fw-bold">{convertToRupiah(getTotalPriceTransactionDetails(transactionsDetails))}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransactionList;
import {useContext, useEffect, useMemo, useState} from "react";
import MenuService from "@services/MenuService.js";
import {IconShoppingCartPlus, IconTrash} from "@tabler/icons-react";
import TableService from "@services/TableService.js";
import CustomerService from "@services/CustomerService.js";
import {Typeahead} from "react-bootstrap-typeahead";
import TransactionService from "@services/TransactionService.js";
import {useNavigate} from "react-router-dom";
import {MyContext} from "@/MyContext.js";

function TransactionOrder() {
    const [menus, setMenus] = useState([]);
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [itemOrders, setItemOrders] = useState([]);
    const menuService = useMemo(() => MenuService(), []);
    const tableService = useMemo(() => TableService(), []);
    const customerService = useMemo(() => CustomerService(), []);
    const transactionService = TransactionService();
    const navigate = useNavigate();
    const {showPopup} = useContext(MyContext);

    let amount = 0
    const convertToRupiah = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR"
        }).format(price);
    }
    const incrementQty = (data) => {
        const idx = itemOrders.findIndex((item) => item.id === data.id);
        if (idx === -1) {
            setItemOrders(
                [...itemOrders, {
                    id: data.id,
                    name: data.name,
                    price: data.price,
                    image: data.image.url,
                    qty: 1,
                }]
            );
        } else {
            itemOrders.splice(idx, 1, {
                ...itemOrders[idx],
                qty: (itemOrders[idx].qty + 1),
            });
            setItemOrders([...itemOrders]);
        }
    }

    const removeItemOrder = (data) => {
        const idx = itemOrders.findIndex((item) => item.id === data.id);
        itemOrders.splice(idx, 1);
        setItemOrders([...itemOrders]);
    }
    const decrementQty = (data) => {
        const idx = itemOrders.findIndex((item) => item.id === data.id);
        if (itemOrders[idx].qty === 1) {
            removeItemOrder(data);
        } else {
            itemOrders.splice(idx, 1, {
                ...itemOrders[idx],
                qty: (itemOrders[idx].qty - 1),
            });
            setItemOrders([...itemOrders]);
        }
    }

    const handleSelectCustomer = (data) => {
        if (data.length > 0) {
            setSelectedCustomer(data[0]);
        } else {
            setSelectedCustomer("");
        }
    }
    const handleToPay = async () => {
        try {
            const trx = {
                customerId: selectedCustomer.id,
                tableId: selectedTable !== null ? selectedTable : null,
                billDetails:
                    itemOrders.map((item) => {
                        return {
                            menuId: item.id,
                            qty: item.qty
                        }
                    })
                ,
            }
            const response = await transactionService.create(trx);
            if (response.statusCode === 201) {
                navigate("/dashboard/transaction");
                window.open(response.data.paymentResponse.redirectUrl);
            }
            showPopup("Tambah", response.statusCode);
        } catch (error) {
            showPopup("Tambah", 400);
            console.log(error);
        }
    }
    useEffect(() => {
        const getMenu = async () => {
            try {
                const dataMenu = await menuService.getAll();
                const dataTable = await tableService.getAll();
                const dataCustomer = await customerService.getAll();
                setMenus(dataMenu.data);
                setTables(dataTable.data);
                setCustomers(dataCustomer.data);
            } catch (error) {
                console.log(error);
            }
        };
        getMenu();
    }, [menuService, tableService, customerService]);
    return (
        <div id="top" className="d-flex">
            <div className="col-7 p-1">
                <div className="shadow-sm p-4 rounded-2">
                    <h4 className="mb-4">List Menu</h4>
                    <div className="row">
                        <div className="col-6 mb-4">
                            <form autoComplete="off">
                                <input className="form-control" placeholder="Search"/>
                            </form>
                        </div>
                        <div className="col-6 px-2">

                        </div>
                    </div>
                    <div className="row" style={{height: "70vh", overflowY: "auto"}}>
                        {
                            menus.map((menu) => {
                                return (
                                    <div className="col-12 col-md-6 col-lg-3" key={menu.id}>
                                        <div className="card mb-3 border-0 shadow">
                                            <img
                                                style={{aspectRatio: "1/1"}}
                                                src={menu.image.url}
                                                className="card-img-top" alt="product"/>
                                            <div className="card-body">
                                                <h5>{menu.name}</h5>
                                                <h6>{convertToRupiah(menu.price)}</h6>
                                                <div className="d-flex justify-content-center position-relative"
                                                     style={{top: 5}}>
                                                    <button onClick={() => incrementQty(menu)}
                                                            className="btn rounded-4 bg-primary p-2 px-3 mt-3 mb-1">
                                                        <IconShoppingCartPlus size={20} color="white"/> <span
                                                        className="text-white">Add</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

            <div className="col-5 p-1 d-flex">
                <div className="shadow-sm px-4 pt-4 rounded-2 w-100">
                    <div className="d-flex flex-row">
                        <div className="col-6 form-group mb-2 p-1">
                            <label htmlFor="customer" className="mb-1">Customer</label>
                            <Typeahead
                                id="basic-typeahead-single"
                                labelKey={(cs) => `${cs.name} - ${cs.username}`}
                                onChange={handleSelectCustomer}
                                options={customers}
                                placeholder="Choose a customer..."
                                selected={selectedCustomer ? [selectedCustomer] : []}
                            />
                        </div>

                        <div className="col-6 mb-2 p-1">
                            <label htmlFor="selectTable" className="mb-1">Table</label>
                            <select onChange={(e) => setSelectedTable(e.target.value)}
                                    id="selectTable"
                                    className="form-select"
                            >
                                <option>-</option>
                                {tables.map((table) => {
                                    return (
                                        <option key={table.id} value={table.id}>{table.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-5 fw-medium">Item</div>
                        <div className="col-3 ms-2 fw-medium">Qty</div>
                        <div className="col-3 fw-medium">Price</div>
                        <hr className="mt-2"/>
                    </div>
                    <div className="item" style={{height: "62vh", overflowY: "auto", overflowX: "hidden"}}>
                        {
                            itemOrders.map((item, index) => {
                                amount += (item.price * item.qty);
                                return (
                                    <div className="d-flex align-items-center border rounded mb-1" key={index}>
                                        <img style={{width: 60, aspectRatio: "1/1", padding: 5}}
                                             src={item.image}
                                             alt="item"/>
                                        <div className="col-3 pe-3"
                                             style={{
                                                 textOverflow: "ellipsis",
                                                 overflow: "hidden",
                                                 whiteSpace: "nowrap"
                                             }}>
                                            {item.name}
                                            <span className="d-block"
                                                  style={{fontSize: 14}}>{convertToRupiah(item.price)}</span>
                                        </div>
                                        <div className="col-3 text-center">
                                            <div
                                                onClick={() => decrementQty(item)}
                                                className="btn btn-primary btn-sm">-
                                            </div>
                                            <span className="mx-2 fw-medium">{item.qty}</span>
                                            <div
                                                onClick={() => incrementQty(item)}
                                                className="btn btn-primary btn-sm">+
                                            </div>
                                        </div>
                                        <div className="col-4 fw-medium text-center">{
                                            convertToRupiah((item.price * item.qty))
                                        }</div>
                                        <div onClick={() => removeItemOrder(item)} className="col-1"
                                             style={{cursor: "pointer"}}><IconTrash
                                            color="red"/></div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <span className="fw-medium fs-5">Total: {(convertToRupiah(amount))}</span>
                    <div
                        onClick={handleToPay}
                        className="d-flex p-2 justify-content-center">
                        <button className="btn btn-primary col-12 rounded-4">Lenjut ke Pembayaran</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransactionOrder;
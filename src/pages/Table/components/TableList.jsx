import { IconEditCircle } from "@tabler/icons-react";
import { IconTrash } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { useMemo } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import TableService from "@/services/TableService";
import { useEffect } from "react";

function TableList() {
    const [tables, setTables] = useState([]);
    const tableService = useMemo(() => TableService(), []);

    const handleDelete = async (id) => {
        if (!confirm("apakah yakin product ini ingin dihapus?")) return;
        try {
            const response = await tableService.deleteById(id);

            if (response.statusCode == 200) {
                const data = await tableService.getAll();
                setTables(data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const getProduct = async () => {
            try {
                const data = await tableService.getAll();
                setTables(data.data);
            } catch (error) {
                console.log(error);
            }
        };
        getProduct();
    }, [tableService]);

    return (
        <div>
            <div className="p-4 shadow-sm rounded-2">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>Table List</h3>
                    <Link className="btn btn-primary" to="/dashboard/tables/new">
                        <i className="me-2">
                            <IconPlus />
                        </i>
                        Tambah Produk
                    </Link>
                </div>
                <hr />
                <div className="table-responsive mt-4">
                    <table className="table overflow-auto">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tables.map((table, index) => {
                                return (
                                    <tr key={table.id}>
                                        <td>{++index}</td>
                                        <td>{table.name}</td>
                                        <td>
                                            <div className="btn-group">
                                                <Link
                                                    to={`/dashboard/tables/update/${table.id}`}
                                                    className="btn btn-primary">
                                                    <i>
                                                        <IconEditCircle />
                                                    </i>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(table.id)}
                                                    className="btn btn-danger">
                                                    <i className="text-white">
                                                        <IconTrash />
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
            </div>
        </div>
    )
}

export default TableList

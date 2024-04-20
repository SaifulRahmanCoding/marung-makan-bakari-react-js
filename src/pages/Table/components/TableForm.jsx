import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import TableService from "@/services/TableService";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { IconX } from "@tabler/icons-react";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useMemo } from "react";

const schema = z.object({
    name: z.string().min(1, "name wajib di isi!"),
});

function TableForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        clearErrors,
        reset,
        setValue,
    } = useForm({
        mode: "onTouched",
        resolver: zodResolver(schema),
    });
    const navigate = useNavigate();
    const tableService = useMemo(() => TableService(), []);
    const { id } = useParams();

    const handleBack = () => {
        clearForm();
        navigate("/dashboard/tables");
    };
    const clearForm = () => {
        clearErrors();
        reset();
    }
    const onSubmit = async (data) => {
        try {

            if (id) {
                const table = {
                    id: id,
                    name: data.name,
                };
                console.log(table);
                await tableService.update(table);
            } else {
                await tableService.create(data);
            }
            clearForm();
            navigate("/dashboard/tables");

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (id) {
            const getTablesById = async () => {
                try {
                    const response = await tableService.getById(id);
                    const currentTables = response.data;
                    setValue("id", currentTables.id);
                    setValue("name", currentTables.name);
                } catch (error) {
                    console.log(error);
                }
            };
            getTablesById();
        }
    }, [id, tableService, setValue]);

    return (
        <div className="shadow-sm p-4 rounded-2">
            <h2 className="mb-4">Form tables</h2>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label required">
                        Nama
                    </label>
                    <input
                        {...register("name")}
                        type="text"
                        className={`form-control ${errors.name && "is-invalid"}`}
                        name="name"
                        id="name"
                    />
                    {errors.name && (
                        <div className="invalid-feedback">{errors.name.message}</div>
                    )}
                </div>
                <div className="d-flex gap-2">
                    <button
                        type="submit"
                        disabled={!isValid}
                        className="d-flex align-items-center btn btn-primary"
                    >
                        <i className="me-2">
                            <IconDeviceFloppy />
                        </i>
                        Simpan
                    </button>
                    <button
                        onClick={handleBack}
                        type="button"
                        className="d-flex align-items-center btn btn-danger text-white"
                    >
                        <i className="me-2">
                            <IconX />
                        </i>
                        Batal
                    </button>
                </div>
            </form>
        </div>
    )
}

export default TableForm

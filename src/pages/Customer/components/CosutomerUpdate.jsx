import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import * as z from "zod";
import CustomerService from "@/services/CustomerService";
import {useNavigate} from "react-router-dom";
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {IconX} from "@tabler/icons-react";
import {IconDeviceFloppy} from "@tabler/icons-react";
import {useContext} from "react";
import {MyContext} from "@/MyContext";

const schema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "name wajib di isi!"),
    mobilePhoneNo: z.string().min(10, "nomor handphone harus lebih daari 10 karakter!"),
});

function CosutomerUpdate({pageName}) {
    const {
        register,
        handleSubmit,
        formState: {errors, isValid},
        clearErrors,
        reset,
        setValue,
        trigger,
    } = useForm({
        mode: "onChange",
        resolver: zodResolver(schema),
    });

    const navigate = useNavigate();
    const customerService = CustomerService();
    const {id} = useParams();
    const {showPopup} = useContext(MyContext);

    function capitalizeFirstWord(sentence) {
        return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    }

    const handleBack = () => {
        clearForm();
        navigate(pageName !== "admin" ? "/dashboard/customer" : "/dashboard/admin");
    };
    const clearForm = () => {
        clearErrors();
        reset();
    }
    const onSubmit = async (data) => {
        try {
            if (id) {
                const customer = {
                    id: id,
                    name: data.name,
                    mobilePhoneNo: data.mobilePhoneNo,
                };
                const response = await customerService.update(customer);
                showPopup("Update", response.statusCode)
            }
            clearForm();
            navigate(pageName !== "admin" ? "/dashboard/customer" : "/dashboard/admin");
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (id) {
            const getTablesById = async () => {
                try {
                    const response = await customerService.getById(id);
                    const currentCustomer = response.data;
                    setValue("id", currentCustomer.id);
                    setValue("name", currentCustomer.name);
                    setValue("mobilePhoneNo", currentCustomer.mobilePhoneNo);
                    await trigger();
                } catch (error) {
                    console.log(error);
                }
            };
            getTablesById();
        }
    }, [id, setValue, trigger]);
    return (
        <div>
            <div className="shadow-sm p-4 rounded-2">
                <h2 className="mb-4">Update {capitalizeFirstWord(pageName.toString())}</h2>
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
                    <div className="mb-3">
                        <label htmlFor="mobilePhoneNo" className="form-label required">
                            Nomor Handphone
                        </label>
                        <input
                            {...register("mobilePhoneNo")}
                            type="number"
                            className={`form-control ${errors.mobilePhoneNo && "is-invalid"}`}
                            name="mobilePhoneNo"
                            id="mobilePhoneNo"
                        />
                        {errors.mobilePhoneNo && (
                            <div className="invalid-feedback">{errors.mobilePhoneNo.message}</div>
                        )}
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            type="submit"
                            disabled={!isValid}
                            className="d-flex align-items-center btn btn-primary"
                        >
                            <i className="me-2">
                                <IconDeviceFloppy/>
                            </i>
                            Simpan
                        </button>
                        <button
                            onClick={handleBack}
                            type="button"
                            className="d-flex align-items-center btn btn-danger text-white"
                        >
                            <i className="me-2">
                                <IconX/>
                            </i>
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CosutomerUpdate

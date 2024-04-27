import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import * as z from "zod";
import CustomerService from "@/services/CustomerService";
import {useNavigate} from "react-router-dom";
import {IconX} from "@tabler/icons-react";
import {IconDeviceFloppy} from "@tabler/icons-react";
import {useContext} from "react";
import {MyContext} from "@/MyContext";

const schema = z.object({
    username: z.string().min(1, "username wajib di isi!"),
    password: z.string().min(8, "minimal 8 karakter!"),
    repassword: z.string().min(8, "minimal 8 karakter!"),
    name: z.string().min(1, "name wajib di isi!"),
    mobilePhoneNo: z.string().min(10, "nomor handphone harus lebih dari 10 karakter!"),
});

function CustomerCreate({pageName}) {
    const {
        register,
        handleSubmit,
        formState: {errors, isValid},
        clearErrors,
        reset,
    } = useForm({
        mode: "onChange",
        resolver: zodResolver(schema),
    });

    const navigate = useNavigate();
    const customerService = CustomerService();
    const {showPopup} = useContext(MyContext);

    function capitalizeFirstWord(sentence) {
        return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    }

    const handleBack = () => {
        clearForm();
        navigate("/dashboard/customers");
    };
    const clearForm = () => {
        clearErrors();
        reset();
    }
    const onSubmit = async (data) => {
        try {
            const user = {
                username: data.username,
                password: data.password,
            };
            if (data.password !== data.repassword) return showPopup("Tambah", 400, "password yang anda input tidak sama");
            const responseCreateUser = pageName !== "admin" ? await customerService.create(user) : await customerService.createAdmin(user);
            if (responseCreateUser.statusCode === 201) {
                const customer = {
                    id: responseCreateUser.data.idCustomer,
                    name: data.name,
                    mobilePhoneNo: data.mobilePhoneNo,
                };
                await customerService.update(customer);
            }
            showPopup("Tambah", responseCreateUser.statusCode);
            clearForm();
            navigate(pageName !== "admin" ? "/dashboard/customers" : "/dashboard/admin");
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <div className="shadow-sm p-4 rounded-2">
                <h2 className="mb-4">Form {capitalizeFirstWord(pageName.toString())}</h2>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label required">
                            Username
                        </label>
                        <input
                            {...register("username")}
                            type="text"
                            className={`form-control ${errors.username && "is-invalid"}`}
                            name="username"
                            id="username"
                        />
                        {errors.username && (
                            <div className="invalid-feedback">{errors.username.message}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label required">
                            Password
                        </label>
                        <input
                            {...register("password")}
                            type="password"
                            className={`form-control ${errors.password && "is-invalid"}`}
                            name="password"
                            id="password"
                        />
                        {errors.password && (
                            <div className="invalid-feedback">{errors.password.message}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="repassword" className="form-label required">
                            Repassword
                        </label>
                        <input
                            {...register("repassword")}
                            type="password"
                            className={`form-control ${errors.repassword && "is-invalid"}`}
                            name="repassword"
                            id="repassword"
                            placeholder="ketik ulang password anda"
                        />
                        {errors.repassword && (
                            <div className="invalid-feedback">{errors.repassword.message}</div>
                        )}
                    </div>

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
                            type="telp"
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

export default CustomerCreate;

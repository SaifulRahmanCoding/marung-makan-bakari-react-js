import { IconArrowLeft } from "@tabler/icons-react";
import login from "@/assets/images/login.svg";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AuthService from "@services/AuthService";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useEffect } from "react";

const schema = z.object({
  username: z.string().min(1, "Username tidak boleh kosong"),
  password: z
    .string()
    .min(8, "Password setidaknya harus lebih dari 8 karakter"),
});

function Login() {
  const authService = useMemo(() => AuthService(), []);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await authService.login(data);
      if (response && response.statusCode === 200) {
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const checkToken = async () => {
        const isValidToken = await authService.validateToken();
        if (isValidToken) {
          navigate("/dashboard");
        }
      };
      checkToken();
    }
  }, [authService, navigate]);

  return (
    <>
      <div className="d-flex">
        <Link
          to="/"
          className="user-select-all p-4 d-flex align-items-center gap-2 text-decoration-none"
        >
          <span>
            <IconArrowLeft />
          </span>
          Kembali ke Home
        </Link>
      </div>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="shadow-lg rounded-4" style={{ width: 500 }}>
          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <div className="row mt-4 mb-3">
              <div className="col text-center">
                <img
                  src={login}
                  alt="login"
                  className="img-fluid"
                  style={{ height: 200 }}
                />
              </div>
            </div>
            <h2 className="text-center">Log In</h2>
            <div className="mb-3">
              <label htmlFor="username">Username</label>
              <input
                {...register("username")}
                type="text"
                name="username"
                id="username"
                className={`form-control rounded-0 border-0 border-bottom ${
                  errors.username && "is-invalid"
                }`}
              />
              {errors.username && (
                <div className="invalid-feedback">
                  {errors.username.message}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <input
                {...register("password")}
                type="password"
                name="password"
                id="password"
                className={`form-control rounded-0 border-0 border-bottom ${
                  errors.password && "is-invalid"
                }`}
              />
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password.message}
                </div>
              )}
            </div>
            <button
              disabled={!isValid}
              type="submit"
              className="btn btn-primary mt-4 w-100"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;

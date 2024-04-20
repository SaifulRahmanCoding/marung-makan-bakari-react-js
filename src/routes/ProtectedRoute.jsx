import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import AuthService from "@services/AuthService";

function ProtectedRoute({ children }) {
  const authService = AuthService();
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      if (
        !localStorage.getItem("user") ||
        !(await authService.validateToken())
      ) {
        navigate("/login");
      }
    };

    checkToken();
  }, [authService, navigate]);

  return <>{children}</>;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoute;

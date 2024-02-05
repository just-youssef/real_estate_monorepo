import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const Private = () => {
    const token = useSelector((state) => state.user.token);
    return token? <Outlet /> : <Navigate to="/sign-in" />
}

export default Private
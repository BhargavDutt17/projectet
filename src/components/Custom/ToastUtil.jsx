import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/toastStyles.css";

export const showToast = (message, type = "success") => {
  toast(message, {
    position: "top-right",
    autoClose: 3000,
    closeButton: true, // ✅ This adds a close button
    className: `toast-${type}`,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "auto", // ✅ uses the user's system theme automatically
  });
};

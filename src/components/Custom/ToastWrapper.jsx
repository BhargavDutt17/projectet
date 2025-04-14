import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastWrapper = () => (
  <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    pauseOnFocusLoss
    draggable
    pauseOnHover
    closeButton={true} // ✅ Adds close button
    theme="auto" // ✅ Automatically matches system theme
    toastClassName="rounded-lg px-4 py-3 shadow-md border-l-8"
    bodyClassName="text-sm font-medium"
  />
);

export default ToastWrapper;

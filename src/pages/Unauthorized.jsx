import { Lock } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  const backFun = () => navigate(-1);
  useEffect(() => {
    const setTimeoutFn = setTimeout(() => {
      backFun();
    }, 3000);

    return (() => {
      clearTimeout(setTimeoutFn);
    })
  })
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 px-4">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <Lock className="h-10 w-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800">Unauthorized</h1>
        <p className="mt-2 max-w-md text-gray-600">
          You don’t have permission to access this page. Please log in with the
          correct credentials or contact the administrator if you believe this
          is an error.
        </p>

        <button
          className="mt-6 rounded-md bg-webprimary px-5 py-2 text-white transition hover:opacity-90"
          onClick={() => (window.location.href = "/")}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}


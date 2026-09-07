import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    const handleLogout = ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login')
    }

    if (!token) {
    navigate('/login');
    return null;
    }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-gray-600">
            You are logged in as a: <span className="font-semibold text-blue-600">{role}</span>
          </p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
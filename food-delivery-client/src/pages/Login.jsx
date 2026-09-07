import axios from "axios";
import { useState } from "react";
import { redirect,useNavigate } from "react-router-dom";

export default function Login(){

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [status,setStatus] = useState({type:"",message:""});

    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Logging in...' });
        try{
            const response = await fetch("http://localhost:5121/api/auth/login",{
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({email,password})
            });

            if(response.ok){
                const data = await response.json();
                // Save the JWT token and user role to LocalStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                setStatus({ type: 'success', message: `Welcome back, ${data.fullName}!` });

                setTimeout(()=>{navigate('/home')},1000)
                
            } else {
                setStatus({ type: 'error', message: 'Invalid email or password.' });
            }

        }catch(e){
            setStatus({ type: 'error', message: 'Network error. Is the .NET API running?' });
        }

    }

    return(
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        
            {status.message && (
          <div className={`p-3 mb-4 text-sm rounded ${status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {status.message}
          </div>
            )}

            <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Login</h2>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    required 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    required 
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    Sign In
                </button>
            </form>
        </div>
    </div>
    );
}
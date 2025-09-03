import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Backend API URL from the .env file.
// In a real app, this would be imported from a config file.
const API_URL = "http://localhost:5000/api/auth";

// Simple LogoIcon component to avoid import errors.
const LogoIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-800"
        >
            <path d="M12 2l8 4.5v9L12 22l-8-4.5v-9L12 2z" />
        </svg>
    );
};

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear previous error

        if (!email || !password) {
            setErrorMessage("Please enter both email and password.");
            return;
        }

        try {
            // Make the actual API call to the backend login endpoint
            await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });
            navigate('/dashboard'); // Redirect to dashboard after successful login
        } catch (error) {
            console.error("Login failed:", error);
            const userMessage = error.response?.data?.message || error.message || "Login failed. Please check your credentials.";
            setErrorMessage(userMessage);
        }
    };

    // This function will redirect the user to the Google login endpoint on your backend
    const loginWithGoogle = () => {
        window.location.href = `${API_URL}/google/login`;
    };

    const grainyTextureStyle = {
        backgroundColor: '#eaeaea',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '100px 100px',
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div
                className="relative w-full max-w-[400px] rounded-[25px] bg-[#eaeaea] p-10 px-12 text-center shadow-2xl"
                style={grainyTextureStyle}
            >
                <button onClick={handleBack} className="absolute top-6 left-6 cursor-pointer border-none bg-transparent text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
                </button>
                <div className="mb-6 flex justify-center">
                    <LogoIcon />
                </div>
                <h2 className="mb-6 text-3xl font-semibold text-gray-800">Login Page</h2>

                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4">
                        <span className="block sm:inline">{errorMessage}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setErrorMessage('')}>
                            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <title>Close</title>
                                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.03a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15L5.651 6.85a1.2 1.2 0 1 1 1.697-1.697l2.758 3.15 2.651-3.03a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.15 2.758 3.15a1.2 1.2 0 0 1 0 1.697z" />
                            </svg>
                        </span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="mb-4 text-left">
                        <label htmlFor="email" className="mb-2 block font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            id="email"
                            placeholder="ex: sam@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-gray-100 p-3"
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label htmlFor="password" className="mb-2 block font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input
                                type={isPasswordVisible ? 'text' : 'password'}
                                id="password"
                                placeholder="ex: temp@1234"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-lg border border-gray-300 bg-gray-100 p-3"
                            />
                            <span onClick={togglePasswordVisibility} className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-500">
                                {isPasswordVisible ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off"><path d="M10.66 12.66a2 2 0 0 1-2.83-2.83"/><path d="M2 12s3-7 10-7c.76 0 1.5.11 2.22.31M19.9 12.5S17 19 12 19c-1.57 0-3-.35-4.33-.92"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-6">
                        <label htmlFor="rememberMe" className="flex cursor-pointer items-center text-sm text-gray-600">
                            <input type="checkbox" id="rememberMe" className="mr-2 h-4 w-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500" />
                            Remember me
                        </label>
                        <a href="#forgot" className="text-sm text-gray-600 no-underline hover:underline">Forgot Password?</a>
                    </div>
                    <button
                        type="submit"
                        className="mb-6 cursor-pointer rounded-lg border-none bg-teal-400 py-3 font-bold text-white transition-colors duration-200 hover:bg-teal-500"
                    >
                        Submit
                    </button>
                </form>
                <div className="mb-6 flex items-center text-gray-500">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={loginWithGoogle}
                        className="flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white p-3 font-medium text-gray-800 transition-colors duration-200 hover:bg-gray-50"
                    >
                        <svg className="mr-3" width="22" height="22" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.17 3.65l6.07-6.07C35.85 2.57 30.2 0 24 0 14.54 0 6.64 5.22 2.91 12.87l6.57 5.1C11.51 13.56 17.26 9.5 24 9.5z"/><path fill="#4285F4" d="M46.7 24.5c0-1.57-.14-3.12-.4-4.63H24v8.52h12.51c-.65 3.59-2.58 6.6-5.46 8.65l5.96 4.62c3.48-3.23 5.5-7.98 5.5-13.31z"/><path fill="#FBBC05" d="M9.48 31.75c-1.25-.97-2.31-2.1-3.08-3.46l-6.57-5.1c-1.74 3.52-2.73 7.57-2.73 11.81s.99 8.29 2.73 11.81l6.57-5.1c.77-1.36 1.83-2.49 3.08-3.46z"/><path fill="#34A853" d="M24 48c6.64 0 12.4-2.22 16.53-6l-5.96-4.62c-2.88 2.05-4.71 4.46-6.46 6.51a24.22 24.22 0 0 1-9.98-1.51l-6.57 5.1c3.73 7.65 11.63 12.87 21.09 12.87z"/></svg>
                        <span>Continue with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

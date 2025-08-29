import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa';
import LogoIcon from './HomePage/logoIcon.jsx';
import { useAuth } from '../contexts/AuthContexts.jsx';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle} = useAuth();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }
    await login(email, password); 
  };

  const handleBack = () => {
    navigate(-1);
  };

  const grainyTextureStyle = {
    backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjxmZURpZmZ1c2VMaWdodGluZyBzdXJmYWNlU2NhbGU9IjEwIiBkaWZmdXNlQ29uc3RhbnQ9IjEiIGxpZ2h0aW5nLWNvbG9yPSJ3aGl0ZSI+PGZlRHN0YW50TGlnaHQgYXppbXV0aD0iMyIgZWxldmF0aW9uPSIzIi8+PC9mZURpZmZ1zWVMaWdodGluZz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbnoaXNlKSIgb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==')`,
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className="relative w-full max-w-[400px] rounded-[25px] bg-[#eaeaea] p-10 px-12 text-center shadow-2xl"
        style={grainyTextureStyle}
      >
        <button onClick={handleBack} className="absolute top-6 left-6 cursor-pointer border-none bg-transparent text-gray-600">
          <IoArrowBack size={24} />
        </button>
        <div className="mb-6 flex justify-center">
          <LogoIcon />
        </div>
        <h2 className="mb-6 text-3xl font-semibold text-gray-800">Login Page</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-4 text-left">
            <label htmlFor="email" className="mb-2 block font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
            <input type="email" id="email" placeholder="ex: sam@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-gray-300 bg-gray-100 p-3"/>
          </div>
          <div className="mb-4 text-left">
            <label htmlFor="password" className="mb-2 block font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type={isPasswordVisible ? 'text' : 'password'} id="password" placeholder="ex: temp@1234" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg border border-gray-300 bg-gray-100 p-3"/>
              <span onClick={togglePasswordVisibility} className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-500">{isPasswordVisible ? <FaEye /> : <FaEyeSlash />}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <label htmlFor="rememberMe" className="flex cursor-pointer items-center text-sm text-gray-600">
              <input type="checkbox" id="rememberMe" className="mr-2 h-4 w-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"/>
              Remember me
            </label>
            <a href="#forgot" className="text-sm text-gray-600 no-underline hover:underline">Forgot Password?</a>
          </div>
          <button type="submit" className="mb-6 cursor-pointer rounded-lg border-none bg-teal-400 py-3 font-bold text-white transition-colors duration-200 hover:bg-teal-500">Submit</button>
        </form>
        <div className="mb-6 flex items-center text-gray-500">
          <div className="flex-grow border-t border-gray-300"></div><span className="mx-4">or</span><div className="flex-grow border-t border-gray-300"></div>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={loginWithGoogle} className="flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white p-3 font-medium text-gray-800 transition-colors duration-200 hover:bg-gray-50">
            <FcGoogle size={22} className="mr-3" />
            <span>Continue with Google</span>
          </button>
          {/*<button onClick={signInWithFacebook} className="flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white p-3 font-medium text-gray-800 transition-colors duration-200 hover:bg-gray-50">
            <FaFacebook size={22} color="#1877F2" className="mr-3" />
            <span>Continue with Facebook</span>
          </button>*/}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
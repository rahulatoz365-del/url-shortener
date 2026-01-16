import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ImSpinner8 } from 'react-icons/im';
import { FaArrowRight } from 'react-icons/fa';
import api from '../api/api';
import { useStoreContext } from '../contextApi/ContextApi';

// Interface defining the shape of the login form data
interface LoginFormData {
    username: string;
    password: string;
}

// Interface for the API response
interface LoginResponse {
    token: string;
}

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [loader, setLoader] = useState<boolean>(false);
    const { setToken } = useStoreContext();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<LoginFormData>({
        defaultValues: {
            username: "",
            password: "",
        },
        mode: "onTouched",
    });

    const loginHandler: SubmitHandler<LoginFormData> = async (data) => {
        setLoader(true);
        try {
            const { data: response } = await api.post<LoginResponse>(
                "/api/auth/public/login",
                data
            );
            console.log(response.token);
            setToken(response.token);
            localStorage.setItem("JWT_TOKEN", JSON.stringify(response.token));

            toast.success("Login Successful!");
            reset();
            navigate("/dashboard");
        } catch (error) {
            console.log(error);
            toast.error("Login Failed!");
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex justify-center items-center bg-slate-50 relative overflow-hidden font-sans">

            {/* --- Subtle Background Pattern --- */}
            <div className="absolute inset-0 z-0 opacity-[0.4]"
                 style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-[420px] bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 relative z-10 mx-4"
            >
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="font-serif text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Please enter your details to sign in.
                    </p>
                </div>

                <form onSubmit={handleSubmit(loginHandler)} className="space-y-5">

                    {/* Username Field */}
                    <div className="space-y-1.5">
                        <label htmlFor="username" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="john_doe"
                            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none text-slate-800 transition-all duration-200 focus:bg-white focus:ring-2 ${
                                errors.username
                                ? "border-red-300 focus:ring-red-100"
                                : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
                            }`}
                            {...register("username", {
                                required: "Username is required",
                                minLength: {
                                    value: 3,
                                    message: "Minimum 3 characters"
                                },
                                pattern: {
                                    // ✅ Username Regex: Alphanumeric + Underscore only
                                    value: /^[a-zA-Z0-9_]+$/,
                                    message: "Invalid format (Letters, numbers, underscores only)"
                                }
                            })}
                        />
                        {errors.username && (
                            <p className="text-xs text-red-500 font-medium">{errors.username.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <label htmlFor="password" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                                Password
                            </label>
                        </div>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none text-slate-800 transition-all duration-200 focus:bg-white focus:ring-2 ${
                                errors.password
                                ? "border-red-300 focus:ring-red-100"
                                : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
                            }`}
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                },
                                pattern: {
                                    // ✅ Strong Password Regex
                                    // (?=.*[a-z]) -> at least one lowercase
                                    // (?=.*[A-Z]) -> at least one uppercase
                                    // (?=.*[0-9]) -> at least one number
                                    // (?=.*[!@#$%^&*]) -> at least one special char
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{6,128}$/,
                                    message: "Password must contain uppercase, lowercase, number and symbol"
                                }
                            })}
                        />
                        {errors.password && (
                            <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        disabled={loader}
                        type='submit'
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-6"
                    >
                        {loader ? (
                            <>
                                <ImSpinner8 className="animate-spin text-lg" />
                                <span>Signing In...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Section */}
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-500 text-sm">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors"
                        >
                            Create account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
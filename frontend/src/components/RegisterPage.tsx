import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ImSpinner8 } from 'react-icons/im';
import { FaArrowRight } from 'react-icons/fa';
import api from '../api/api';

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
}

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [loader, setLoader] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<RegisterFormData>({
        mode: "onTouched",
    });

    const registerHandler: SubmitHandler<RegisterFormData> = async (data) => {
        setLoader(true);
        try {
            await api.post("/api/auth/public/register", data);
            reset();
            navigate("/login");
            toast.success("Account created successfully!");
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Registration Failed";
            toast.error(errorMessage);
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex justify-center items-center bg-slate-50 relative overflow-hidden font-sans">

            <div className="absolute inset-0 z-0 opacity-[0.4]"
                 style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-[420px] bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 relative z-10 mx-4"
            >
                <div className="text-center mb-8">
                    <h1 className="font-serif text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                        Create an account
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Start optimizing your links today.
                    </p>
                </div>

                <form onSubmit={handleSubmit(registerHandler)} className="space-y-5">

                    {/* Username */}
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
                                    // ✅ Username Regex
                                    value: /^[a-zA-Z0-9_]+$/,
                                    message: "Only letters, numbers, and underscores allowed"
                                }
                            })}
                        />
                        {errors.username && (
                            <p className="text-xs text-red-500 font-medium">{errors.username.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="name@company.com"
                            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none text-slate-800 transition-all duration-200 focus:bg-white focus:ring-2 ${
                                errors.email
                                ? "border-red-300 focus:ring-red-100"
                                : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
                            }`}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Please enter a valid email"
                                }
                            })}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label htmlFor="password" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                            Password
                        </label>
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
                                    // ✅ Strong Password Regex: Caps + Lower + Num + Symbol
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{6,128}$/,
                                    message: "Must contain Uppercase, Lowercase, Number & Symbol"
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
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign Up</span>
                                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-500 text-sm">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
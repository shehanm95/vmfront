import React, { useState } from 'react';
import { NavBar } from '../common/NavBar';
import './authenticationForm.css';
import { BlueLogo } from '../common/BlueLogo';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TokenPair } from '../../types/auth';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinkService } from '../../frontServices/LinkService';
import api from '../../api/axios';

// Define the Zod schema for form validation
const registerSchema = z
    .object({
        firstName: z.string().min(2, 'First name must be at least 2 characters'),
        lastName: z.string().min(2, 'Last name must be at least 2 characters'),
        email: z.string().email('Invalid email format'),
        phoneNumber: z.string().min(5, 'Phone number must be at least 5 characters'), // Added phoneNumber validation
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

// Infer the form type from the schema
type RegisterFormInputs = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = React.useState<boolean>(false);
    const linkService = LinkService.getInstance()
    const [creating, setCreating] = useState(false)
    // Initialize react-hook-form with zod resolver
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
        },
    });
    interface RegisterCredentials {
        firstName: string;
        lastName: string;
        imagePath: string | null,
        email: string;
        phoneNumber: string,
        password: string;
        confirmPassword: string;
    }

    const onSubmit = async (data: RegisterFormInputs) => {
        try {
            setCreating(true)
            const credentials: RegisterCredentials = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                password: data.password,
                confirmPassword: data.confirmPassword,
                imagePath: ""
            };

            const response = await api.post<TokenPair>('/api/auth/register', credentials);
            const { accessToken, refreshToken } = response.data;
            setCreating(false)
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            toast.success('Registration successful! Redirecting to home...');
            setTimeout(() => navigate(LinkService.getInstance().preReg.verifyEmail), 1000);
        } catch (err: any) {
            const errorMessage =
                typeof err.response?.data === 'string'
                    ? err.response?.data
                    : err.response?.data?.message || 'Registration failed';
            toast.error(errorMessage);
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(e.target.checked);
        // TODO: add remember me logic
    };

    return (
        <div>
            <NavBar />
            <div className="maincontainer flex center mt-50">
                <div className="authenticationForm">
                    <div className="logoArea flex center">
                        <BlueLogo />
                    </div>
                    <h3 className="mt-4">Register</h3>
                    <div>
                        <div className="w-100 bigInputFields mt-3">
                            <input
                                type="text"
                                placeholder="First Name"
                                {...register('firstName')}
                                required
                            />
                            <i className="fa-solid fa-user"></i>
                        </div>
                        {errors.firstName && (
                            <p className="text-danger mt-2">{errors.firstName.message}</p>
                        )}
                        <div className="w-100 bigInputFields mt-3">
                            <input
                                type="text"
                                placeholder="Last Name"
                                {...register('lastName')}
                                required
                            />
                            <i className="fa-solid fa-user"></i>
                        </div>
                        {errors.lastName && (
                            <p className="text-danger mt-2">{errors.lastName.message}</p>
                        )}
                        <div className="w-100 bigInputFields mt-3">
                            <input
                                type="email"
                                placeholder="Email"
                                {...register('email')}
                                required
                            />
                            <i className="fa-solid fa-at"></i>
                        </div>
                        {errors.email && (
                            <p className="text-danger mt-2">{errors.email.message}</p>
                        )}
                        <div className="w-100 bigInputFields mt-3">
                            <input
                                type="text"
                                placeholder="Phone Number"
                                {...register('phoneNumber')}
                                required
                            />
                            <i className="fa-solid fa-phone"></i>
                        </div>
                        {errors.phoneNumber && (
                            <p className="text-danger mt-2">{errors.phoneNumber.message}</p>
                        )}
                        <div className="w-100 bigInputFields mt-3">
                            <input
                                type="password"
                                placeholder="Password"
                                {...register('password')}
                                required
                            />
                            <i className="fa-solid fa-lock"></i>
                        </div>
                        {errors.password && (
                            <p className="text-danger mt-2">{errors.password.message}</p>
                        )}
                        <div className="w-100 bigInputFields mt-3">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                {...register('confirmPassword')}
                                required
                            />
                            <i className="fa-solid fa-lock"></i>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-danger mt-2">{errors.confirmPassword.message}</p>
                        )}
                        <div className="p-1 rememberArea flex centerV mt-3 between">
                            <div>
                                <input
                                    type="checkbox"
                                    name="rememberme"
                                    id="rememberme"
                                    checked={rememberMe}
                                    onChange={handleCheckboxChange}
                                />
                                <label className="ms-2" htmlFor="rememberme">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="bigButton w-100"
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                        >
                            {creating ? "Creating Account..." : "Register"}
                        </button>
                    </div>
                    <div className="formbottom flex center">
                        <span>Already have an account? </span>
                        <Link className="ps-1" to="/login">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
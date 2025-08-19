import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BlueLogo } from '../common/BlueLogo';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { LinkService } from '../../frontServices/LinkService';
import api from '../../api/axios';
import { NavBarContainer } from '../common/NavBarContainer';

// Define Zod schema for login validation
const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Infer form type
type LoginFormInputs = z.infer<typeof loginSchema>;

interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    // Initialize react-hook-form with zod resolver
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            console.log('Request URL:', api.getUri() + '/api/auth/login');
            console.log('Request payload:', data);
            const response = await api.post<TokenPair>('/api/auth/login', data);
            console.log('Response:', response.data);
            const { accessToken, refreshToken } = response.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            toast.success('Login successful!');

            setTimeout(() => navigate(LinkService.getInstance().preReg.base), 1000); // Match RegisterForm
        } catch (err: unknown) {
            console.error('Error response:', err);
            let errorMessage = 'Login failed.';

            if (err instanceof AxiosError) {
                if (err.response) {
                    errorMessage =
                        typeof err.response.data === 'string'
                            ? err.response.data
                            : (err.response.data as any)?.message || errorMessage;
                } else if (err.request) {
                    errorMessage = 'Network error. Please check your connection.';
                }
            } else {
                errorMessage = err instanceof Error ? err.message : errorMessage;
            }

            if (errorMessage.includes('not verified')) {
                errorMessage = 'Your email is not verified. Please check your inbox.';
            }

            toast.error(errorMessage);
            return { error: errorMessage };
        }
    };

    return (
        <NavBarContainer>
            <div className="maincontainer flex center">
                <div className="authenticationForm">
                    <div className="logoArea flex center">
                        <BlueLogo />
                    </div>
                    <h3 className="mt-3">Login</h3>
                    <form onSubmit={handleSubmit(onSubmit)} aria-labelledby="login-form-title">
                        <h3 id="login-form-title" className="mt-3" hidden>
                            Login
                        </h3>
                        <div className="w-100 bigInputFields mt-3">
                            <input
                                type="email"
                                placeholder="Email"
                                {...register('email')}
                                required
                                aria-label="Email address"
                                aria-describedby={errors.email ? 'email-error' : undefined}
                            />
                            <i className="fa-solid fa-at"></i>
                        </div>
                        {errors.email && (
                            <p id="email-error" className="text-danger mt-2">
                                {errors.email.message}
                            </p>
                        )}
                        <div className="w-100 bigInputFields mt-3">
                            <input
                                type="password"
                                placeholder="Password"
                                {...register('password')}
                                required
                                aria-label="Password"
                                aria-describedby={errors.password ? 'password-error' : undefined}
                            />
                            <i className="fa-solid fa-lock"></i>
                        </div>
                        {errors.password && (
                            <p id="password-error" className="text-danger mt-2">
                                {errors.password.message}
                            </p>
                        )}
                        <button
                            type="submit"
                            className="bigButton w-100"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <div className="formbottom flex center">
                        <span>Don't have an account?</span>{" "}
                        <Link className='ps-1' to="/register">Register</Link>
                    </div>
                </div>
            </div>
        </NavBarContainer>
    );
};
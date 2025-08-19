import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import './css/frontForm.css'
import { useNavigate } from 'react-router-dom';
import { LinkService } from '../../../frontServices/LinkService';
import userService from '../../../services/userService';
import { FrontPageService } from '../../../frontServices/FrontPageSerivce';

// Define the validation schema using zod
const loginSchema = z
    .object({
        email: z.string().email('Invalid email address').min(1, 'Email is required'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
    })


// Infer the TypeScript type from the schema
type FrontLoginFormData = z.infer<typeof loginSchema>;

const FrontLoginForm: React.FC = () => {
    const navigate = useNavigate()
    const links = LinkService.getInstance()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FrontLoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    });

    const onSubmit = async (data: FrontLoginFormData) => {
        const user = await userService.loginVisitor(data)
        FrontPageService.getInstance().setCurrectVisitor(user);
        navigate(links.frontOffice.answerQuestions)
    };

    return (
        <div className="center w-100">
            <div className="f-form-container">
                <h2 className="f-form-title">Visitor Login Form</h2>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' className="f-form">

                    <div className="f-form-group">
                        <label className="f-form-label">Email</label>
                        <input
                            type="email"
                            {...register('email')}
                            className="f-form-input"
                            placeholder="Enter Email"
                        />
                        {errors.email && <p className="f-form-error">{errors.email.message}</p>}
                    </div>

                    <div className="f-form-group">
                        <label className="f-form-label">Password</label>
                        <input
                            type="password"
                            {...register('password')}
                            className="f-form-input"
                            placeholder="Enter Password"
                        />
                        {errors.password && <p className="f-form-error">{errors.password.message}</p>}
                    </div>

                    <div className='flex between'>
                        <p className='forgotPass' onClick={() => navigate(links.frontOffice.forgotPass)}> - Forgot password</p>
                        <button type="submit" className="f-form-submit">
                            Login
                        </button>
                    </div>
                </form >
            </div >
        </div>
    );
};

export default FrontLoginForm;
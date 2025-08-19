import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import './css/frontForm.css'
import { Center } from '../../common/Center';
import { RightAlign } from '../../common/RightAlign';
import { useNavigate } from 'react-router-dom';
import { LinkService } from '../../../frontServices/LinkService';
import { UserDto } from '../../../types/UserDto';
import userService from '../../../services/userService';
import { FrontPageService } from '../../../frontServices/FrontPageSerivce';

// Define the validation schema using zod
const registrationSchema = z
    .object({
        firstName: z.string().min(1, 'First Name is required'),
        lastName: z.string().min(1, 'Last Name is required'),
        email: z.string().email('Invalid email address').min(1, 'Email is required'),
        phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number too long'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

// Infer the TypeScript type from the schema
type RegistrationFormData = z.infer<typeof registrationSchema>;

const FrontRegistrationForm: React.FC = () => {
    const navigate = useNavigate();
    const linkService = LinkService.getInstance()


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: RegistrationFormData) => {
        const user = await userService.addVisitor(data)
        FrontPageService.getInstance().setCurrectVisitor(user);
        console.log('Form submitted:', user);
        navigate(linkService.frontOffice.verifyEmail);
    };

    return (
        <div className="f-form-container">
            <h2 className="f-form-title">Visitor Registration Form</h2>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' className="f-form">
                <div className="f-form-group">
                    <label className="f-form-label">First Name</label>
                    <input
                        type="text"
                        {...register('firstName')}
                        className="f-form-input"
                        placeholder="Enter First Name"
                        autoComplete="off"
                    />
                    {errors.firstName && <p className="f-form-error">{errors.firstName.message}</p>}
                </div>

                <div className="f-form-group">
                    <label className="f-form-label">Last Name</label>
                    <input
                        type="text"
                        {...register('lastName')}
                        className="f-form-input"
                        placeholder="Enter Last Name"
                    />
                    {errors.lastName && <p className="f-form-error">{errors.lastName.message}</p>}
                </div>

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
                    <label className="f-form-label">Phone Number</label>
                    <input
                        type="tel"
                        {...register('phoneNumber')}
                        className="f-form-input"
                        placeholder="Enter Phone Number"
                    />
                    {errors.phoneNumber && <p className="f-form-error">{errors.phoneNumber.message}</p>}
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

                <div className="f-form-group">
                    <label className="f-form-label">Confirm Password</label>
                    <input
                        type="password"
                        {...register('confirmPassword')}
                        className="f-form-input"
                        placeholder="Confirm Password"
                    />
                    {errors.confirmPassword && <p className="f-form-error">{errors.confirmPassword.message}</p>}
                </div>

                <RightAlign>
                    <button type="submit" className="f-form-submit">
                        Register
                    </button>
                </RightAlign>
            </form>
        </div>
    );
};

export default FrontRegistrationForm;
import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserDto } from '../../../../types/UserDto';
import UserService from '../../../../services/userService';
import './editWindow.css';
import { getCurrentUser, logout } from '../../../../api/axios';

interface EditUserWindowProps {
    user: UserDto;
    onClose: () => void;
    onSave?: (updatedUser: UserDto) => void;
}

const EditUserSchema = z.object({
    firstName: z.string().min(1, 'First Name is required'),
    lastName: z.string().min(1, 'Last Name is required'),
    email: z.string().email('Invalid email address'),
    role: z.enum(['visitor', 'admin', 'staff', 'moderator']),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Passwords do not match',
            path: ['confirmPassword'],
        });
    }
});

type EditUserFormValues = z.infer<typeof EditUserSchema>;

const getFrontendRole = (backendRole: string): 'visitor' | 'admin' | 'moderator' => {
    switch (backendRole) {
        case 'ROLE_ADMIN': return 'admin';
        case 'ROLE_VISITOR': return 'visitor';
        case 'ROLE_MODERATOR': return 'moderator';
        default: return 'visitor';
    }
};

const mapFrontendRoleToBackend = (frontendRole: string) => {
    switch (frontendRole) {
        case 'admin': return 'ROLE_ADMIN';
        case 'visitor': return 'ROLE_VISITOR';
        // case 'staff': return 'ROLE_GUEST';
        case 'moderator': return 'ROLE_MODERATOR';
        default: return 'ROLE_VISITOR';
    }
};

export const EditUserWindow: React.FC<EditUserWindowProps> = ({ user, onClose, onSave }) => {
    const [currentUser, setCurrentUser] = React.useState<UserDto | null>(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const currentU = await getCurrentUser();
                if (currentU) {
                    setCurrentUser(currentU);

                }
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };
        fetchCurrentUser();
    }
        , []);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<EditUserFormValues>({
        resolver: zodResolver(EditUserSchema),
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: getFrontendRole(user.role),
        },
    });

    const onSubmit: SubmitHandler<EditUserFormValues> = async (data) => {
        try {
            const updatedUser: UserDto = {
                ...user,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                role: mapFrontendRoleToBackend(data.role),
            };

            const response = await UserService.changeRole(updatedUser);

            if (onSave) {
                onSave(response);
                if (currentUser && currentUser.id === user.id) {
                    if (response.email !== user.email) {
                        alert("Email changed, please login again with the new email")
                        logout();
                    }
                }
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user. Please try again.');
        } finally {
            onClose();
        }
    };

    return (
        <div className="editUserWindow-overlay">
            <div className="editUserWindow-container">
                <button onClick={onClose} className="editUserWindow-close" aria-label="Close">
                    &times;
                </button>
                <h2 className="editUserWindow-title">Edit User</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="editUserWindow-form">
                    <div className="editUserWindow-field">
                        <label>First Name</label>
                        <input
                            {...register('firstName')}
                            placeholder="Enter first name"
                            className={errors.firstName ? 'input-error' : ''}
                        />
                        {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
                    </div>

                    <div className="editUserWindow-field">
                        <label>Last Name</label>
                        <input
                            {...register('lastName')}
                            placeholder="Enter last name"
                            className={errors.lastName ? 'input-error' : ''}
                        />
                        {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
                    </div>

                    <div className="editUserWindow-field">
                        <label>Email</label>
                        <input
                            {...register('email')}
                            placeholder="Enter email"
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && <p className="error-message">{errors.email.message}</p>}
                    </div>

                    <div className="editUserWindow-field">
                        <label>Role</label>
                        <select {...register('role')}>
                            <option value="visitor">Visitor</option>
                            <option value="admin">Admin</option>
                            {/* <option value="staff">Staff</option> */}
                            <option value="moderator">Moderator</option>
                        </select>
                    </div>

                    <div className="editUserWindow-field">
                        <label>Password</label>
                        <input
                            type='password'
                            {...register('password')}
                            placeholder="Fill this if you need to change the password"
                            className={errors.email ? 'input-error' : ''}
                        />

                    </div>

                    <div className="editUserWindow-field">
                        <label>Confirm Password</label>
                        <input
                            type='password'
                            {...register('password')}
                            placeholder="Fill this if you need to change the password"
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
                    </div>

                    <div className="editUserWindow-buttons">
                        <button type="button" className="cancel-button" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className="save-button" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

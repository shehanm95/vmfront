import React, { useRef, useState } from 'react';
import { z } from 'zod';
import './visitType.css';
import { VisitType } from '../../../../types/visitType';
import { VisitTypeService } from '../../../../services/visitTypeSerive'; // Adjust path as needed

interface VisitTypeProps {
    onClose: () => void;
    getSavedType: (visitType: VisitType) => void;
}

const visitTypeSchema = z.object({
    visitTypeName: z.string().min(1, 'Visitor type name is required'),
    visitTypeDescription: z.string().min(1, 'Description is required'),
    isActive: z.boolean(),
});

export const CreateVisitType: React.FC<VisitTypeProps> = ({ onClose, getSavedType }) => {
    const [visitTypeName, setVisitTypeName] = useState<string>('');
    const [visitTypeDescription, setVisitTypeDescription] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean>(true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setImagePreview(null);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const submitVisitType = async () => {
        try {
            // Validate form data
            const visitTypeData = visitTypeSchema.parse({
                visitTypeName,
                visitTypeDescription,
                isActive,
            });

            // Create VisitType object
            const newVisitType: VisitType = {
                visitTypeName: visitTypeData.visitTypeName,
                visitTypeDescription: visitTypeData.visitTypeDescription,
                visitOptions: [],
                isActive: visitTypeData.isActive,
                imageName: imageFile ? imageFile.name : undefined,
            };

            // Save to database using VisitTypeService
            const savedVisitType = await VisitTypeService.createVisitType(newVisitType, imageFile || undefined);

            // Pass saved visit type to parent
            getSavedType(savedVisitType);
            setErrors({});
            onClose();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors = error.errors.reduce((acc, curr) => {
                    acc[curr.path[0]] = curr.message;
                    return acc;
                }, {} as { [key: string]: string });
                setErrors(formattedErrors);
            } else {
                console.error('Error saving visit type:', error);
                setErrors({ general: 'Failed to save visit type. Please try again.' });
            }
        }
    };

    return (
        <div className="popup-form">
            <button onClick={onClose} className="popup-form-close" aria-label="Close">
                ×
            </button>
            <h2 className="popup-form-title">Create Visitor Type</h2>

            <div className="popup-form-content">
                {errors.general && <span className="error-text">{errors.general}</span>}

                <div className="popup-form-group">
                    <label className="popup-form-label">Visitor Type :</label>
                    <input
                        type="text"
                        className="popup-form-input"
                        placeholder="This will display on Front Menu"
                        value={visitTypeName}
                        onChange={(e) => setVisitTypeName(e.target.value)}
                    />
                    {errors.visitTypeName && (
                        <span className="error-text">{errors.visitTypeName}</span>
                    )}
                </div>

                <div className="popup-form-group">
                    <label className="popup-form-label">Cover Image :</label>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                    <button type="button" onClick={triggerFileInput} className="popup-form-button">
                        Choose Image
                    </button>
                    {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="popup-form-image mt-2" />
                    )}
                </div>

                <div className="popup-form-group">
                    <label className="popup-form-label">Visitor Type Description :</label>
                    <textarea
                        className="popup-form-textarea"
                        placeholder="Describe your visitor type here"
                        value={visitTypeDescription}
                        onChange={(e) => setVisitTypeDescription(e.target.value)}
                    ></textarea>
                    {errors.visitTypeDescription && (
                        <span className="error-text">{errors.visitTypeDescription}</span>
                    )}
                </div>

                <div className="popup-form-group">
                    <label className="popup-form-label">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />
                        Active
                    </label>
                    {errors.isActive && (
                        <span className="error-text">{errors.isActive}</span>
                    )}
                </div>

                <div className="popup-form-buttonWrapper">
                    <button onClick={submitVisitType} className="popup-form-button">
                        Add Type
                    </button>
                </div>
            </div>
        </div>
    );
};

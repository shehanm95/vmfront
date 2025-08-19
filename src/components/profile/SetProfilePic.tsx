import { AxiosError } from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { canvasPreview } from './subProf/CanvasPerview';
import { useDebounceEffect } from '../customHooks/useDebounceEffect';
import { ApiErrorResponse } from '../../types/ApiErrorResonse';
import { toast } from 'react-toastify';
import userService from '../../services/userService';
import { UserDto } from '../../types/UserDto';
import 'react-image-crop/dist/ReactCrop.css';
import './setProfilePic.css'; // Assuming you have a CSS file for styling

interface SetImagePathProp {
    imagePath: string;
    setImagePath: (imagePath: string) => void;
    user: UserDto;
    closeWindow: () => void;
}

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    );
}

export const SetProfilePic = ({ imagePath, setImagePath, user, closeWindow }: SetImagePathProp) => {
    const [uploadedImage, setUploadedImage] = useState<string>(imagePath);
    const [imgSrc, setImgSrc] = useState<string>('');
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [aspect, setAspect] = useState<number>(1);
    const imgRef = useRef<HTMLImageElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle file selection
    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined); // Makes crop UI re-appear
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImgSrc(reader.result?.toString() || '');
            });
            reader.readAsDataURL(file);
        }
    };

    // Handle image load
    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        if (aspect) {
            const { width, height } = e.currentTarget;
            setCrop(centerAspectCrop(width, height, aspect));
        }
    }

    // Debounce effect for canvas preview
    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop,
                );
            }
        },
        100,
        [completedCrop],
    );

    // Convert canvas to blob and upload
    const saveImage = async () => {
        try {
            if (!completedCrop || !previewCanvasRef.current) {
                throw new Error('Crop not completed');
            }

            // Get the cropped image as a blob
            previewCanvasRef.current.toBlob(async (blob) => {
                if (blob) {
                    // Create a file from the blob
                    const file = new File([blob], 'profile-pic.jpg', { type: 'image/jpeg' });

                    // Upload the file
                    const img = await userService.saveImage(user.id!, file);

                    // Update the UI with the new image
                    const imageUrl = URL.createObjectURL(blob);
                    setUploadedImage(imageUrl);
                    setImagePath(imageUrl);

                    // Reset the crop state
                    setImgSrc('');
                    setCrop(undefined);

                    toast.success('Profile picture updated successfully!');
                }
            }, 'image/jpeg', 0.9); // 0.9 is the quality
            closeWindow(); // Close the window after saving
        } catch (e) {
            const error = e as AxiosError<ApiErrorResponse>;
            toast.error(error.response?.data.message || 'Error in setting image');
        }
    };

    return (
        <div className="profile-pic-container">
            {/* Current profile picture */}
            {!imgSrc && (
                <div className="set-current-profile">
                    <img
                        src={uploadedImage}
                        alt="Current profile"
                        className="set-profile-image"
                    />
                </div>
            )}

            {/* Image cropping UI */}
            {imgSrc && (
                <div className="crop-container">
                    <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                        circularCrop={true}
                    >
                        <img
                            ref={imgRef}
                            alt="Crop me"
                            src={imgSrc}
                            onLoad={onImageLoad}
                            style={{ maxWidth: '100%', maxHeight: '70vh' }}
                        />
                    </ReactCrop>
                </div>
            )}

            {/* Canvas for preview (hidden) */}
            <div style={{ display: 'none' }}>
                <canvas
                    ref={previewCanvasRef}
                    style={{
                        border: '1px solid black',
                        objectFit: 'contain',
                    }}
                />
            </div>

            {/* File input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                style={{ display: 'none' }}
            />

            {/* Action buttons */}
            <div className="button-group">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-primary"
                >
                    {imgSrc ? 'Choose Different Image' : 'Change Profile Picture'}
                </button>

                {imgSrc && (
                    <>
                        <button
                            onClick={() => {
                                setImgSrc('');
                                setCrop(undefined);
                            }}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={saveImage}
                            className="btn btn-success"
                            disabled={!completedCrop}
                        >
                            Save Image
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
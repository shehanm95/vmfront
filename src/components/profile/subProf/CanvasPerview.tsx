import { PixelCrop } from "react-image-crop";

export async function canvasPreview(
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    crop: PixelCrop,
) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('No 2d context');
    }

    // Calculate scale factors for natural vs displayed image size
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas dimensions to match the crop area (in device pixels for crispness)
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(crop.width * pixelRatio);
    canvas.height = Math.floor(crop.height * pixelRatio);

    // Scale the context to ensure high quality rendering
    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    // Calculate crop coordinates and dimensions in the original image
    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;

    // Clear any previous content
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the cropped portion of the image
    ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        crop.width,
        crop.height,
    );
}
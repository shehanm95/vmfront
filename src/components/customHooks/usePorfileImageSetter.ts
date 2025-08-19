import { useEffect, useState } from 'react'
import { UserDto } from '../../types/UserDto'
import ProfImage from '../../assets/ProfDefault.avif'
import userService from '../../services/userService';

export const usePorfileImageSetter = ({ user }: { user: UserDto }) => {
    const [profileImage, setProfileImage] = useState<string>(ProfImage);

    useEffect(() => {
        if (user?.imagePath) {
            const getProfileImage = async () => {
                try {
                    const response = await userService.getImage(user.imagePath!);
                    if (response) {
                        console.log("fetched profile image for " + user.firstName + " " + user.lastName);
                        setProfileImage(URL.createObjectURL(response));
                    }
                } catch (error) {
                    console.error("Error fetching " + user.firstName + " profile image:", error);
                }
            }
            getProfileImage();
        }
    }, []);
    return (
        {
            profileImage,
            setProfileImage
        }
    )
}

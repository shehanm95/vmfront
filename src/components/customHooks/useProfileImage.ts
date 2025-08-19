// import React, { use, useCallback } from 'react'
// import { UserDto } from '../../types/user'
// import userService from '../../services/userService';
// import ProfImage from '../../assets/ProfDefault.avif';

// export const useProfileImageHook = () => {
//   const [image, setImage] = React.useState<string>('');


//   const getProfileImage = useCallback(async (user: UserDto) => {
//     if (user.imagePath) {
//       try {
//         const img = await userService.getImage(user.imagePath);
//         if (img) {
//           const imageUrl = URL.createObjectURL(img);
//           user.image = imageUrl;
//           setImage(imageUrl);
//           return;
//         }
//       } catch (error) {
//         console.error('Error fetching profile image:', error);
//       }
//     }
//     // Fallback to default image
//     user.image = ProfImage;
//     setImage(ProfImage);
//   }, []);
//   return ({
//     getProfileImage
//   })

// }


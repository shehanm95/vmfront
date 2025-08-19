import React, { useEffect, useState } from 'react'
import { UserDto } from '../../../../types/UserDto'
import userService from '../../../../services/userService'
import ProfPic from '../../../frontOfficePage/frontComp/profileImage.avif'
import './personCircle.css'
import { useMyNavigator } from '../../../customHooks/useMyNavigator'
import { getCurrentUser } from '../../../../api/axios'

export const PersonCircle = ({ user }: { user: UserDto }) => {
    const [image, setImage] = useState(ProfPic)
    const { navigate, links } = useMyNavigator()

    useEffect(() => {
        if (user.imagePath) {
            const getPersonImage = async () => {
                try {
                    const img = await userService.getImage(user.imagePath!)
                    setImage(URL.createObjectURL(img))
                } catch (error) {
                    console.log('fail to get image', error)
                }
            }
            getPersonImage();
        }
    }, [])

    return (

        <div onClick={(e) => {
            e.stopPropagation();
            navigate(links.profile.checkVisitorMethod(user.id!))
        }} className='d-inline-block flex centerV'>
            <div className="cir-personImage-holder">
                <img className='cir-personImage' src={image} alt="prof" />
            </div>
        </div>
    )
}

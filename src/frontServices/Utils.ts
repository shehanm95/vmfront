import { getCurrentUser } from "../api/axios";
import { UserDto } from "../types/UserDto";

let ur: UserDto | undefined | null = undefined;

export const Utils = {


    toTitleCase: (str: string) => {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    },

    setUser: (user: UserDto | null | undefined) => {

        ur = user;
    },
    getUser: (): UserDto | undefined | null => {
        return ur;
    },

    formatTimeTo12Hour: (timeString: string): string => {
        // Validate the input format using regex
        const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
        if (!timeRegex.test(timeString)) {
            throw new Error('Invalid time format. Expected "HH:MM:SS"');
        }

        // Split the time string into components
        const [hours, minutes] = timeString.split(':').map(Number);

        // Determine AM/PM
        const period = hours >= 12 ? 'PM' : 'AM';

        // Convert to 12-hour format
        let hours12 = hours % 12;
        hours12 = hours12 || 12; // Convert 0 to 12 for 12 AM

        // Format hours and minutes with leading zeros if needed
        const formattedHours = hours12.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');

        return `${formattedHours}:${formattedMinutes} ${period}`;
    }




}
import { useNavigate } from "react-router-dom";
import { LinkService } from "../../frontServices/LinkService";

export const useMyNavigator = () => {
    const navigate = useNavigate();
    const links = LinkService.getInstance();
    return { navigate, links };
}

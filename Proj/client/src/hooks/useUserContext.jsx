import { useContext } from "react";
import { UserContext } from "../../context/userContext";

export function useUserContext() {
    const context = useContext(UserContext)

    if (!context) {
        throw Error('useUserContext must be inside an UserContextProvider')
    }

    return context
}
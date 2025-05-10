import { useAuth } from "@/context/AuthContext"
import { database } from "@/providers/appwrite-providers";
import { useQuery } from "@tanstack/react-query";

export const useUserData = () => {
    const { authState, user } = useAuth();

    const getUserData = async () => {
        if (!user) return;
        const userData = {
            id: user.$id,
            name: user.name,
            email: user.email,
            preferences: user.prefs,
        };
        const dbResponse = await database.getDocument(import.meta.env.VITE_APPWRITE_DATABASE_ID, import.meta.env.VITE_APPWRITE_COLLECTION_ID, user.$id).catch((err) => {
            console.error("Error fetching user data from database:", err);
            return null;
        });
        if (!dbResponse) return;
        return {
            ...userData,
            ...dbResponse,
        }

    }

    return {
        fetch: useQuery({
            queryKey: ["userData"],
            queryFn: getUserData,
            enabled: authState === "authenticated",
            staleTime: 1000 * 60 * 5, // 5 minutes
        })
    }
}
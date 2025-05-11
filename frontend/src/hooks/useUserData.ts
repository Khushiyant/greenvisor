import { useAuth } from "@/context/AuthContext"
import { database } from "@/providers/appwrite-providers";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { formSchema } from "@/pages/setup/FinalizeSetup";
import { AppwriteException } from "appwrite";
type FormData = z.infer<typeof formSchema>;

export const useUserData = () => {
    const { authState, user } = useAuth();
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
    const getUserData = async () => {
        if (!user) return;
        const userData = {
            id: user.$id,
            name: user.name,
            email: user.email,
            preferences: user.prefs,
        };
        const dbResponse = await database.getDocument(databaseId, collectionId, user.$id).catch((err) => {
            console.error("Error fetching user data from database:", err);
            return null;
        });
        if (!dbResponse) return;
        return {
            ...userData,
            ...dbResponse,
        }

    }

    const upsertUserData = async (data: FormData) => {
        if (!user) return;
        try {
            await database.updateDocument(databaseId, collectionId, user.$id, data);
        } catch (err: unknown) {
            if (err instanceof AppwriteException && err.code === 404) {
                await database.createDocument(databaseId, collectionId, user.$id, data);
            } else {
                throw err;
            }
        }
    }

    return {
        fetch: useQuery({
            queryKey: ["userData"],
            queryFn: getUserData,
            enabled: authState === "authenticated",
            staleTime: 1000 * 60 * 5, // 5 minutes
        }),
        upsertUserData
    }
}
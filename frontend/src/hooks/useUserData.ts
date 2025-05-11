import { useAuth } from "@/context/AuthContext"
import { database } from "@/providers/appwrite-providers";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { formSchema } from "@/pages/setup/FinalizeSetup";
import { AppwriteException, type Models } from "appwrite";
type FormData = z.infer<typeof formSchema>;

export type UserData = {
    baujahr: string;
    anzahl_wohneinheiten: number;
    wohnflaeche_qm: number;
    anzahl_vollgeschosse: number;
    angrenzende_gebaeude: string;
    gebaeude_nachtraeglich_gedaemmt: string;
    postleitzahl_immobilie?: string;
    heizung_energietraeger: string;
    heizung_baujahr: string;
    heizung_heizflaechen: string;
    heizung_rohre_gedaemmt: string;
    warmwasseraufbereitung: string;
    dach_form: string;
    dach_ausrichtung: string;
    dach_dachboden_nutzung_zustand: string;
    dach_unbeheizte_flaeche_nutzung?: string;
    dach_anzahl_dachgauben_dachfenster?: string;
    fassade_bauweise: string;
    fassade_zustand: string;
    fenster_verglasung: string;
    fenster_rahmenmaterial: string;
    fenster_erneuerung_jahr: string;
    fenster_anteil_verglasung_prozent: number;
    keller_vorhanden: string;
    keller_art_kellerdecke: string;
    keller_gewoelbekeller: string;
    keller_raumhoehe: string;
    photovoltaik_vorhanden: string;
    sanierungswunsch_massnahmen: string[];
    foerderbonus_einkommensbonus?: boolean;
    foerderbonus_klimageschwind?: boolean;
    foerderbonus_isfp?: boolean;
    latitude: number;
    longitude: number;
};

export const useUserData = () => {
    const { authState, user } = useAuth();
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
    const getUserData = async () => {
        if (!user) return;

        const dbResponse = await database.getDocument(databaseId, collectionId, user.$id).catch((err) => {
            console.error("Error fetching user data from database:", err);
            return null;
        });
        if (!dbResponse) return;
        return dbResponse as Models.Document & UserData;

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
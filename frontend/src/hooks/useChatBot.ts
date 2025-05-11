import { useTranslation } from "react-i18next";
import { useUserData } from "./useUserData";

const ENDPOINT = "http://207.154.197.170:8000/"

export const useChatBot = () => {
    const { i18n } = useTranslation();
    const { data } = useUserData().fetch;
    const sendMessage = async (message: string) => {
        if (!message && !data) return;
        const res = await fetch(ENDPOINT + "graph/query", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question: message,
                lang: i18n.language,
                userid: data?.$id,
            }),
        });
        if (!res.ok) throw new Error("Failed to send message");
        const response = await res.text();
        return response;
    }

    return sendMessage;

}
import { useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { v4 as uuid } from "uuid";

type Message = {
    id: string;
    text: string;
    sender: "user" | "bot";
};

const ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID as string;
const API_KEY = import.meta.env.VITE_VAPI_API_KEY as string;

export function useVapiChat(enabled: boolean) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const vapiRef = useRef<any>(null);

    // Log config and validate env
    // Only warn if enabled
    if (enabled && (!API_KEY || !ASSISTANT_ID)) {
        setError("Missing REACT_APP_VAPI_API_KEY or REACT_APP_VAPI_ASSISTANT_ID in .env");
    }

    // Request mic only when enabled
    const requestMic = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch {
            setError("Microphone access is needed.");
        }
    };

    // Init SDK and start call (only when called)
    const startVapiCall = async () => {
        setMessages([{ id: uuid(), text: "Initializing assistant...", sender: "bot" }]);
        if (!API_KEY || !ASSISTANT_ID) return;
        try {
            const vapi = new Vapi(API_KEY);
            vapiRef.current = vapi;
            vapi.on("call-start", () => { setIsConnected(true); setError(null); });
            vapi.on("call-end", () => { setIsConnected(false); });
            vapi.on("error", (err: any) => { setError(err.message || "error"); });
            vapi.on("speech-start", () => { setIsSpeaking(true); });
            vapi.on("speech-end", () => { setIsSpeaking(false); });

            const call = await vapi.start(ASSISTANT_ID);
            if (!call) setError("Invalid call object; check CORS & credentials");
        } catch (e: any) {
            setError("SDK init failed: " + e.message);
        }
    };

    const stopVapiCall = () => {
        if (vapiRef.current) {
            vapiRef.current.stop();
            vapiRef.current = null;
        }
        setIsConnected(false);
        setIsSpeaking(false);
        setMessages([]);
        setError(null);
    }



    // Test API (now triggers mic request and vapi call)
    const initializeVapiConnection = async () => {
        if (!enabled) return;
        await requestMic();
        await startVapiCall();
    };

    return {
        messages,
        setMessages,
        isConnected,
        isSpeaking,
        error,
        initializeConnection: initializeVapiConnection,
        stopConnection: stopVapiCall,
    };
}
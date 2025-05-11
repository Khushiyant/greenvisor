import { useQuery } from "@tanstack/react-query";
import { useUserData } from "./useUserData"

export const useAddress = () => {
    const { data } = useUserData().fetch;
    // data is now typed with latitude and longitude

    const getAddressFromCoords = async (lat: number, lon: number) => {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
        );
        if (!res.ok) throw new Error("Failed to fetch address");
        const data = await res.json();
        return data.display_name; // or data.address for structured fields
    };

    const getData = async () => {
        if (!data) return;
        const address = await getAddressFromCoords(data.latitude, data.longitude);
        return address;
    }

    return {
        fetch: useQuery({
            queryKey: ["address"],
            queryFn: getData,
            enabled: !!data,
            // staleTime: 1000 * 60 * 5, // 5 minutes
        }),
    }
}
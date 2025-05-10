import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

// Create the QueryClient instance
export const queryClient = new QueryClient();

// Create a persister using localStorage
const persister = createSyncStoragePersister({
    storage: window.localStorage,
});

// Persist the query client
persistQueryClient({
    queryClient,
    persister,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours (optional, default is Infinity)
});
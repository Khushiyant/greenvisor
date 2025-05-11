import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

// Declare your services here
const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);

export { client, account, database, storage };
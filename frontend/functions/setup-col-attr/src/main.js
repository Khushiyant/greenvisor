import { Client, Databases } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // Appwrite client setup
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_FUNCTION_API_KEY);
  const databases = new Databases(client);

  // Config
  const databaseId = 'greenvisordb';
  const collectionId = 'users';

  // Attribute definitions (update as needed for your schema)
  const attributes = [
    // Example attributes (replace/add as per your finalized schema)
    { method: 'createStringAttribute', key: 'firstName', size: 64, required: true, default: '', array: false },
    { method: 'createStringAttribute', key: 'lastName', size: 64, required: true, default: '', array: false },
    { method: 'createStringAttribute', key: 'email', size: 128, required: true, default: '', array: false },
    { method: 'createIntegerAttribute', key: 'yearOfConstruction', min: 1800, max: 2100, required: false, default: null, array: false },
    { method: 'createBooleanAttribute', key: 'hasElevator', required: false, default: false, array: false },
    { method: 'createStringAttribute', key: 'buildingType', size: 32, required: false, default: '', array: false },
    { method: 'createStringAttribute', key: 'energySource', size: 32, required: false, default: '', array: false },
    { method: 'createStringAttribute', key: 'heatingType', size: 32, required: false, default: '', array: false },
    { method: 'createIntegerAttribute', key: 'numberOfUnits', min: 1, max: 1000, required: false, default: null, array: false },
    { method: 'createStringAttribute', key: 'features', size: 32, required: false, default: '', array: true }, // array example
    // Add latitude and longitude as float attributes
    { method: 'createFloatAttribute', key: 'latitude', min: -90, max: 90, required: false, default: null, array: false },
    { method: 'createFloatAttribute', key: 'longitude', min: -180, max: 180, required: false, default: null, array: false },
    // ...add all other fields from your schema here
  ];

  // Index definitions (update as needed for your schema)
  const indexes = [
    { key: 'email', type: 'key', attributes: ['email'], orders: ['ASC'] },
    { key: 'buildingType', type: 'key', attributes: ['buildingType'], orders: ['ASC'] },
    { key: 'energySource', type: 'key', attributes: ['energySource'], orders: ['ASC'] },
    // ...add more indexes as needed for your queries
  ];

  // Helper to create attribute idempotently
  async function createAttribute(attr) {
    try {
      if (attr.method === 'createStringAttribute') {
        await databases.createStringAttribute(databaseId, collectionId, attr.key, attr.size, attr.required, attr.default, attr.array);
      } else if (attr.method === 'createIntegerAttribute') {
        await databases.createIntegerAttribute(databaseId, collectionId, attr.key, attr.min, attr.max, attr.required, attr.default, attr.array);
      } else if (attr.method === 'createBooleanAttribute') {
        await databases.createBooleanAttribute(databaseId, collectionId, attr.key, attr.required, attr.default, attr.array);
      } else if (attr.method === 'createFloatAttribute') {
        await databases.createFloatAttribute(databaseId, collectionId, attr.key, attr.min, attr.max, attr.required, attr.default, attr.array);
      }
      log(`Attribute '${attr.key}' created.`);
    } catch (e) {
      if (e.code === 409) {
        log(`Attribute '${attr.key}' already exists.`);
      } else {
        error(`Error creating attribute '${attr.key}': ${e.message}`);
      }
    }
  }

  // Helper to create index idempotently
  async function createIndex(idx) {
    try {
      await databases.createIndex(databaseId, collectionId, idx.key, idx.type, idx.attributes, idx.orders);
      log(`Index '${idx.key}' created.`);
    } catch (e) {
      if (e.code === 409) {
        log(`Index '${idx.key}' already exists.`);
      } else {
        error(`Error creating index '${idx.key}': ${e.message}`);
      }
    }
  }

  // Create all attributes
  for (const attr of attributes) {
    await createAttribute(attr);
  }

  // Create all indexes
  for (const idx of indexes) {
    await createIndex(idx);
  }

  return res.json({
    status: 'success',
    message: 'Attributes and indexes created (or already exist).',
  });
};

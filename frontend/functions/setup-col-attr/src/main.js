import { Client, Databases } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_FUNCTION_API_KEY);
  const databases = new Databases(client);

  const databaseId = 'greenvisordb';
  const collectionId = 'users';

  // 1. Ensure collection exists
  async function ensureCollection() {
    try {
      await databases.getCollection(databaseId, collectionId);
      log(`Collection '${collectionId}' already exists.`);
    } catch (e) {
      if (e.code === 404) {
        await databases.createCollection(databaseId, collectionId, collectionId, []);
        log(`Collection '${collectionId}' created.`);
      } else {
        error(`Error checking/creating collection: ${e.message}`);
        throw e;
      }
    }
  }

  // 2. Attribute definitions (shorten long keys)
  const attributes = [
    { method: 'createStringAttribute', key: 'baujahr', size: 8, required: true, array: false },
    { method: 'createIntegerAttribute', key: 'anzahl_wohneinheiten', min: 1, max: 1000, required: true, array: false },
    { method: 'createFloatAttribute', key: 'wohnflaeche_qm', min: 1, max: 10000, required: true, array: false },
    { method: 'createIntegerAttribute', key: 'anzahl_vollgeschosse', min: 1, max: 100, required: true, array: false },
    { method: 'createStringAttribute', key: 'angrenzende_gebaeude', size: 32, required: true, array: false },
    { method: 'createStringAttribute', key: 'gebaeude_nachtraeglich_gedaemmt', size: 32, required: true, array: false },
    { method: 'createStringAttribute', key: 'postleitzahl_immobilie', size: 16, required: false, array: false },
    { method: 'createStringAttribute', key: 'heizung_energietraeger', size: 32, required: true, array: false },
    { method: 'createStringAttribute', key: 'heizung_baujahr', size: 16, required: true, array: false },
    { method: 'createStringAttribute', key: 'heizung_heizflaechen', size: 32, required: true, array: false },
    { method: 'createStringAttribute', key: 'heizung_rohre_gedaemmt', size: 32, required: true, array: false },
    { method: 'createStringAttribute', key: 'warmwasseraufbereitung', size: 32, required: true, array: false },
    { method: 'createStringAttribute', key: 'dach_form', size: 32, required: true, array: false },
    { method: 'createStringAttribute', key: 'dach_ausrichtung', size: 32, required: true, array: false },
    { method: 'createStringAttribute', key: 'dach_dachboden_nutzung_zustand', size: 32, required: true, array: false },
    { method: 'createStringAttribute', key: 'dach_unbeheizte_flaeche_nutzung', size: 32, required: false, array: false },
    { method: 'createStringAttribute', key: 'dach_anzahl_dachgauben_dachfenster', size: 32, required: false, array: false },
    { method: 'createStringAttribute', key: 'fassade_bauweise', size: 32, required: true, array: false },
    { method: 'createStringAttribute', key: 'fassade_zustand', size: 32, required: true, array: false },
    { method: 'createStringAttribute', key: 'fenster_verglasung', size: 32, required: true, array: false },
    { method: 'createStringAttribute', key: 'fenster_rahmenmaterial', size: 32, required: true, array: false },
    { method: 'createStringAttribute', key: 'fenster_erneuerung_jahr', size: 8, required: true, array: false },
    { method: 'createIntegerAttribute', key: 'fenster_anteil_verglasung_prozent', min: 0, max: 100, required: true, array: false },
    { method: 'createStringAttribute', key: 'keller_vorhanden', size: 32, required: true, array: false },
    { method: 'createStringAttribute', key: 'keller_art_kellerdecke', size: 32, required: true, array: false },
    { method: 'createStringAttribute', key: 'keller_gewoelbekeller', size: 32, required: true, array: false },
    { method: 'createStringAttribute', key: 'keller_raumhoehe', size: 32, required: true, array: false },
    { method: 'createStringAttribute', key: 'photovoltaik_vorhanden', size: 32, required: true, array: false },
    { method: 'createStringAttribute', key: 'sanierungswunsch_massnahmen', size: 32, required: true, array: true },
    { method: 'createBooleanAttribute', key: 'foerderbonus_einkommensbonus', required: false, default: false, array: false },
    { method: 'createBooleanAttribute', key: 'foerderbonus_klimageschwind', required: false, default: false, array: false },
    { method: 'createBooleanAttribute', key: 'foerderbonus_isfp', required: false, default: false, array: false },
  ];

  // 3. Indexes (update keys to match shortened attribute names)
  const indexes = [
    { key: 'baujahr', type: 'key', attributes: ['baujahr'], orders: ['ASC'] },
    { key: 'postleitzahl_immobilie', type: 'key', attributes: ['postleitzahl_immobilie'], orders: ['ASC'] },
    { key: 'heizung_energietraeger', type: 'key', attributes: ['heizung_energietraeger'], orders: ['ASC'] },
    { key: 'fassade_bauweise', type: 'key', attributes: ['fassade_bauweise'], orders: ['ASC'] },
    { key: 'sanierungswunsch_massnahmen', type: 'key', attributes: ['sanierungswunsch_massnahmen'], orders: ['ASC'] },
  ];

  // 4. Attribute creation
  async function createAttribute(attr) {
    try {
      const isRequired = typeof attr.required === 'boolean' ? attr.required : false;
      if (attr.method === 'createStringAttribute') {
        if (attr.array) {
          await databases.createStringAttribute(databaseId, collectionId, attr.key, attr.size, isRequired, undefined, true);
        } else {
          await databases.createStringAttribute(databaseId, collectionId, attr.key, attr.size, isRequired);
        }
      } else if (attr.method === 'createIntegerAttribute') {
        await databases.createIntegerAttribute(
          databaseId,
          collectionId,
          attr.key,
          isRequired,
          attr.min ?? null,
          attr.max ?? null,
          attr.default ?? null,
          attr.array ?? false
        );
      } else if (attr.method === 'createFloatAttribute') {
        await databases.createFloatAttribute(
          databaseId,
          collectionId,
          attr.key,
          isRequired,
          attr.min ?? null,
          attr.max ?? null,
          attr.default ?? null,
          attr.array ?? false
        );
      } else if (attr.method === 'createBooleanAttribute') {
        await databases.createBooleanAttribute(
          databaseId,
          collectionId,
          attr.key,
          attr.required ?? false,
          attr.default ?? false,
          attr.array ?? false
        );
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

  // 5. Index creation (with retry for attribute propagation)
  async function createIndex(idx) {
    let retries = 5;
    while (retries > 0) {
      try {
        await databases.createIndex(databaseId, collectionId, idx.key, idx.type, idx.attributes, idx.orders);
        log(`Index '${idx.key}' created.`);
        return;
      } catch (e) {
        if (e.code === 409) {
          log(`Index '${idx.key}' already exists.`);
          return;
        } else if (e.code === 400 && e.message.includes('Attribute not available')) {
          log(`Attribute for index '${idx.key}' not available yet. Retrying...`);
          await new Promise(r => setTimeout(r, 2000));
          retries--;
        } else {
          error(`Error creating index '${idx.key}': ${e.message}`);
          return;
        }
      }
    }
    error(`Failed to create index '${idx.key}' after retries.`);
  }

  // --- RUN ---
  await ensureCollection();
  for (const attr of attributes) {
    await createAttribute(attr);
  }
  for (const idx of indexes) {
    await createIndex(idx);
  }

  return res.json({
    status: 'success',
    message: 'Collection, attributes, and indexes created (or already exist).',
  });
};
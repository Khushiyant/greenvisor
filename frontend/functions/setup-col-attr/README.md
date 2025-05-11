# setup-col-attr

## 🧰 What does this function do?

This function is designed to automate the setup of your Appwrite database schema for the Greenvisor app. It programmatically creates all required attributes (fields) and indexes for the `users` collection in the `greenvisordb` database, based on the finalized building setup form schema. This ensures your Appwrite collection is always up-to-date and ready for use by the frontend.

- **Creates all required attributes** (string, integer, boolean, array, etc.) for the building setup form.
- **Creates recommended indexes** for efficient querying.
- **Idempotent:** Safely skips attributes or indexes that already exist, so it can be run multiple times without error.
- **Logs** each step for easy troubleshooting.

## 🧰 Usage

### POST /

- Triggers the setup: creates all attributes and indexes for the `users` collection in the `greenvisordb` database.
- Returns a JSON response indicating success or any errors.

**Sample `200` Response:**

```json
{
  "status": "success",
  "message": "Attributes and indexes created (or already exist)."
}
```

## ⚙️ Configuration

| Setting           | Value         |
| ----------------- | ------------- |
| Runtime           | Node (18.0)   |
| Entrypoint        | `src/main.js` |
| Build Commands    | `npm install` |
| Permissions       | `any`         |
| Timeout (Seconds) | 15            |

## 🔒 Environment Variables

The following environment variables are required for this function to connect to your Appwrite instance:

| Variable                          | Description                                 |
| ---------------------------------- | ------------------------------------------- |
| APPWRITE_FUNCTION_API_ENDPOINT     | The Appwrite API endpoint URL                |
| APPWRITE_FUNCTION_PROJECT_ID       | The Appwrite Project ID                      |
| APPWRITE_FUNCTION_API_KEY          | The Appwrite API Key (with DB permissions)   |

These must be set in your Appwrite function environment for successful execution.

## 📝 Notes

- Update the schema in `src/main.js` if you add or change fields in your building setup form.
- This function is safe to run multiple times.
- For troubleshooting, check the function logs in the Appwrite console.

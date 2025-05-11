## Setup and Installation

This section provides instructions on how to get the frontend application up and running on your local machine using Bun.

### Prerequisites

Before you start, ensure you have the following installed on your system:

* **Bun**: This project uses Bun as its JavaScript runtime and toolkit. You can install it by following the instructions on the official Bun website: [https://bun.sh/](https://bun.sh/)

### Locally

Follow these steps to set up and run the project on your local machine:

1.  **Install Dependencies:**
    Open your terminal in the project's root directory and run the following command to install all the necessary dependencies (listed in `package.json`) using Bun:
    ```bash
    bun install
    ```

2.  **Environment Variables:**
    This project requires several environment variables to be configured for its backend services (Appwrite and potentially VAPI) to function correctly. Create a `.env` file in the project root and populate it with the following variables.

    Create a file named `.env` in the root of your project and add the following content:
    ```env
    VITE_APPWRITE_ENDPOINT=[https://cloud.appwrite.io/v1](https://cloud.appwrite.io/v1)
    VITE_APPWRITE_PROJECT_ID=greenvisor
    VITE_APPWRITE_API_KEY=[YOUR_APPWRITE_API_KEY]
    VITE_APPWRITE_DATABASE_ID=greenvisordb
    VITE_APPWRITE_COLLECTION_ID=users
    VITE_APPWRITE_FUNCTION_ID=greenvisor-fetcher
    VITE_VAPI_API_KEY=
    VITE_VAPI_ASSISTANT_ID=
    ```
    **Important:**
    * You **must** replace `[YOUR_APPWRITE_API_KEY]` with your actual Appwrite Server API key.
    * The `VITE_VAPI_API_KEY` and `VITE_VAPI_ASSISTANT_ID` are shown as empty; you will need to fill these in with the appropriate values if the features relying on VAPI are to be used.
    * All variables are prefixed with `VITE_` to be exposed to the client-side code, as per Vite's convention.

3.  **Run the Development Server:**
    The `package.json` file defines a `dev` script as `"vite"`. To start the application in development mode with hot-reloading, run:
    ```bash
    bun dev
    ```
    This command will execute the `vite` command to start the Vite development server using Bun. By default, Vite usually runs on `http://localhost:5173`, but the actual URL will be printed in the terminal if the default port is occupied or configured differently.

4.  **Access the Application:**
    Open your web browser and navigate to the URL provided by the development server (e.g., `http://localhost:5173`). You should see the application running.

### Building for Production

When you are ready to deploy your application, you need to create an optimized production build.

1.  **Build the Project:**
    The project's `package.json` defines a `build` script as `"tsc -b && vite build"`. To build the application, run:
    ```bash
    bun run build
    ```
    This command first performs a TypeScript type check for the project (`tsc -b`) and then, if successful, bundles the application using Vite. The output is typically placed in a `dist` folder in the project root, optimized and ready for deployment.

2.  **Previewing the Production Build (Optional):**
    After building, you can preview the production version locally. The `package.json` defines a `preview` script as `"vite preview"`. Run:
    ```bash
    bun run preview
    ```
    This command starts a local static web server using Vite that serves the files from your build output directory (typically `dist`). It will print the URL where you can access the production preview.
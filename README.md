# Dester Backend [JS]

## .env Variables

Enter values without quotes:

- `TMDB_API_KEY`: Your TMDB API key.
- `DATA_DIRECTORY_PATH`: Path to store the generated TMDB data.
- `CONFIG_PATH`: Path to the config file.

## API Endpoints

### `/api/v1/home`

- **Description:** Provides data for the homepage of the Dester client.

### `/api/v1/users`

- **GET Request**

  - **Description:** Returns a list of all users profiles along with their associated data.

- **POST Request**

  - **Description:** Creates a new user profile.
  - **JSON Body:**
    ```json
    {
      "name": "string",
      "passwordProtected": "boolean",
      "password": "string",
      "isChildUser": "boolean",
      "profileImage": "string"
    }
    ```

- **PATCH Request**

  - **Description:** Update an existing user profile.
  - **JSON Body:**
    ```json
    {
      "name": "string",
      "passwordProtected": "boolean",
      "previousPassword": "string",
      "password": "string",
      "isChildUser": "boolean",
      "profileImage": "string"
    }
    ```

### `/api/v1/scan-files`

- **GET Request**

  - **Description:** Provides real-time updates on the data generation process initiated by a POST request.

- **POST Request**

  - **Description:** Initiates the data generation process for a specified directory.
  - **JSON Body:**
    ```json
    {
      "path": "path to the directory",
      "type": "tv" | "movie"
    }
    ```

## Development Setup

- Execute `pnpm dev:gen` to create test files and folders.
- If desired, update the `demo.mp4` file in the root directory and modify the final lines of `dummy_folder_gen.ts` to adjust file generation.
- `-mt` media type `movie | tv`

## Notes

- This application does not use a database.
- **_Note:_** The majority of the code is generated with the help of ChatGPT (free tier).

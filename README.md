# Dester Backend [JS]

## .env Variables

Enter values without quotes:

- `TMDB_API_KEY`: Your TMDB API key.
- `DATA_DIRECTORY_PATH`: Path to store the generated TMDB data.
- `CONFIG_PATH`: Path to the config file.

## API Endpoints

### `/api/home`

- **Description:** Provides data for the homepage of the Dester client.

### `/api/scan-files`

- **POST Request**

  - **Description:** Initiates the data generation process for a specified directory.
  - **JSON Body:**
    ```json
    {
      "path": "path to the directory",
      "type": "tv" | "movie"
    }
    ```

- **GET Request**
  - **Description:** Provides real-time updates on the data generation process initiated by a POST request.

## Development Setup

- Execute `pnpm dev:gen` to create test files and folders.
- If desired, update the `demo.mp4` file in the root directory and modify the final lines of `dummy_folder_gen.ts` to adjust file generation.
- `-mt` media type `movie | tv`

## Notes

- This application does not use a database.
- **_Note:_** The majority of the code is generated with the help of ChatGPT (free tier).

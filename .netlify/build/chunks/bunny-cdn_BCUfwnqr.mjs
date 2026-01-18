const BUNNY_STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE_NAME || "side-effects";
const BUNNY_STORAGE_REGION_HOSTNAME = process.env.BUNNY_STORAGE_REGION_HOSTNAME || "storage.bunnycdn.com";
const BUNNY_STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY || "9beb8922-fe4f-436f-8a74be6eea5e-a625-4332";
class BunnyStorageService {
  constructor() {
    this.apiKey = BUNNY_STORAGE_API_KEY;
    this.storageZoneName = BUNNY_STORAGE_ZONE_NAME;
    this.regionHostname = BUNNY_STORAGE_REGION_HOSTNAME;
    if (!this.apiKey || !this.storageZoneName || !this.regionHostname) {
      throw new Error(
        "Bunny Storage environment variables are not configured. Please set BUNNY_STORAGE_API_KEY, BUNNY_STORAGE_ZONE_NAME, and BUNNY_STORAGE_REGION_HOSTNAME."
      );
    }
  }
  /**
   * Constructs the full API URL for a given path in the storage zone.
   * @param path - The relative path to the file or directory.
   * @returns The full API endpoint URL.
   */
  getApiUrl(path = "") {
    return `https://${this.regionHostname}/${this.storageZoneName}/${path}`;
  }
  /**
   * Handles the response from the Bunny API, throwing an error for non-successful responses.
   * @param response - The raw fetch response object.
   */
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Bunny API Error (${errorData.HttpCode}): ${errorData.Message}`
      );
    }
    return response.json();
  }
  /**
   * Lists all files and subdirectories within a specific path.
   * @param path - The directory path to list. MUST end with a '/' to list a directory.
   *               Omit to list the root directory.
   * @returns A promise that resolves to an array of storage objects.
   */
  async listFiles(path = "") {
    const bunnyPath = path.endsWith("/") || path === "" ? path : `${path}/`;
    const response = await fetch(this.getApiUrl(bunnyPath), {
      method: "GET",
      headers: {
        AccessKey: this.apiKey
      }
    });
    return this.handleResponse(response);
  }
  /**
   * Downloads a file from the storage zone.
   * @param filePath - The full path to the file you want to download (e.g., 'images/logo.png').
   * @returns A promise that resolves to the raw fetch Response object. The consumer is responsible
   *          for processing the body (e.g., with .buffer(), .blob(), or streaming it).
   */
  async downloadFile(filePath) {
    const response = await fetch(this.getApiUrl(filePath), {
      method: "GET",
      headers: {
        AccessKey: this.apiKey
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Bunny API Error (${errorData.HttpCode}): ${errorData.Message}`
      );
    }
    return response;
  }
  /**
   * Uploads a file to a specified path. Creates directory structure if it doesn't exist.
   * @param destinationPath - The full path where the file will be saved (e.g., 'uploads/new-file.jpg').
   * @param fileData - The file content as a Buffer.
   * @param fileMimeType - The MIME type of the file (e.g., 'image/jpeg').
   * @param checksum - (Optional) An uppercase SHA256 checksum for integrity validation.
   * @returns A promise that resolves to a success response object.
   */
  async uploadFile(destinationPath, fileData, fileMimeType = "application/octet-stream", checksum) {
    const headers = {
      AccessKey: this.apiKey,
      "Content-Type": fileMimeType
    };
    if (checksum) {
      headers["Checksum"] = checksum;
    }
    const response = await fetch(this.getApiUrl(destinationPath), {
      method: "PUT",
      headers,
      body: fileData
    });
    return this.handleResponse(response);
  }
  /**
   * Deletes an object (a file or a directory) from the storage zone.
   * If the target is a directory, all of its contents will be deleted recursively.
   * @param objectPath - The path to the file or directory to delete. To delete a directory,
   *                     ensure the path ends with a '/'. (e.g., 'old-file.txt' or 'temp-uploads/').
   * @returns A promise that resolves to a success response object.
   */
  async deleteObject(objectPath) {
    const response = await fetch(this.getApiUrl(objectPath), {
      method: "DELETE",
      headers: {
        AccessKey: this.apiKey
      }
    });
    return this.handleResponse(response);
  }
}
const bunnyStorageService = new BunnyStorageService();

export { bunnyStorageService as b };

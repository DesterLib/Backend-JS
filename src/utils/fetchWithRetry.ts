async function fetchWithRetry(
  fetchFunction: () => Promise<any>,
  retries: number = 3,
  delay: number = 1000
): Promise<any> {
  try {
    return await fetchFunction();
  } catch (error: any) {
    if (retries > 0 && error.message.includes("Too Many Requests")) {
      console.warn(`Retrying... Attempts left: ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(fetchFunction, retries - 1, delay * 2); // Exponential backoff
    } else {
      throw error; // Re-throw error if not retryable or out of retries
    }
  }
}
export default fetchWithRetry;

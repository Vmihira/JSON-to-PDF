// Data service to handle loading JSON data

/**
 * Load JSON data from a file
 * @param path Path to the JSON file
 * @returns Parsed JSON data or null if there was an error
 */
export async function loadJsonData<T>(path: string): Promise<T | null> {
  try {
    // Use fetch API instead of dynamic import for JSON files
    const response = await fetch(`/api/${path}`)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    console.error(`Error loading data from ${path}:`, error)
    return null
  }
}

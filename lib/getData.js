export async function getData(endpoint) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // Validate that the base URL is defined
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL is not defined in the environment variables.");
    }

    // Construct the full URL
    const fullUrl = `${baseUrl}/api/${endpoint}`;
    console.log(`Fetching data from: ${fullUrl}`);

    // Make the fetch request
    const response = await fetch(fullUrl, {
      cache: "no-store",
    });

    // Log the response status and headers for debugging
    console.log(`Response Status: ${response.status} ${response.statusText}`);
    console.log(`Response Headers:`, Object.fromEntries(response.headers.entries()));

    // Check if the response is OK (status code 2xx)
    if (!response.ok) {
      // Attempt to parse the response body for more details
      let errorDetails = null;
      try {
        errorDetails = await response.json();
      } catch (jsonError) {
        errorDetails = { message: "Failed to parse error details as JSON" };
      }

      // Log the error details for debugging
      console.error(`Error fetching ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        details: errorDetails,
      });

      // Throw an error with detailed information
      throw new Error(
        `Failed to fetch ${endpoint}: ${response.status} ${response.statusText}. Details: ${JSON.stringify(errorDetails)}`
      );
    }

    // Parse and return the JSON response
    const data = await response.json();
    console.log(`Successfully fetched data for ${endpoint}:`, data);
    return data;
  } catch (error) {
    // Log the full error stack trace
    console.error(`Error in getData for endpoint /api/${endpoint}:`, error);

    // Re-throw the error to propagate it to the caller
    throw error;
  }
}
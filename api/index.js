const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export default async function callApi({ url, method, token, body }) {
  try {
    const options = {
      method: method ? method.toUpperCase() : "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body !== undefined) options.body = JSON.stringify(body);
    if (token) options.headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}${url}`, options);

    const text = await response.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      // Server returned non-JSON (HTML error page, proxy error, etc.)
      throw new Error(`Server error ${response.status} — check that ${url} exists on your backend.`);
    }

    if (result.error) throw new Error(result.error);

    if (!response.ok) {
      throw new Error(result.message ?? `Request failed (${response.status})`);
    }

    return result;
  } catch (err) {
    console.log("[callApi]", url, err.message);
    throw err;
  }
}

const API_BASE = process.env.API_URL;

export default async function callApi({url, method, token, body}) {
    try {
        const options = {
            method: method ? method.toUpperCase() : "GET",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        };
        if (token) options.headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE}${url}`, options);
        const result = await response.json();

        if (result.error) {
            throw (result.error);
        }
        return result;
    } catch (err) {
        console.log(err);
    }
}
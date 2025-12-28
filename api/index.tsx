const API_URL = "https://fridge-mate-server.onrender.com/";

interface ApiParams {
    url: string;
    method?: string;
    token?: string;
    body?: Record<string, any>;
}

export default async function callAPI<T = any> ({url, method, token, body}: ApiParams): Promise<T> {
    try {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const options: RequestInit = {
            method: method? method.toUpperCase(): "Get",
            headers,
            ...(body && {body: JSON.stringify(body)}),
        };

        const response = await fetch(`${API_URL}${url}`, options);
        const result = await response.json();

        if (result.error) {
            throw result.error;
        }

        return result as T;
    } catch (err) {
        console.log(err);
        throw err;
    }   
}
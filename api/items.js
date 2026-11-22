import callApi from "./index";

// Sends a resized, base64-encoded JPEG to the backend, which asks Claude what food is in it.
// Returns [{ foodName, quantity, estimatedExpirationDate, ripenessLevel, confidence }]. Nothing is saved.
export async function scanFoodPhoto(token, imageBase64) {
  const data = await callApi({
    url: "/api/items/scan",
    method: "POST",
    token,
    body: { image: imageBase64, mediaType: "image/jpeg" },
  });
  return data.items;
}

// Every item in the account (all profiles), soonest expiration first.
export async function fetchItems(token) {
  const data = await callApi({ url: "/api/items", method: "GET", token });
  return data.items;
}

// Image source for an item's photo. The endpoint requires auth, so the token goes in a header.
export function itemImageSource(token, itemId) {
  return {
    uri: `${process.env.EXPO_PUBLIC_API_URL}/api/items/${itemId}/image`,
    headers: { Authorization: `Bearer ${token}` },
  };
}

export async function fetchItem(token, itemId) {
  const data = await callApi({ url: `/api/items/${itemId}`, method: "GET", token });
  return data.item;
}

export async function deleteItem(token, itemId) {
  return callApi({ url: `/api/items/${itemId}`, method: "DELETE", token });
}

// items: [{ foodName, expirationDate: "YYYY-MM-DD", ripenessLevel, quantity }]
export async function createItemsBulk(token, profileId, items) {
  return callApi({
    url: "/api/items/bulk",
    method: "POST",
    token,
    body: { profileId, items },
  });
}

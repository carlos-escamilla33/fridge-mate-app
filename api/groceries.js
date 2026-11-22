import callApi from "./index";

export async function fetchGroceries(token) {
  const data = await callApi({ url: "/api/groceries", method: "GET", token });
  return data.groceries;
}

// sourceItemId: the fridge item it was suggested from, or null for items typed in by hand.
export async function addGrocery(token, { name, profileId, sourceItemId = null }) {
  const data = await callApi({
    url: "/api/groceries",
    method: "POST",
    token,
    body: { name, profileId, sourceItemId },
  });
  return data.grocery;
}

export async function setGroceryChecked(token, groceryId, checked) {
  const data = await callApi({
    url: `/api/groceries/${groceryId}`,
    method: "PATCH",
    token,
    body: { checked },
  });
  return data.grocery;
}

export async function removeGrocery(token, groceryId) {
  return callApi({ url: `/api/groceries/${groceryId}`, method: "DELETE", token });
}

export async function clearCheckedGroceries(token) {
  return callApi({ url: "/api/groceries/checked", method: "DELETE", token });
}

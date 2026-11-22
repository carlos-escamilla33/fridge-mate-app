// Holds the photo from the most recent scan while it's being reviewed. Kept out of route params
// because the base64 thumbnail is tens of KB.
let pendingPhoto = null;

// photo: { uri, base64 }
export function setPendingPhoto(photo) {
  pendingPhoto = photo;
}

// Returns the pending photo once, then clears it.
export function takePendingPhoto() {
  const photo = pendingPhoto;
  pendingPhoto = null;
  return photo;
}

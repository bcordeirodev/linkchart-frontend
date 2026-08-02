/**
 * Side length (px) of the square avatar thumbnail generated at upload time.
 *
 * The public page renders the avatar circle at ~116px, so 512px keeps it
 * crisp on 3x/4x displays with plenty of margin while staying far under the
 * backend's 1MB `avatar_thumb` cap. The ORIGINAL upload is untouched — it
 * remains the Open Graph image, where WhatsApp/Instagram want the full
 * photo.
 */
export const AVATAR_THUMB_SIZE = 512;

/**
 * Mirror of the backend's `avatar_thumb` `max:1024` rule
 * (`UploadBioAvatarRequest`) — a thumbnail bigger than this is re-encoded
 * (or dropped) client-side instead of bouncing off a 422.
 */
const AVATAR_THUMB_MAX_BYTES = 1024 * 1024;

/**
 * Decodes an image file into an `HTMLImageElement`, revoking the object URL
 * regardless of outcome.
 *
 * @param file - the image picked by the user (already validated by
 * `validateAvatarFile`).
 * @returns the decoded image element.
 * @throws when the browser cannot decode the file as an image.
 */
async function decodeImage(file: File): Promise<HTMLImageElement> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Promise wrapper around `canvas.toBlob` — resolves `null` when the browser
 * refuses/fails to encode (e.g. unsupported mime), never rejects.
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality?: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      canvas.toBlob(resolve, mimeType, quality);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Generates the square avatar thumbnail sent alongside the original in
 * `POST /api/bio/avatar` (`avatar_thumb` field).
 *
 * Center-crops the largest square out of the source, downscales it to at
 * most {@link AVATAR_THUMB_SIZE} (never upscales), and encodes it as PNG
 * when the source is PNG (preserving transparency for logo-style avatars)
 * or JPEG otherwise. A PNG that still exceeds the backend's 1MB cap is
 * re-encoded as JPEG as a last resort.
 *
 * Failure is always graceful: any decode/encode problem resolves to `null`
 * and the upload proceeds with the original only — the backend treats a
 * missing `avatar_thumb` as "no thumbnail" and the public page falls back
 * to rendering the original, exactly the pre-thumbnail behavior.
 *
 * @param file - the original avatar image the user picked.
 * @returns the thumbnail as a `File` ready for `FormData`, or `null` to
 * skip the thumbnail entirely.
 */
export async function createAvatarThumbnail(file: File): Promise<File | null> {
  try {
    const image = await decodeImage(file);

    const side = Math.min(image.naturalWidth, image.naturalHeight);
    if (side <= 0) return null;

    const target = Math.min(AVATAR_THUMB_SIZE, side);
    const canvas = document.createElement("canvas");
    canvas.width = target;
    canvas.height = target;

    const context = canvas.getContext("2d");
    if (!context) return null;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(
      image,
      (image.naturalWidth - side) / 2,
      (image.naturalHeight - side) / 2,
      side,
      side,
      0,
      0,
      target,
      target,
    );

    const preservesAlpha = file.type === "image/png";
    let blob = await canvasToBlob(
      canvas,
      preservesAlpha ? "image/png" : "image/jpeg",
      preservesAlpha ? undefined : 0.85,
    );

    if (blob && preservesAlpha && blob.size > AVATAR_THUMB_MAX_BYTES) {
      blob = await canvasToBlob(canvas, "image/jpeg", 0.85);
    }

    if (!blob || blob.size > AVATAR_THUMB_MAX_BYTES) return null;

    const extension = blob.type === "image/png" ? "png" : "jpg";
    return new File([blob], `avatar-thumb.${extension}`, { type: blob.type });
  } catch {
    return null;
  }
}

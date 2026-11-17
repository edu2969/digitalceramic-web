export function getStorageObjectPath(
  value: string | null,
  bucket: string
): string | null {
  if (!value) return null

  if (!/^https?:\/\//i.test(value)) {
    return value.startsWith("orders/") ? value : null
  }

  try {
    const segments = new URL(value).pathname.split("/").filter(Boolean)
    const objectIndex = segments.indexOf("object")
    const bucketIndex = objectIndex + 2
    const objectType = segments[objectIndex + 1]

    if (
      objectIndex < 0 ||
      !["sign", "public", "authenticated"].includes(objectType) ||
      decodeURIComponent(segments[bucketIndex]) !== bucket
    ) {
      return null
    }

    const path = decodeURIComponent(segments.slice(bucketIndex + 1).join("/"))
    return path.startsWith("orders/") ? path : null
  } catch {
    return null
  }
}

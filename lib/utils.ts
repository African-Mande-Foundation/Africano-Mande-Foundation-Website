export function flattenStrapiResponse<T>(data: unknown): T {
  if (!data) {
    // Return empty array for undefined/null
    return [] as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map(flattenStrapiResponse) as unknown as T;
  }

  // If data is an object with an 'attributes' key, flatten it
  if (
    typeof data === "object" &&
    data !== null &&
    "attributes" in (data as Record<string, unknown>)
  ) {
    const obj = data as { id: number; attributes: Record<string, unknown> };
    const flattened: Record<string, unknown> = {
      id: obj.id,
      ...obj.attributes,
    };

    // Recursively flatten nested objects and arrays within attributes
    for (const key in flattened) {
      const value = flattened[key];
      if (typeof value === "object" && value !== null) {
        if ("data" in (value as Record<string, unknown>)) {
          flattened[key] = flattenStrapiResponse(
            (value as { data: unknown }).data,
          );
        } else if (Array.isArray(value)) {
          flattened[key] = value.map(flattenStrapiResponse);
        }
      }
    }

    return flattened as T;
  }

  // If data is already a flattened object (e.g., from a nested relation that was already flattened)
  // or a primitive, return it as is.
  return data as T;
}
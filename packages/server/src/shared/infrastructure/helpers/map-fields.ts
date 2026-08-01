type FieldMap = Record<string, string>

export function mapDbToApi<T extends Record<string, unknown>>(
  row: T,
  fieldMap: FieldMap,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [dbKey, apiKey] of Object.entries(fieldMap)) {
    if (dbKey in row) {
      result[apiKey] = row[dbKey]
    }
  }

  return result
}

export function centsToReais(cents: number): number {
  return cents / 100
}

export function formatDate(date: Date | string | null): string | null {
  if (!date) return null
  const d = typeof date === "string" ? new Date(date) : date
  return d.toISOString()
}

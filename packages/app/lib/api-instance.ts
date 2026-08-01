const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333"

export const customInstance = async <T>({
  url,
  method,
  params,
  data,
  headers,
}: {
  url: string
  method: string
  params?: Record<string, string>
  data?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
}): Promise<T> => {
  const queryString = params
    ? `?${new URLSearchParams(params).toString()}`
    : ""

  const response = await fetch(`${BASE_URL}${url}${queryString}`, {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`API ${response.status}: ${errorBody}`)
  }

  return response.json() as Promise<T>
}

export default customInstance

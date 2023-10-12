export type GlobalResponse<T> = {
  success: boolean,
  message: string,
  object: T
}

export type SearchResponse = {
  _id: string,
  path: string,
  prevExtension: string,
  createdAt: string,
  user: string
}
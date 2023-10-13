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
  user: string,
  fileName?: string,
  s3?: string
}

export type ResumeResponse = {
  count: number,
  _id: string
}
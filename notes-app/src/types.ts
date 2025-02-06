export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  parentId: string | null
  children: string[]
}
export interface Project {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
  owner_id: string
  is_public: boolean
  status: 'active' | 'archived'
}

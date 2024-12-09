import { Database } from '@/types/supabase'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const badgesService = {
  getBadges: async () => {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase.from('badges').select('*')
    if (error) throw error
    return data
  },

  createBadge: async (badge: Database['public']['Tables']['badges']['Insert']) => {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase.from('badges').insert(badge).select()
    if (error) throw error
    return data[0]
  },

  updateBadge: async (id: string, badge: Database['public']['Tables']['badges']['Update']) => {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase
      .from('badges')
      .update(badge)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  },

  deleteBadge: async (id: string) => {
    const supabase = createClientComponentClient<Database>()
    const { error } = await supabase.from('badges').delete().eq('id', id)
    if (error) throw error
  },

  assignBadgeToUser: async (userId: string, badgeId: string) => {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase
      .from('user_badges')
      .insert({ user_id: userId, badge_id: badgeId })
      .select()
    if (error) throw error
    return data[0]
  },

  removeBadgeFromUser: async (userId: string, badgeId: string) => {
    const supabase = createClientComponentClient<Database>()
    const { error } = await supabase
      .from('user_badges')
      .delete()
      .eq('user_id', userId)
      .eq('badge_id', badgeId)
    if (error) throw error
  },
}

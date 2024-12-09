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

  // アクティビティに関連するバッジを取得
  getActivityBadges: async (activityId: string) => {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase
      .from('activity_badges')
      .select('*, badges(*)')
      .eq('activity_id', activityId)
    if (error) throw error
    return data
  },

  // アクティビティにバッジを紐付け
  assignBadgeToActivity: async (activityId: string, badgeId: string) => {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase
      .from('activity_badges')
      .insert({ activity_id: activityId, badge_id: badgeId })
      .select()
    if (error) throw error
    return data[0]
  },

  // アクティビティからバッジを削除
  removeBadgeFromActivity: async (activityId: string, badgeId: string) => {
    const supabase = createClientComponentClient<Database>()
    const { error } = await supabase
      .from('activity_badges')
      .delete()
      .eq('activity_id', activityId)
      .eq('badge_id', badgeId)
    if (error) throw error
  },

  // ユーザーが持っていないバッジのみを付与
  assignBadgesIfNotExists: async (userId: string, badgeIds: string[]) => {
    const supabase = createClientComponentClient<Database>()
    
    // 既存のバッジを取得
    const { data: existingBadges } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', userId)
      .in('badge_id', badgeIds)

    // 持っていないバッジのみをフィルタリング
    const newBadgeIds = badgeIds.filter(
      id => !existingBadges?.some(eb => eb.badge_id === id)
    )

    if (newBadgeIds.length === 0) return []

    // 新しいバッジを付与
    const { data, error } = await supabase
      .from('user_badges')
      .insert(
        newBadgeIds.map(badgeId => ({
          user_id: userId,
          badge_id: badgeId
        }))
      )
      .select()

    if (error) throw error
    return data
  },
}

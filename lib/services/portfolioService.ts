import { createClient } from '@supabase/supabase-js'
import { 
  Portfolio, 
  PortfolioMedia, 
  PortfolioComment, 
  PortfolioLike,
  CreatePortfolioRequest, 
  UpdatePortfolioRequest,
  CreatePortfolioMediaRequest,
  CreatePortfolioCommentRequest,
  UpdatePortfolioCommentRequest,
  ApiResponse 
} from '../types/database'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export class PortfolioService {
  // 포트폴리오 CRUD
  static async createPortfolio(data: CreatePortfolioRequest): Promise<ApiResponse<Portfolio>> {
    try {
      const { data: portfolio, error } = await supabase
        .from('portfolios')
        .insert(data)
        .select(`
          *,
          influencer_profiles (
            *,
            user_profiles (*)
          )
        `)
        .single()

      if (error) throw error

      return { success: true, data: portfolio, error: null }
    } catch (error) {
      console.error('Error creating portfolio:', error)
      return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async getPortfolio(portfolioId: string): Promise<ApiResponse<Portfolio>> {
    try {
      const { data: portfolio, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          influencer_profiles (
            *,
            user_profiles (*)
          ),
          portfolio_media (*),
          portfolio_comments (
            *,
            user_profiles (*)
          ),
          portfolio_likes (
            *,
            user_profiles (*)
          )
        `)
        .eq('id', portfolioId)
        .single()

      if (error) throw error

      return { success: true, data: portfolio, error: null }
    } catch (error) {
      console.error('Error getting portfolio:', error)
      return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async getMyPortfolios(influencerProfileId: string): Promise<ApiResponse<Portfolio[]>> {
    try {
      const { data: portfolios, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          influencer_profiles (
            *,
            user_profiles (*)
          ),
          portfolio_media (*)
        `)
        .eq('influencer_profile_id', influencerProfileId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { success: true, data: portfolios, error: null }
    } catch (error) {
      console.error('Error getting my portfolios:', error)
      return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async getPublicPortfolios(category?: string, limit: number = 20): Promise<ApiResponse<Portfolio[]>> {
    try {
      let query = supabase
        .from('portfolios')
        .select(`
          *,
          influencer_profiles (
            *,
            user_profiles (*)
          ),
          portfolio_media (*)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (category) {
        query = query.eq('category', category)
      }

      if (limit) {
        query = query.limit(limit)
      }

      const { data: portfolios, error } = await query

      if (error) throw error

      return { success: true, data: portfolios, error: null }
    } catch (error) {
      console.error('Error getting public portfolios:', error)
      return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async updatePortfolio(portfolioId: string, data: UpdatePortfolioRequest): Promise<ApiResponse<Portfolio>> {
    try {
      const { data: portfolio, error } = await supabase
        .from('portfolios')
        .update(data)
        .eq('id', portfolioId)
        .select(`
          *,
          influencer_profiles (
            *,
            user_profiles (*)
          )
        `)
        .single()

      if (error) throw error

      return { success: true, data: portfolio, error: null }
    } catch (error) {
      console.error('Error updating portfolio:', error)
      return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async deletePortfolio(portfolioId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', portfolioId)

      if (error) throw error

      return { success: true, data: undefined, error: null }
    } catch (error) {
      console.error('Error deleting portfolio:', error)
      return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // 포트폴리오 미디어 관리
  static async addPortfolioMedia(data: CreatePortfolioMediaRequest): Promise<ApiResponse<PortfolioMedia>> {
    try {
      const { data: media, error } = await supabase
        .from('portfolio_media')
        .insert(data)
        .select()
        .single()

      if (error) throw error

      return { success: true, data: media, error: null }
    } catch (error) {
      console.error('Error adding portfolio media:', error)
      return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async updatePortfolioMedia(mediaId: string, data: Partial<PortfolioMedia>): Promise<ApiResponse<PortfolioMedia>> {
    try {
      const { data: media, error } = await supabase
        .from('portfolio_media')
        .update(data)
        .eq('id', mediaId)
        .select()
        .single()

      if (error) throw error

      return { success: true, data: media, error: null }
    } catch (error) {
      console.error('Error updating portfolio media:', error)
      return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async deletePortfolioMedia(mediaId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('portfolio_media')
        .delete()
        .eq('id', mediaId)

      if (error) throw error

      return { success: true, data: undefined, error: null }
    } catch (error) {
      console.error('Error deleting portfolio media:', error)
      return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // 포트폴리오 댓글 관리
  static async addPortfolioComment(data: CreatePortfolioCommentRequest): Promise<ApiResponse<PortfolioComment>> {
    try {
      const { data: comment, error } = await supabase
        .from('portfolio_comments')
        .insert(data)
        .select(`
          *,
          user_profiles (*)
        `)
        .single()

      if (error) throw error

      return { success: true, data: comment, error: null }
    } catch (error) {
      console.error('Error adding portfolio comment:', error)
      return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async updatePortfolioComment(commentId: string, data: UpdatePortfolioCommentRequest): Promise<ApiResponse<PortfolioComment>> {
    try {
      const { data: comment, error } = await supabase
        .from('portfolio_comments')
        .update(data)
        .eq('id', commentId)
        .select(`
          *,
          user_profiles (*)
        `)
        .single()

      if (error) throw error

      return { success: true, data: comment, error: null }
    } catch (error) {
      console.error('Error updating portfolio comment:', error)
      return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async deletePortfolioComment(commentId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('portfolio_comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error

      return { success: true, data: undefined, error: null }
    } catch (error) {
      console.error('Error deleting portfolio comment:', error)
      return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // 포트폴리오 좋아요 관리
  static async togglePortfolioLike(portfolioId: string, userId: string): Promise<ApiResponse<{ liked: boolean }>> {
    try {
      // 기존 좋아요 확인
      const { data: existingLike, error: checkError } = await supabase
        .from('portfolio_likes')
        .select()
        .eq('portfolio_id', portfolioId)
        .eq('user_id', userId)
        .single()

      if (checkError && checkError.code !== 'PGRST116') throw checkError

      if (existingLike) {
        // 좋아요 삭제
        const { error: deleteError } = await supabase
          .from('portfolio_likes')
          .delete()
          .eq('portfolio_id', portfolioId)
          .eq('user_id', userId)

        if (deleteError) throw deleteError

        // 포트폴리오 좋아요 수 감소
        await supabase
          .from('portfolios')
          .update({ like_count: supabase.rpc('decrement', { x: 1 }) })
          .eq('id', portfolioId)

        return { success: true, data: { liked: false }, error: null }
      } else {
        // 좋아요 추가
        const { error: insertError } = await supabase
          .from('portfolio_likes')
          .insert({ portfolio_id: portfolioId, user_id: userId })

        if (insertError) throw insertError

        // 포트폴리오 좋아요 수 증가
        await supabase
          .from('portfolios')
          .update({ like_count: supabase.rpc('increment', { x: 1 }) })
          .eq('id', portfolioId)

        return { success: true, data: { liked: true }, error: null }
      }
    } catch (error) {
      console.error('Error toggling portfolio like:', error)
      return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // 포트폴리오 조회수 증가
  static async incrementViewCount(portfolioId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('portfolios')
        .update({ view_count: supabase.rpc('increment', { x: 1 }) })
        .eq('id', portfolioId)

      if (error) throw error

      return { success: true, data: undefined, error: null }
    } catch (error) {
      console.error('Error incrementing view count:', error)
      return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // 포트폴리오 검색
  static async searchPortfolios(query: string, category?: string): Promise<ApiResponse<Portfolio[]>> {
    try {
      let searchQuery = supabase
        .from('portfolios')
        .select(`
          *,
          influencer_profiles (
            *,
            user_profiles (*)
          ),
          portfolio_media (*)
        `)
        .eq('is_public', true)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)

      if (category) {
        searchQuery = searchQuery.eq('category', category)
      }

      const { data: portfolios, error } = await searchQuery.order('created_at', { ascending: false })

      if (error) throw error

      return { success: true, data: portfolios, error: null }
    } catch (error) {
      console.error('Error searching portfolios:', error)
      return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // 인기 포트폴리오 조회
  static async getPopularPortfolios(limit: number = 10): Promise<ApiResponse<Portfolio[]>> {
    try {
      const { data: portfolios, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          influencer_profiles (
            *,
            user_profiles (*)
          ),
          portfolio_media (*)
        `)
        .eq('is_public', true)
        .order('like_count', { ascending: false })
        .order('view_count', { ascending: false })
        .limit(limit)

      if (error) throw error

      return { success: true, data: portfolios, error: null }
    } catch (error) {
      console.error('Error getting popular portfolios:', error)
      return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // 카테고리별 포트폴리오 조회
  static async getPortfoliosByCategory(category: string, limit: number = 20): Promise<ApiResponse<Portfolio[]>> {
    try {
      const { data: portfolios, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          influencer_profiles (
            *,
            user_profiles (*)
          ),
          portfolio_media (*)
        `)
        .eq('is_public', true)
        .eq('category', category)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return { success: true, data: portfolios, error: null }
    } catch (error) {
      console.error('Error getting portfolios by category:', error)
      return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

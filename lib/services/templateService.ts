import { supabase } from '@/lib/supabase'
import { CampaignTemplate, CreateCampaignTemplateRequest, UpdateCampaignTemplateRequest } from '../types/database'

export class TemplateService {
  // 템플릿 생성
  static async createTemplate(templateData: CreateCampaignTemplateRequest, userId: string): Promise<CampaignTemplate> {
    try {
      const { data, error } = await supabase
        .from('campaign_templates')
        .insert({
          ...templateData,
          created_by: userId,
          usage_count: 0,
          is_public: templateData.is_public ?? false
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating template:', error)
      throw error
    }
  }

  // 템플릿 조회 (단일)
  static async getTemplate(templateId: string): Promise<CampaignTemplate> {
    try {
      const { data, error } = await supabase
        .from('campaign_templates')
        .select('*')
        .eq('id', templateId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching template:', error)
      throw error
    }
  }

  // 사용자의 템플릿 목록 조회
  static async getMyTemplates(userId: string): Promise<CampaignTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('campaign_templates')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching my templates:', error)
      throw error
    }
  }

  // 공개 템플릿 목록 조회
  static async getPublicTemplates(category?: string): Promise<CampaignTemplate[]> {
    try {
      let query = supabase
        .from('campaign_templates')
        .select('*')
        .eq('is_public', true)
        .order('usage_count', { ascending: false })

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching public templates:', error)
      throw error
    }
  }

  // 카테고리별 템플릿 조회
  static async getTemplatesByCategory(category: string): Promise<CampaignTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('campaign_templates')
        .select('*')
        .eq('category', category)
        .eq('is_public', true)
        .order('usage_count', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching templates by category:', error)
      throw error
    }
  }

  // 템플릿 업데이트
  static async updateTemplate(templateId: string, updateData: UpdateCampaignTemplateRequest): Promise<CampaignTemplate> {
    try {
      const { data, error } = await supabase
        .from('campaign_templates')
        .update(updateData)
        .eq('id', templateId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating template:', error)
      throw error
    }
  }

  // 템플릿 삭제
  static async deleteTemplate(templateId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('campaign_templates')
        .delete()
        .eq('id', templateId)
        .eq('created_by', userId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting template:', error)
      throw error
    }
  }

  // 템플릿 사용 횟수 증가
  static async incrementUsageCount(templateId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('campaign_templates')
        .update({ usage_count: supabase.rpc('increment') })
        .eq('id', templateId)

      if (error) throw error
    } catch (error) {
      console.error('Error incrementing usage count:', error)
      throw error
    }
  }

  // 템플릿에서 캠페인 데이터 생성
  static generateCampaignFromTemplate(template: CampaignTemplate, customData: Record<string, any>): any {
    const { template_data } = template
    
    // 템플릿 변수 치환
    const replaceVariables = (text: string, data: Record<string, any>): string => {
      return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] || match
      })
    }

    return {
      title: replaceVariables(template_data.title_template, customData),
      title_en: template_data.title_template_en ? replaceVariables(template_data.title_template_en, customData) : undefined,
      title_ar: template_data.title_template_ar ? replaceVariables(template_data.title_template_ar, customData) : undefined,
      description: replaceVariables(template_data.description_template, customData),
      description_en: template_data.description_template_en ? replaceVariables(template_data.description_template_en, customData) : undefined,
      description_ar: template_data.description_template_ar ? replaceVariables(template_data.description_template_ar, customData) : undefined,
      category: template.category,
      budget_min: template_data.budget_min,
      budget_max: template_data.budget_max,
      target_languages: template_data.target_languages,
      target_regions: template_data.target_regions,
      min_followers: template_data.min_followers,
      content_requirements: replaceVariables(template_data.content_requirements_template, customData),
      content_requirements_en: template_data.content_requirements_template_en ? replaceVariables(template_data.content_requirements_template_en, customData) : undefined,
      content_requirements_ar: template_data.content_requirements_template_ar ? replaceVariables(template_data.content_requirements_template_ar, customData) : undefined,
      media_assets: template_data.media_requirements,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + template_data.duration_days * 24 * 60 * 60 * 1000).toISOString(),
      application_deadline: new Date(Date.now() + (template_data.duration_days - 7) * 24 * 60 * 60 * 1000).toISOString()
    }
  }

  // 인기 템플릿 조회
  static async getPopularTemplates(limit: number = 10): Promise<CampaignTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('campaign_templates')
        .select('*')
        .eq('is_public', true)
        .order('usage_count', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching popular templates:', error)
      throw error
    }
  }

  // 최근 템플릿 조회
  static async getRecentTemplates(limit: number = 10): Promise<CampaignTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('campaign_templates')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching recent templates:', error)
      throw error
    }
  }

  // 템플릿 검색
  static async searchTemplates(query: string, category?: string): Promise<CampaignTemplate[]> {
    try {
      let searchQuery = supabase
        .from('campaign_templates')
        .select('*')
        .eq('is_public', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

      if (category) {
        searchQuery = searchQuery.eq('category', category)
      }

      const { data, error } = await searchQuery.order('usage_count', { ascending: false })
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching templates:', error)
      throw error
    }
  }
}

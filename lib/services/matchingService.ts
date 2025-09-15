/**
 * ME-IN AI 매칭 서비스
 * 브랜드와 인플루언서 간의 최적 매칭을 위한 알고리즘
 */

export interface InfluencerProfile {
  id: string
  name: string
  expertise: string[]
  languages: string[]
  location: string
  socialAccounts: {
    platform: string
    followers: number
    avgViews: number
    engagementRate: number
  }[]
  stats: {
    totalCampaigns: number
    completedCampaigns: number
    avgRating: number
    completionRate: number
  }
  portfolio: {
    category: string
    performance: number
  }[]
}

export interface CampaignRequirements {
  id: string
  category: string
  targetLanguages: string[]
  targetRegions: string[]
  minFollowers: number
  budgetMin: number
  budgetMax: number
  contentRequirements: string
  preferredInfluencerTypes: string[]
}

export interface MatchingScore {
  influencerId: string
  totalScore: number
  breakdown: {
    contentSimilarity: number
    audienceOverlap: number
    performanceHistory: number
    locationFit: number
    budgetFit: number
    languageFit: number
  }
  reasons: string[]
}

export class MatchingService {
  /**
   * 캠페인에 대한 최적 인플루언서 매칭
   */
  static async findBestMatches(
    campaign: CampaignRequirements,
    influencers: InfluencerProfile[],
    limit: number = 10
  ): Promise<MatchingScore[]> {
    const scores: MatchingScore[] = []

    for (const influencer of influencers) {
      const score = this.calculateMatchScore(campaign, influencer)
      scores.push(score)
    }

    // 점수순으로 정렬하고 상위 N개 반환
    return scores
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit)
  }

  /**
   * 매칭 점수 계산 (0-100점)
   */
  static calculateMatchScore(
    campaign: CampaignRequirements,
    influencer: InfluencerProfile
  ): MatchingScore {
    const breakdown = {
      contentSimilarity: this.calculateContentSimilarity(campaign, influencer),
      audienceOverlap: this.calculateAudienceOverlap(campaign, influencer),
      performanceHistory: this.calculatePerformanceHistory(influencer),
      locationFit: this.calculateLocationFit(campaign, influencer),
      budgetFit: this.calculateBudgetFit(campaign, influencer),
      languageFit: this.calculateLanguageFit(campaign, influencer)
    }

    // 가중치 적용
    const totalScore = 
      breakdown.contentSimilarity * 0.30 +    // 30%
      breakdown.audienceOverlap * 0.25 +      // 25%
      breakdown.performanceHistory * 0.20 +   // 20%
      breakdown.locationFit * 0.10 +          // 10%
      breakdown.budgetFit * 0.10 +            // 10%
      breakdown.languageFit * 0.05            // 5%

    const reasons = this.generateMatchReasons(breakdown, campaign, influencer)

    return {
      influencerId: influencer.id,
      totalScore: Math.round(totalScore),
      breakdown,
      reasons
    }
  }

  /**
   * 콘텐츠 유사도 계산 (30% 가중치)
   */
  private static calculateContentSimilarity(
    campaign: CampaignRequirements,
    influencer: InfluencerProfile
  ): number {
    const campaignCategory = campaign.category.toLowerCase()
    const influencerExpertise = influencer.expertise.map(e => e.toLowerCase())
    
    // 정확한 매치
    if (influencerExpertise.includes(campaignCategory)) {
      return 100
    }

    // 관련 카테고리 매치
    const relatedCategories = this.getRelatedCategories(campaignCategory)
    const relatedMatches = influencerExpertise.filter(expertise => 
      relatedCategories.includes(expertise)
    )

    if (relatedMatches.length > 0) {
      return 80
    }

    // 포트폴리오 기반 매치
    const portfolioMatches = influencer.portfolio.filter(item => 
      item.category.toLowerCase() === campaignCategory
    )

    if (portfolioMatches.length > 0) {
      const avgPerformance = portfolioMatches.reduce((sum, item) => sum + item.performance, 0) / portfolioMatches.length
      return Math.min(70, avgPerformance)
    }

    return 20 // 기본 점수
  }

  /**
   * 오디언스 중복도 계산 (25% 가중치)
   */
  private static calculateAudienceOverlap(
    campaign: CampaignRequirements,
    influencer: InfluencerProfile
  ): number {
    const totalFollowers = influencer.socialAccounts.reduce((sum, account) => sum + account.followers, 0)
    
    // 팔로워 수 기준
    if (totalFollowers >= campaign.minFollowers) {
      // 최적 범위 내에 있는지 확인
      const optimalMin = campaign.minFollowers
      const optimalMax = campaign.minFollowers * 5
      
      if (totalFollowers >= optimalMin && totalFollowers <= optimalMax) {
        return 100
      } else if (totalFollowers > optimalMax) {
        // 너무 많은 팔로워는 감점
        const excessRatio = totalFollowers / optimalMax
        return Math.max(60, 100 - (excessRatio - 1) * 20)
      }
    }

    // 최소 팔로워 수 미달
    const ratio = totalFollowers / campaign.minFollowers
    return Math.max(0, ratio * 50)
  }

  /**
   * 성과 이력 계산 (20% 가중치)
   */
  private static calculatePerformanceHistory(influencer: InfluencerProfile): number {
    const { totalCampaigns, completedCampaigns, avgRating, completionRate } = influencer.stats

    // 완료율 점수 (40%)
    const completionScore = completionRate * 40

    // 평점 점수 (40%)
    const ratingScore = (avgRating / 5) * 40

    // 경험 점수 (20%)
    const experienceScore = Math.min(20, (totalCampaigns / 10) * 20)

    return completionScore + ratingScore + experienceScore
  }

  /**
   * 지역 적합성 계산 (10% 가중치)
   */
  private static calculateLocationFit(
    campaign: CampaignRequirements,
    influencer: InfluencerProfile
  ): number {
    const campaignRegions = campaign.targetRegions.map(r => r.toLowerCase())
    const influencerLocation = influencer.location.toLowerCase()

    // 정확한 지역 매치
    if (campaignRegions.some(region => influencerLocation.includes(region))) {
      return 100
    }

    // 인근 지역 매치
    const nearbyRegions = this.getNearbyRegions(campaignRegions)
    if (nearbyRegions.some(region => influencerLocation.includes(region))) {
      return 70
    }

    return 30 // 기본 점수
  }

  /**
   * 예산 적합성 계산 (10% 가중치)
   */
  private static calculateBudgetFit(
    campaign: CampaignRequirements,
    influencer: InfluencerProfile
  ): number {
    // 인플루언서의 예상 비용 계산 (팔로워 수 기반)
    const totalFollowers = influencer.socialAccounts.reduce((sum, account) => sum + account.followers, 0)
    const estimatedCost = this.estimateInfluencerCost(totalFollowers, influencer.stats.avgRating)

    // 예산 범위 내에 있는지 확인
    if (estimatedCost >= campaign.budgetMin && estimatedCost <= campaign.budgetMax) {
      return 100
    } else if (estimatedCost < campaign.budgetMin) {
      return 60 // 예산이 부족할 수 있음
    } else {
      // 예산 초과
      const excessRatio = estimatedCost / campaign.budgetMax
      return Math.max(20, 100 - (excessRatio - 1) * 40)
    }
  }

  /**
   * 언어 적합성 계산 (5% 가중치)
   */
  private static calculateLanguageFit(
    campaign: CampaignRequirements,
    influencer: InfluencerProfile
  ): number {
    const campaignLanguages = campaign.targetLanguages.map(l => l.toLowerCase())
    const influencerLanguages = influencer.languages.map(l => l.toLowerCase())

    const matches = campaignLanguages.filter(lang => 
      influencerLanguages.includes(lang)
    )

    if (matches.length === campaignLanguages.length) {
      return 100 // 모든 언어 지원
    } else if (matches.length > 0) {
      return (matches.length / campaignLanguages.length) * 80
    }

    return 0 // 언어 불일치
  }

  /**
   * 매칭 이유 생성
   */
  private static generateMatchReasons(
    breakdown: MatchingScore['breakdown'],
    campaign: CampaignRequirements,
    influencer: InfluencerProfile
  ): string[] {
    const reasons: string[] = []

    if (breakdown.contentSimilarity >= 80) {
      reasons.push('전문 분야가 캠페인과 완벽히 일치합니다')
    }

    if (breakdown.audienceOverlap >= 80) {
      reasons.push('타겟 오디언스와 높은 일치도를 보입니다')
    }

    if (breakdown.performanceHistory >= 80) {
      reasons.push('우수한 성과 이력을 가지고 있습니다')
    }

    if (breakdown.locationFit >= 80) {
      reasons.push('캠페인 타겟 지역에 위치하고 있습니다')
    }

    if (breakdown.languageFit >= 80) {
      reasons.push('필요한 모든 언어를 지원합니다')
    }

    if (reasons.length === 0) {
      reasons.push('전반적으로 적합한 프로필을 가지고 있습니다')
    }

    return reasons
  }

  /**
   * 관련 카테고리 매핑
   */
  private static getRelatedCategories(category: string): string[] {
    const categoryMap: { [key: string]: string[] } = {
      'beauty': ['fashion', 'lifestyle', 'skincare', 'makeup'],
      'fashion': ['beauty', 'lifestyle', 'style'],
      'food': ['lifestyle', 'cooking', 'restaurant'],
      'travel': ['lifestyle', 'adventure', 'culture'],
      'technology': ['gadgets', 'reviews', 'lifestyle'],
      'fitness': ['health', 'lifestyle', 'wellness'],
      'lifestyle': ['beauty', 'fashion', 'food', 'travel']
    }

    return categoryMap[category] || []
  }

  /**
   * 인근 지역 매핑
   */
  private static getNearbyRegions(regions: string[]): string[] {
    const regionMap: { [key: string]: string[] } = {
      'uae': ['dubai', 'abu dhabi', 'sharjah'],
      'saudi arabia': ['riyadh', 'jeddah', 'dammam'],
      'kuwait': ['kuwait city'],
      'qatar': ['doha'],
      'bahrain': ['manama'],
      'oman': ['muscat'],
      'jordan': ['amman'],
      'lebanon': ['beirut'],
      'egypt': ['cairo', 'alexandria']
    }

    const nearby: string[] = []
    regions.forEach(region => {
      const related = regionMap[region] || []
      nearby.push(...related)
    })

    return nearby
  }

  /**
   * 인플루언서 비용 추정
   */
  private static estimateInfluencerCost(followers: number, rating: number): number {
    // 팔로워 수 기반 기본 비용 (USD)
    let baseCost = 0
    
    if (followers < 10000) {
      baseCost = 100
    } else if (followers < 50000) {
      baseCost = 500
    } else if (followers < 100000) {
      baseCost = 1000
    } else if (followers < 500000) {
      baseCost = 2500
    } else if (followers < 1000000) {
      baseCost = 5000
    } else {
      baseCost = 10000
    }

    // 평점에 따른 가격 조정
    const ratingMultiplier = 0.5 + (rating / 5) * 1.0
    return Math.round(baseCost * ratingMultiplier)
  }

  /**
   * 인플루언서 추천 (개인화)
   */
  static async getPersonalizedRecommendations(
    userId: string,
    limit: number = 5
  ): Promise<MatchingScore[]> {
    // TODO: 사용자 행동 패턴 분석
    // - 과거 협업 이력
    // - 선호 카테고리
    // - 성과 패턴
    
    // 현재는 랜덤 추천으로 대체
    return []
  }

  /**
   * 실시간 매칭 업데이트
   */
  static async updateMatchingScores(campaignId: string): Promise<void> {
    // TODO: 캠페인 정보 변경 시 실시간으로 매칭 점수 업데이트
    console.log(`Updating matching scores for campaign: ${campaignId}`)
  }
}

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase 설정
const supabaseUrl = 'https://jltnvoyjnzlswsmddojf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsdG52b3lqbnpsc3dzbWRkb2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzODk5MjQsImV4cCI6MjA3MDk2NTkyNH0.5blt8JeShSgBA50l5bcE30Um1nGlYJAl685XBdVrqdg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadImageToStorage(bucketName, filePath, fileName) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: getContentType(filePath),
        upsert: true
      });

    if (error) {
      console.log(`❌ ${fileName} 업로드 실패:`, error.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    console.log(`✅ ${fileName} 업로드 완료:`, urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.log(`❌ ${fileName} 업로드 중 오류:`, error.message);
    return null;
  }
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  };
  return contentTypes[ext] || 'image/jpeg';
}

async function uploadAllImages() {
  console.log('🚀 ME-IN 플랫폼 이미지 업로드를 시작합니다...\n');

  const imagesDir = path.join(__dirname, 'public', 'images');
  const images = [
    { name: 'logo.png', bucket: 'logo-images', category: 'logo' },
    { name: 'logo.svg', bucket: 'logo-images', category: 'logo' },
    { name: 'dubai-travel.jpg', bucket: 'campaign-images', category: 'campaign' },
    { name: 'korean-food.jpg', bucket: 'campaign-images', category: 'campaign' },
    { name: 'kpop-concert.jpg', bucket: 'campaign-images', category: 'campaign' },
    { name: 'carery-toner.jpg', bucket: 'campaign-images', category: 'campaign' },
    { name: 'dubai-travel.svg', bucket: 'campaign-images', category: 'campaign' },
    { name: 'korean-food.svg', bucket: 'campaign-images', category: 'campaign' },
    { name: 'kpop-concert.svg', bucket: 'campaign-images', category: 'campaign' },
    { name: 'carery-toner.svg', bucket: 'campaign-images', category: 'campaign' },
    { name: 'carery-toner-real.svg', bucket: 'campaign-images', category: 'campaign' }
  ];

  const uploadedImages = [];

  for (const image of images) {
    const filePath = path.join(imagesDir, image.name);
    
    if (fs.existsSync(filePath)) {
      console.log(`📤 ${image.name} 업로드 중...`);
      const url = await uploadImageToStorage(image.bucket, filePath, image.name);
      
      if (url) {
        uploadedImages.push({
          name: image.name,
          url: url,
          bucket: image.bucket,
          category: image.category
        });
      }
    } else {
      console.log(`⚠️  파일을 찾을 수 없음: ${image.name}`);
    }
  }

  return uploadedImages;
}

async function createSampleCampaigns() {
  console.log('\n🎯 샘플 캠페인 데이터 생성 중...');

  const sampleCampaigns = [
    {
      title: '두바이 여행 콘텐츠 캠페인',
      title_kr: '두바이 여행 콘텐츠 캠페인',
      description: '두바이의 아름다운 관광지를 소개하는 여행 콘텐츠를 제작해주세요.',
      description_kr: '두바이의 아름다운 관광지를 소개하는 여행 콘텐츠를 제작해주세요.',
      category: 'travel',
      budget_min: 1000,
      budget_max: 5000,
      currency: 'USD',
      target_regions: ['UAE', 'Saudi Arabia', 'Kuwait'],
      target_languages: ['Arabic', 'English'],
      requirements: {
        content_type: 'video',
        min_followers: 10000,
        platforms: ['Instagram', 'TikTok']
      },
      media_assets: [
        'https://jltnvoyjnzlswsmddojf.supabase.co/storage/v1/object/public/campaign-images/dubai-travel.jpg'
      ],
      status: 'active'
    },
    {
      title: '한국 음식 소개 캠페인',
      title_kr: '한국 음식 소개 캠페인',
      description: '한국의 전통 음식과 현대적인 한식을 소개하는 콘텐츠를 제작해주세요.',
      description_kr: '한국의 전통 음식과 현대적인 한식을 소개하는 콘텐츠를 제작해주세요.',
      category: 'food',
      budget_min: 800,
      budget_max: 3000,
      currency: 'USD',
      target_regions: ['UAE', 'Qatar', 'Bahrain'],
      target_languages: ['Arabic', 'English'],
      requirements: {
        content_type: 'photo',
        min_followers: 5000,
        platforms: ['Instagram', 'YouTube']
      },
      media_assets: [
        'https://jltnvoyjnzlswsmddojf.supabase.co/storage/v1/object/public/campaign-images/korean-food.jpg'
      ],
      status: 'active'
    },
    {
      title: 'K-POP 콘서트 홍보 캠페인',
      title_kr: 'K-POP 콘서트 홍보 캠페인',
      description: '중동 지역 K-POP 콘서트를 홍보하는 에너지 넘치는 콘텐츠를 제작해주세요.',
      description_kr: '중동 지역 K-POP 콘서트를 홍보하는 에너지 넘치는 콘텐츠를 제작해주세요.',
      category: 'entertainment',
      budget_min: 1500,
      budget_max: 6000,
      currency: 'USD',
      target_regions: ['UAE', 'Saudi Arabia', 'Kuwait', 'Qatar'],
      target_languages: ['Arabic', 'English', 'Korean'],
      requirements: {
        content_type: 'video',
        min_followers: 20000,
        platforms: ['Instagram', 'TikTok', 'YouTube']
      },
      media_assets: [
        'https://jltnvoyjnzlswsmddojf.supabase.co/storage/v1/object/public/campaign-images/kpop-concert.jpg'
      ],
      status: 'active'
    },
    {
      title: 'Carery 토너 제품 리뷰 캠페인',
      title_kr: 'Carery 토너 제품 리뷰 캠페인',
      description: 'Carery 토너의 효과와 사용법을 소개하는 뷰티 콘텐츠를 제작해주세요.',
      description_kr: 'Carery 토너의 효과와 사용법을 소개하는 뷰티 콘텐츠를 제작해주세요.',
      category: 'beauty',
      budget_min: 600,
      budget_max: 2500,
      currency: 'USD',
      target_regions: ['UAE', 'Saudi Arabia', 'Kuwait'],
      target_languages: ['Arabic', 'English'],
      requirements: {
        content_type: 'photo',
        min_followers: 8000,
        platforms: ['Instagram', 'TikTok']
      },
      media_assets: [
        'https://jltnvoyjnzlswsmddojf.supabase.co/storage/v1/object/public/campaign-images/carery-toner.jpg'
      ],
      status: 'active'
    }
  ];

  // 실제 사용자 ID가 필요하므로 임시로 샘플 데이터만 생성
  console.log('📝 샘플 캠페인 데이터 준비 완료');
  console.log('총 4개의 샘플 캠페인이 준비되었습니다:');
  
  sampleCampaigns.forEach((campaign, index) => {
    console.log(`${index + 1}. ${campaign.title}`);
    console.log(`   예산: $${campaign.budget_min} - $${campaign.budget_max}`);
    console.log(`   카테고리: ${campaign.category}`);
    console.log(`   상태: ${campaign.status}\n`);
  });

  return sampleCampaigns;
}

async function updateHomepageWithImages() {
  console.log('\n🏠 홈페이지 이미지 업데이트 중...');
  
  // 홈페이지 컴포넌트에 이미지 URL 업데이트
  const homepageComponent = `
// CampaignHomePage.tsx에 추가할 이미지 URL들
export const campaignImages = {
  dubai: 'https://jltnvoyjnzlswsmddojf.supabase.co/storage/v1/object/public/campaign-images/dubai-travel.jpg',
  koreanFood: 'https://jltnvoyjnzlswsmddojf.supabase.co/storage/v1/object/public/campaign-images/korean-food.jpg',
  kpop: 'https://jltnvoyjnzlswsmddojf.supabase.co/storage/v1/object/public/campaign-images/kpop-concert.jpg',
  carery: 'https://jltnvoyjnzlswsmddojf.supabase.co/storage/v1/object/public/campaign-images/carery-toner.jpg'
};

export const logoUrl = 'https://jltnvoyjnzlswsmddojf.supabase.co/storage/v1/object/public/logo-images/logo.png';
`;

  console.log('✅ 홈페이지 이미지 URL 준비 완료');
  return homepageComponent;
}

async function main() {
  try {
    // 1. 이미지 업로드
    const uploadedImages = await uploadAllImages();
    
    // 2. 샘플 캠페인 데이터 생성
    const sampleCampaigns = await createSampleCampaigns();
    
    // 3. 홈페이지 이미지 업데이트
    const homepageImages = await updateHomepageWithImages();
    
    console.log('\n🎉 ME-IN 플랫폼 이미지 설정이 완료되었습니다!');
    console.log('\n📊 업로드 결과:');
    console.log(`- 총 ${uploadedImages.length}개 이미지 업로드 완료`);
    console.log(`- ${sampleCampaigns.length}개 샘플 캠페인 준비 완료`);
    
    console.log('\n📝 다음 단계:');
    console.log('1. 온라인 배포 링크에서 이미지가 제대로 표시되는지 확인');
    console.log('2. 홈페이지에서 캠페인 이미지들이 올바르게 로드되는지 확인');
    console.log('3. 로고 이미지가 헤더에 제대로 표시되는지 확인');
    
    console.log('\n🌐 온라인 배포 링크:');
    console.log('https://me-ahq0og76c-josephstores-projects.vercel.app');

  } catch (error) {
    console.error('❌ 이미지 업로드 중 오류 발생:', error.message);
  }
}

// 스크립트 실행
main();

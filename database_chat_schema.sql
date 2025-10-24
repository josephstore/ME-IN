-- 채팅 시스템을 위한 데이터베이스 스키마

-- 채팅방 테이블
CREATE TABLE IF NOT EXISTS chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    brand_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    influencer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(campaign_id, influencer_id)
);

-- 채팅 메시지 테이블
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('brand', 'influencer')),
    content TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
    attachments TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    is_read BOOLEAN DEFAULT FALSE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_chat_rooms_brand_id ON chat_rooms(brand_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_influencer_id ON chat_rooms(influencer_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_campaign_id ON chat_rooms(campaign_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- RLS (Row Level Security) 정책
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 채팅방 접근 권한 정책
CREATE POLICY "Users can view their own chat rooms" ON chat_rooms
    FOR SELECT USING (
        brand_id = auth.uid() OR influencer_id = auth.uid()
    );

CREATE POLICY "Users can create chat rooms" ON chat_rooms
    FOR INSERT WITH CHECK (
        brand_id = auth.uid() OR influencer_id = auth.uid()
    );

-- 메시지 접근 권한 정책
CREATE POLICY "Users can view messages in their chat rooms" ON chat_messages
    FOR SELECT USING (
        room_id IN (
            SELECT id FROM chat_rooms 
            WHERE brand_id = auth.uid() OR influencer_id = auth.uid()
        )
    );

CREATE POLICY "Users can send messages" ON chat_messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        room_id IN (
            SELECT id FROM chat_rooms 
            WHERE brand_id = auth.uid() OR influencer_id = auth.uid()
        )
    );

-- 실시간 구독을 위한 함수
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify(
        'new_message',
        json_build_object(
            'id', NEW.id,
            'room_id', NEW.room_id,
            'sender_id', NEW.sender_id,
            'content', NEW.content,
            'created_at', NEW.created_at
        )::text
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER on_new_message
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_message();

-- 샘플 데이터 삽입
INSERT INTO chat_rooms (campaign_id, brand_id, influencer_id) VALUES
    ('camp_001', 'brand_user_001', 'influencer_user_001'),
    ('camp_002', 'brand_user_002', 'influencer_user_002'),
    ('camp_003', 'brand_user_003', 'influencer_user_003')
ON CONFLICT (campaign_id, influencer_id) DO NOTHING;

-- 샘플 메시지 삽입
INSERT INTO chat_messages (room_id, sender_id, sender_name, sender_type, content, message_type) VALUES
    (
        (SELECT id FROM chat_rooms WHERE campaign_id = 'camp_001' LIMIT 1),
        'brand_user_001',
        'Glow Beauty',
        'brand',
        '안녕하세요! 캠페인에 관심을 가져주셔서 감사합니다.',
        'text'
    ),
    (
        (SELECT id FROM chat_rooms WHERE campaign_id = 'camp_001' LIMIT 1),
        'influencer_user_001',
        'Sarah Kim',
        'influencer',
        '안녕하세요! 제품에 대해 더 자세히 알고 싶습니다.',
        'text'
    ),
    (
        (SELECT id FROM chat_rooms WHERE campaign_id = 'camp_002' LIMIT 1),
        'brand_user_002',
        'StyleHub',
        'brand',
        '패션 캠페인에 참여해주셔서 감사합니다!',
        'text'
    ),
    (
        (SELECT id FROM chat_rooms WHERE campaign_id = 'camp_002' LIMIT 1),
        'influencer_user_002',
        'Ahmed Al-Rashid',
        'influencer',
        '좋은 기회를 주셔서 감사합니다. 어떤 스타일링을 원하시나요?',
        'text'
    );



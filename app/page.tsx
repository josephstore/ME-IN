export default function Home() {
  return (
    <html>
      <head>
        <title>ME-IN Platform</title>
      </head>
      <body>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f0f9ff',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1 style={{ 
              fontSize: '3rem', 
              color: '#1e40af', 
              marginBottom: '1rem' 
            }}>
              ✅ ME-IN Platform
            </h1>
            <h2 style={{ 
              fontSize: '1.5rem', 
              color: '#64748b', 
              marginBottom: '2rem' 
            }}>
              배포 성공!
            </h2>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#475569',
              marginBottom: '1rem'
            }}>
              MiddleEast Influencer Network
            </p>
            <p style={{ 
              fontSize: '1rem', 
              color: '#10b981',
              fontWeight: 'bold'
            }}>
              🎉 서버가 정상적으로 작동하고 있습니다!
            </p>
            <div style={{ marginTop: '2rem' }}>
              <a 
                href="/auth/login" 
                style={{
                  display: 'inline-block',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontSize: '1rem'
                }}
              >
                로그인 페이지 →
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
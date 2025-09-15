import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class ServerHealthChecker {
  private static instance: ServerHealthChecker;
  private isConnected: boolean = false;
  private checkInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): ServerHealthChecker {
    if (!ServerHealthChecker.instance) {
      ServerHealthChecker.instance = new ServerHealthChecker();
    }
    return ServerHealthChecker.instance;
  }

  public async checkServerStatus(port: number = 3000): Promise<boolean> {
    try {
      const { stdout } = await execAsync(`netstat -an | findstr :${port}`);
      this.isConnected = stdout.includes(`LISTENING`);
      return this.isConnected;
    } catch (error) {
      this.isConnected = false;
      return false;
    }
  }

  public async ensureServerRunning(port: number = 3000): Promise<boolean> {
    const isRunning = await this.checkServerStatus(port);
    
    if (!isRunning) {
      console.log(`🚨 서버가 포트 ${port}에서 실행되지 않음. 서버를 시작합니다...`);
      try {
        await this.startServer(port);
        return true;
      } catch (error) {
        console.error('❌ 서버 시작 실패:', error);
        return false;
      }
    }
    
    return true;
  }

  private async startServer(port: number): Promise<void> {
    try {
      const { stdout, stderr } = await execAsync(`serve out -p ${port}`);
      if (stderr) {
        console.error('서버 시작 중 오류:', stderr);
      }
      console.log('✅ 서버가 성공적으로 시작되었습니다.');
    } catch (error) {
      throw new Error(`서버 시작 실패: ${error}`);
    }
  }

  public startHealthCheck(port: number = 3000, intervalMs: number = 30000): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(async () => {
      const status = await this.checkServerStatus(port);
      if (!status) {
        console.log('⚠️ 서버 연결이 끊어짐. 자동 재연결 시도...');
        await this.ensureServerRunning(port);
      }
    }, intervalMs);
  }

  public stopHealthCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// 서버 상태 점검 함수 (매번 호출)
export async function checkServerHealth(port: number = 3000): Promise<boolean> {
  const checker = ServerHealthChecker.getInstance();
  const isHealthy = await checker.ensureServerRunning(port);
  
  if (isHealthy) {
    console.log(`✅ 서버 상태: 정상 (포트 ${port})`);
  } else {
    console.log(`❌ 서버 상태: 비정상 (포트 ${port})`);
  }
  
  return isHealthy;
}

// 서버 상태 보고 함수
export function reportServerStatus(port: number = 3000): void {
  const checker = ServerHealthChecker.getInstance();
  const status = checker.getConnectionStatus();
  
  if (status) {
    console.log(`🟢 서버 연결 상태: 정상 (포트 ${port})`);
    console.log(`🌐 접속 URL: http://localhost:${port}`);
  } else {
    console.log(`🔴 서버 연결 상태: 끊어짐 (포트 ${port})`);
  }
}

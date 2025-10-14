import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // 代理豆包Chat API
      '/api/chat': {
        target: 'https://ark.cn-beijing.volces.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/chat/, '/api/v3/chat/completions'),
        configure: (proxy: any, _options: any) => {
          proxy.on('proxyReq', (proxyReq: any, req: any, _res: any) => {
            // 从请求头中获取API Key，如果没有则使用环境变量
            const apiKey = (req.headers['x-api-key'] as string) || process.env.VITE_DOUBAO_API_KEY ;
            proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
            proxyReq.setHeader('Content-Type', 'application/json');
            
            // 记录代理请求日志
            // console.log('[Proxy] Chat API Request:', req.url);
          });
          proxy.on('proxyRes', (_proxyRes: any, _req: any, _res: any) => {
            // console.log('[Proxy] Chat API Response:', proxyRes.statusCode);
          });
        }
      },
      // 代理豆包图片生成API（直接调用，用户提供API key）
      '/api/images': {
        target: 'https://ark.cn-beijing.volces.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/images/, '/api/v3/images/generations'),
        configure: (proxy: any, _options: any) => {
          proxy.on('proxyReq', (proxyReq: any, req: any, _res: any) => {
            // 从请求头中获取API Key，如果没有则使用环境变量
            const apiKey = (req.headers['x-api-key'] as string) || process.env.VITE_DOUBAO_API_KEY ;
            proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
            proxyReq.setHeader('Content-Type', 'application/json');
            
            console.log('🖼️ [Proxy] Images API Request:', req.url);
            console.log('🔑 [Proxy] Using API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'None');
          });
          proxy.on('proxyRes', (proxyRes: any, _req: any, _res: any) => {
            console.log('📡 [Proxy] Images API Response:', proxyRes.statusCode);
          });
          proxy.on('error', (err: any, _req: any, _res: any) => {
            console.error('❌ [Proxy] Images API Error:', err);
          });
        }
      },
      // 代理豆包TOS图片服务器（解决下载CORS问题）
      '/proxy/tos': {
        target: 'https://ark-content-generation-v2-cn-beijing.tos-cn-beijing.volces.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/proxy\/tos/, ''),
        configure: (proxy: any, _options: any) => {
          proxy.on('proxyReq', (proxyReq: any, _req: any, _res: any) => {
            // 移除可能导致问题的请求头
            proxyReq.removeHeader('referer');
            proxyReq.removeHeader('origin');
            
            // 记录代理请求日志
            // console.log('[Proxy] TOS Image Request:', req.url);
          });
          proxy.on('proxyRes', (_proxyRes: any, _req: any, _res: any) => {
            // console.log('[Proxy] TOS Image Response:', proxyRes.statusCode);
          });
          proxy.on('error', (_err: any, _req: any, _res: any) => {
            // console.error('[Proxy] TOS Error:', err);
          });
        }
      },
      // 代理支付API到本地服务器（临时解决方案）
      '/api/payment': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy: any, _options: any) => {
          proxy.on('proxyReq', (_proxyReq: any, req: any, _res: any) => {
            console.log('[Proxy] Payment API Request:', req.url);
          });
          proxy.on('error', (err: any, _req: any, _res: any) => {
            console.error('[Proxy] Payment API Error:', err);
          });
        }
      },
      // 代理测试API
      '/api/test-payment': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})

/**
 * Jest 测试设置文件
 */

// 扩展 Jest 匹配器
import 'jest';

// 全局测试配置
beforeAll(() => {
  // 测试开始前的全局设置
});

afterAll(() => {
  // 测试结束后的清理工作
});

// 为每个测试设置超时时间
jest.setTimeout(30000);

// 全局错误处理
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

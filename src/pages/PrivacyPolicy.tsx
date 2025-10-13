import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 bg-white">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">隐私政策</h1>
        
        <p className="text-gray-600 mb-8">
          最后更新：{new Date().toLocaleDateString('zh-CN')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. 简介</h2>
          <p className="text-gray-700">
            欢迎使用"文字转RedNote"。我们重视您的隐私。本隐私政策说明我们在您使用我们的AI文本转图片服务时如何收集、使用和保护您的信息。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 服务说明</h2>
          <p className="text-gray-700">
            "文字转RedNote"是一款AI驱动的文本转图片服务，基于豆包AI模型。我们为用户提供智能文本拆分和图片生成功能，采用积分付费模式。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. 我们收集的信息</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">账户信息</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>用户名（转换为格式化邮箱：username@local.app）</li>
              <li>积分余额和交易记录</li>
              <li>账户创建时间和最后登录时间</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">使用数据</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>输入的文本内容（仅在处理期间临时存储）</li>
              <li>生成的图片（临时缓存供下载）</li>
              <li>服务使用频率和功能偏好</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">技术信息</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>设备类型和浏览器信息</li>
              <li>IP地址和访问时间</li>
              <li>错误日志和性能数据</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. 我们不收集的信息</h2>
          <p className="text-gray-700 mb-4">
            我们承诺最小化数据收集原则，我们不会：
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>收集您的真实姓名、电话号码或家庭地址</li>
            <li>永久存储您的原始文本内容</li>
            <li>长期保存生成的图片</li>
            <li>跟踪您在其他网站的行为</li>
            <li>出售您的个人信息给第三方</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. 信息使用方式</h2>
          <p className="text-gray-700 mb-4">
            我们仅将收集的信息用于：
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>提供AI文本拆分和图片生成服务</li>
            <li>管理您的账户和积分系统</li>
            <li>处理付款和退款</li>
            <li>改进服务质量和性能</li>
            <li>提供客户支持</li>
            <li>维护服务安全和防止滥用</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. 第三方服务</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">支付处理</h3>
              <p className="text-gray-700">
                我们使用 <strong>Creem</strong> 处理所有付款。Creem 符合 PCI DSS 标准。我们不存储您的支付卡信息。
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">AI 服务</h3>
              <p className="text-gray-700">
                我们使用 <strong>豆包 AI</strong> 处理文本分析和图片生成。您的文本会临时发送给豆包进行处理，但不会被永久存储。
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">身份验证</h3>
              <p className="text-gray-700">
                我们使用 <strong>Supabase</strong> 进行用户身份验证和数据存储。Supabase 符合 SOC 2 Type II 安全标准。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. 数据保留</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">临时数据</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>文本内容</strong>：处理完成后立即删除</li>
                <li><strong>生成图片</strong>：24小时后自动删除</li>
                <li><strong>错误日志</strong>：30天后删除</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">账户数据</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>活跃账户</strong>：账户存续期间保留</li>
                <li><strong>已删除账户</strong>：30天内彻底删除</li>
                <li><strong>支付记录</strong>：保留7年（法律要求）</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. 安全措施</h2>
          <p className="text-gray-700 mb-4">
            我们实施适当的技术措施保护您的信息：
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>HTTPS 加密传输所有数据</li>
            <li>安全的用户身份验证机制</li>
            <li>定期安全审查和更新</li>
            <li>限制员工访问个人数据</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. 您的权利</h2>
          <p className="text-gray-700 mb-4">
            您享有以下权利：
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>访问权</strong>：查看我们持有的关于您的数据</li>
            <li><strong>更正权</strong>：更新不准确的个人信息</li>
            <li><strong>删除权</strong>：要求删除您的账户和数据</li>
            <li><strong>数据导出</strong>：获取您的数据副本</li>
          </ul>
          <p className="text-gray-700 mt-4">
            如需行使这些权利，请联系：<a href="mailto:chenrong871@gmail.com" className="text-blue-600 hover:text-blue-800">chenrong871@gmail.com</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. 儿童隐私</h2>
          <p className="text-gray-700">
            我们的服务不面向13岁以下儿童。我们不会故意收集13岁以下儿童的个人信息。如果发现此类情况，我们将立即删除相关信息。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. 政策变更</h2>
          <p className="text-gray-700">
            我们可能会不时更新本隐私政策。任何重要变更将通过网站通知或邮件通知您。继续使用服务即表示您接受更新后的政策。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. 联系我们</h2>
          <p className="text-gray-700 mb-4">
            如果您对本隐私政策有任何疑问，请联系我们：
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>电子邮箱：</strong>
              <a href="mailto:chenrong871@gmail.com" className="text-blue-600 hover:text-blue-800 ml-2">chenrong871@gmail.com</a>
            </p>
            <p className="text-gray-700 mt-2">
              <strong>服务名称：</strong> 文字转RedNote
            </p>
            <p className="text-gray-700 mt-2">
              <strong>响应时间：</strong> 我们将在7个工作日内回复
            </p>
          </div>
        </section>

        <div className="border-t pt-8 mt-12">
          <p className="text-sm text-gray-500">
            本隐私政策自发布之日起生效。最后更新时间：{new Date().toLocaleDateString('zh-CN')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
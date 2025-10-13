import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 bg-white">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">服务条款</h1>
        
        <p className="text-gray-600 mb-8">
          最后更新：{new Date().toLocaleDateString('zh-CN')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. 简介</h2>
          <p className="text-gray-700">
            欢迎使用"文字转RedNote"。通过访问或使用我们在 text-to-xiaohongshu.com 的AI文本转图片服务（"服务"），您同意受本服务条款（"条款"）约束。使用服务前请仔细阅读这些条款。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 服务说明</h2>
          <p className="text-gray-700 mb-4">
            "文字转RedNote"是一款基于豆包AI模型的智能文本转图片服务。我们为用户提供：
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>智能文本拆分和语义分析</li>
            <li>基于AI的高质量图片生成</li>
            <li>多样化模板和自定义选项</li>
            <li>积分制付费模式</li>
            <li>批量生成和下载功能</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. 用户义务</h2>
          <p className="text-gray-700 mb-4">
            使用我们的服务时，您同意：
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>遵守所有适用的法律法规</li>
            <li>不尝试绕过任何限制或安全措施</li>
            <li>不将服务用于任何非法或未经授权的目的</li>
            <li>不干扰或中断服务或服务器</li>
            <li>不生成侵犯知识产权或包含有害内容的材料</li>
            <li>提供准确的账户信息并保护账户安全</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. 知识产权</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">生成的图片</h3>
              <p className="text-gray-700">
                通过我们服务生成的图片归您所有，您可以将其用于任何目的，包括商业用途。但是，请确保您的使用不侵犯任何第三方权利。
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">服务内容</h3>
              <p className="text-gray-700">
                服务本身、软件、界面设计、模板和其他材料受知识产权法保护，归我们或我们的许可方所有。
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">用户内容</h3>
              <p className="text-gray-700">
                您对输入的文本内容保留所有权利。通过使用服务，您授予我们处理您内容以提供服务的必要权利。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. 积分和付费</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">积分系统</h3>
              <p className="text-gray-700 mb-3">
                我们的服务采用积分制。图片生成需要消耗积分，文本拆分功能免费使用。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Credit Packages:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Free Trial: Free = 100 credits</li>
                  <li>• Standard: $5 = 550 credits (500 + 50 bonus)</li>
                  <li>• Unlimited: $15 = Unlimited credits</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">支付处理</h3>
              <p className="text-gray-700">
                所有付款通过我们的支付合作伙伴 <strong>Creem</strong> 处理。我们不存储您的支付信息。积分购买后立即到账。
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">积分使用</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>每张图片生成消耗20积分</li>
                <li>积分永久有效，不会过期</li>
                <li>积分不可退款，不可转让</li>
                <li>生成失败不会扣除积分</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. 退款政策</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">30天退款保证</h3>
              <p className="text-gray-700">
                首次购买用户如对服务不满意，可在购买后30天内申请全额退款。
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">其他退款情况</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>技术故障导致服务不可用：提供等价积分补偿</li>
                <li>错误购买：24小时内联系我们可考虑退款</li>
                <li>服务中断超过24小时：提供积分补偿</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">退款流程</h3>
              <p className="text-gray-700">
                退款申请请发送至 <a href="mailto:chenrong871@gmail.com" className="text-blue-600 hover:text-blue-800">chenrong871@gmail.com</a>，我们将在7个工作日内处理。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. 内容准则</h2>
          <p className="text-gray-700 mb-4">
            您同意不生成：
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>违反任何适用法律法规的内容</li>
            <li>仇恨、歧视或攻击性内容</li>
            <li>侵犯知识产权的内容</li>
            <li>色情或成人内容</li>
            <li>旨在骚扰、辱骂或伤害他人的内容</li>
            <li>虚假或误导性信息</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. 服务可用性</h2>
          <p className="text-gray-700 mb-4">
            虽然我们努力保持服务持续可用，但我们不保证服务不间断访问。我们保留随时修改、暂停或停止服务任何方面的权利。
          </p>
          <p className="text-gray-700">
            服务可能因以下原因暂时不可用：定期维护、第三方API限制、网络故障或不可抗力因素。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. 免责声明</h2>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">服务现状</h3>
            <p className="text-gray-700">
              服务按"现状"提供，不提供任何明示或暗示的保证。我们不保证服务将满足您的要求、不间断、及时、安全或无错误。
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">AI生成内容</h3>
              <p className="text-gray-700">
                AI生成的内容可能不准确、不完整或不合适。您使用生成内容的风险完全由自己承担。请在使用前验证内容的准确性和适用性。
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">第三方服务</h3>
              <p className="text-gray-700">
                我们不对豆包AI、Creem支付或其他第三方服务的可用性、准确性或功能承担责任。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. 责任限制</h2>
          
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-gray-700">
              <strong>重要</strong>：我们对因使用服务产生的任何间接、偶然、特殊或后果性损害不承担责任，包括但不限于利润损失、数据丢失或业务中断。我们的总责任不超过您在过去12个月内支付给我们的金额。
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. 账户终止</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">用户终止</h3>
              <p className="text-gray-700">
                您可以随时停止使用服务并删除账户。剩余积分将在账户删除时失效。
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">服务终止</h3>
              <p className="text-gray-700 mb-3">
                我们保留在以下情况下暂停或终止您账户的权利：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>违反本服务条款</li>
                <li>进行欺诈或非法活动</li>
                <li>滥用服务或影响其他用户</li>
                <li>账户长期不活跃（超过2年）</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. 条款变更</h2>
          <p className="text-gray-700">
            我们保留随时修改这些条款的权利。继续使用服务即表示接受新条款。重要变更将通过网站通知或电子邮件通知用户。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. 联系我们</h2>
          <p className="text-gray-700 mb-4">
            如果您对这些条款有任何疑问，请联系我们：
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>客户支持：</strong>
              <a href="mailto:chenrong871@gmail.com" className="text-blue-600 hover:text-blue-800 ml-2">chenrong871@gmail.com</a>
            </p>
            <p className="text-gray-700 mt-2">
              <strong>服务名称：</strong> 文字转RedNote
            </p>
            <p className="text-gray-700 mt-2">
              <strong>响应时间：</strong> 7个工作日内回复
            </p>
          </div>
        </section>

        <div className="border-t pt-8 mt-12">
          <p className="text-sm text-gray-500">
            本服务条款自发布之日起生效。最后更新时间：{new Date().toLocaleDateString('zh-CN')}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            感谢您选择"文字转RedNote"服务！
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
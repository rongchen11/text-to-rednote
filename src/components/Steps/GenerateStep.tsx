import React, { useEffect, useState } from 'react';
import { 
  Button, 
  Card, 
  Space, 
  Typography, 
  Radio, 
  Checkbox,
  Progress,
  Row,
  Col,
  message,
  Empty,
  Alert,
  Tag,
  Modal
} from 'antd';
import { 
  PictureOutlined, 
  PlusOutlined,
  LoadingOutlined,
  KeyOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { useAppStore } from '../../stores/useAppStore';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { useStepStore } from '../../stores/useStepStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { StepContainer } from '../Navigation/StepContainer';
import { doubaoAPI } from '../../services/apiClient';
import { PromptBuilder } from '../../services/promptBuilder';
import { storage } from '../../utils/storage';
import type { GeneratedImage } from '../../types';

const { Title, Text } = Typography;

export const GenerateStep: React.FC = () => {
  const {
    splitResults,
    selectedTemplateId,
    setSelectedTemplateId,
    generatedImages,
    setGeneratedImages,
    isGenerating,
    setIsGenerating,
    updateImageStatus,
    updateImageUrl,
    imageSize,
    watermarkEnabled,
  } = useAppStore();
  
  // 添加选择状态，默认选择前5个
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  const {
    templates,
    getTemplateById,
    setTemplateModalOpen,
  } = useTemplateStore();
  
  const { setCanProceed, nextStep } = useStepStore();
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // Credits and auth status
  const { isAuthenticated, user, deductCredits } = useAuthStore();
  
  // Initialize selection state, default to first 5 items
  useEffect(() => {
    if (splitResults.length > 0) {
      // Default select first 5 items, or all available (if less than 5)
      const defaultSelection = splitResults
        .slice(0, Math.min(5, splitResults.length))
        .map((_, index) => index);
      setSelectedItems(defaultSelection);
    }
  }, [splitResults]);
  
  // Validate if can proceed to next step
  useEffect(() => {
    setCanProceed(generatedImages.length > 0 && !isGenerating);
  }, [generatedImages, isGenerating, setCanProceed]);
  
  const handleGenerateImages = async () => {
    console.log('🎯 Generate button clicked - handleGenerateImages called');
    
    console.log('🔍 Current state:', {
      isAuthenticated,
      user: user ? `User ID: ${user.id}` : 'No user',
      selectedTemplateId,
      templatesLength: templates.length,
      splitResultsLength: splitResults.length,
      selectedItemsLength: selectedItems.length,
      selectedItems,
      userCredits: user?.credits || 0,
      requiredCredits: selectedItems.length * 20
    });
    
    // 检查API密钥
    const apiKey = localStorage.getItem('doubao_api_key');
    console.log('🔑 API Key status:', apiKey ? 'Configured' : 'Missing');
    if (!apiKey) {
      console.log('❌ API key check failed');
      message.error({
        content: '🔑 Please configure your Doubao-Seedream-4.0 API key in Settings to enable image generation.',
        duration: 5
      });
      return;
    }
    
    console.log('✅ API key check passed');
    
    // Check if user is logged in
    if (!isAuthenticated || !user) {
      console.log('❌ User not logged in');
      message.error({
        content: 'Please login first to use image generation feature',
        duration: 5
      });
      return;
    }
    
    console.log('🎨 Checking template:', selectedTemplateId);
    const template = getTemplateById(selectedTemplateId);
    console.log('🎨 Retrieved template:', template);
    if (!template) {
      console.log('❌ Template not found');
      message.error('Please select a template');
      return;
    }
    
    console.log('📝 Checking split results:', splitResults.length);
    if (splitResults.length === 0) {
      console.log('❌ No split results');
      message.error('No content available for generation');
      return;
    }
    
    console.log('📝 Checking selected items:', selectedItems.length);
    if (selectedItems.length === 0) {
      console.log('❌ No items selected');
      message.error('Please select at least one image to generate');
      return;
    }
    
    // 计算需要消耗的积分（每张图片20积分）
    const requiredCredits = selectedItems.length * 20;
    console.log('💰 积分检查:', { userCredits: user.credits, requiredCredits, selectedCount: selectedItems.length });
    
    // 检查积分是否充足
    if (user.credits < requiredCredits) {
      console.log('❌ 积分不足');
      message.error({
        content: `Insufficient credits! Generating ${selectedItems.length} images requires ${requiredCredits} credits, but you only have ${user.credits} credits. Please purchase credits to continue.`,
        duration: 8
      });
      return;
    }
    
    console.log('💬 尝试显示确认对话框');
    
    // 临时跳过确认对话框，直接开始生成
    const useDirectGeneration = true;
    
    let confirmed = false;
    
    if (useDirectGeneration) {
      // 使用简单的window.confirm作为临时解决方案
      confirmed = window.confirm(`Confirm image generation?\nGenerate ${selectedItems.length} images\nCost: ${requiredCredits} credits\nRemaining: ${user.credits - requiredCredits} credits`);
      console.log('💬 window.confirm 结果:', confirmed);
    } else {
      // 原来的Modal.confirm方式
      confirmed = await new Promise((resolve) => {
        Modal.confirm({
          title: 'Confirm Image Generation',
          content: (
            <div>
              <p>Generate <strong>{selectedItems.length}</strong> images</p>
              <p>Cost: <strong>{requiredCredits}</strong> credits</p>
              <p>Remaining: <strong>{user.credits - requiredCredits}</strong> credits</p>
            </div>
          ),
          onOk: () => {
            console.log('✅ 用户确认生成');
            resolve(true);
          },
          onCancel: () => {
            console.log('❌ 用户取消生成');
            resolve(false);
          },
        });
      });
    }
    
    console.log('💬 最终确认结果:', confirmed);
    if (!confirmed) {
      console.log('🚫 用户取消生成');
      return;
    }
    
    console.log('🎬 开始生成流程');
    
    try {
      console.log('🔧 设置生成状态');
      setIsGenerating(true);
      setGenerationProgress(0);
      console.log('✅ 状态设置完成');
    
      console.log('💰 尝试扣除积分:', requiredCredits);
      // 先扣除积分
      const deductResult = await deductCredits(requiredCredits);
      console.log('💰 积分扣除结果:', deductResult);
      if (!deductResult) {
        console.log('❌ 积分扣除失败');
        message.error('Credit deduction failed, please try again');
        return;
      }
      
      console.log('✅ 积分扣除成功，开始准备生成');
      message.success(`${requiredCredits} credits deducted, starting image generation...`);
      
      console.log('📝 准备提示词...');
      // 准备提示词，只为选中的项目生成
      const selectedSplitResults = selectedItems.map(index => splitResults[index]);
      const prompts = PromptBuilder.buildPrompts(template, selectedSplitResults);
      console.log('📝 生成的提示词:', prompts);
      
      // 初始化图片状态（包含prompt和templateId）
      const initialImages: GeneratedImage[] = prompts.map(p => ({
        id: p.id,
        url: '',
        type: p.type,
        index: p.index,
        status: 'pending',
        prompt: p.prompt, // 保存prompt用于后续重新生成
        templateId: selectedTemplateId, // 保存模板ID用于编辑后重新生成
      }));
      setGeneratedImages(initialImages);
      console.log('🖼️ 初始化图片状态:', initialImages);
      
      // 生成图片
      let completed = 0;
      const finalResults = new Map(); // 记录每张图片的最终状态
      
      console.log('🚀 开始调用 doubaoAPI.generateImages');
      await doubaoAPI.generateImages(
        prompts.map(p => ({ id: p.id, prompt: p.prompt })),
        (id, status, url, error) => {
          console.log('📊 图片生成回调:', { id, status, url: url ? 'URL已生成' : '无URL', error });
          if (status === 'success' && url) {
            updateImageUrl(id, url);
            finalResults.set(id, 'success');
            // 重新计算完成数量
            completed = Array.from(finalResults.values()).filter(s => s === 'success').length;
            const progress = Math.round((completed / prompts.length) * 100);
            console.log('✅ 图片生成成功:', { id, completed, total: prompts.length, progress });
            setGenerationProgress(progress);
          } else {
            updateImageStatus(id, status, error);
            finalResults.set(id, 'failed');
            console.log('❌ 图片生成失败:', { id, status, error });
          }
        }
      );
      
      console.log('🏁 doubaoAPI.generateImages 完成');
      
      // 计算最终的失败数量
      const finalFailed = Array.from(finalResults.values()).filter(s => s === 'failed').length;
      const finalCompleted = Array.from(finalResults.values()).filter(s => s === 'success').length;
      
      console.log('📊 最终结果统计:', { finalCompleted, finalFailed, totalImages: prompts.length });
      
      // 如果有失败的图片，返还对应的积分
      if (finalFailed > 0) {
        const refundCredits = finalFailed * 20;
        await deductCredits(-refundCredits); // 负数表示增加积分
        message.warning(`${finalFailed} images failed to generate, ${refundCredits} credits refunded`);
      }
      
      if (finalCompleted > 0) {
        message.success(`Successfully generated ${finalCompleted} images!`);
        // 自动进入下一步
        setTimeout(() => nextStep(), 1000);
      } else {
        message.error('All images failed to generate, all credits have been refunded');
      }
      
    } catch (error: any) {
      console.error('Generation error:', error);
      message.error(`Generation failed: ${error.message || 'Unknown error'}`);
      
      // 发生错误时返还积分
      await deductCredits(-requiredCredits);
      message.info('All credits have been refunded');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(100);
    }
  };
  
  const handleNext = () => {
    if (generatedImages.length > 0 && !isGenerating) {
      nextStep();
    }
  };
  
  return (
    <StepContainer
      title={
        <div className="flex items-center gap-2">
          <span>🎨 Select Image Style Template</span>
          {isAuthenticated && user && (
            <Tag color="green" icon={<DollarOutlined />}>
              {user.credits} credits
            </Tag>
          )}
        </div>
      }
      nextDisabled={generatedImages.length === 0 || isGenerating}
      onNext={handleNext}
      showNavigation={!isGenerating}
    >
      <div className="space-y-6">
        {/* 模板选择 */}
        {!isGenerating && (
          <>
            <div>
              <Title level={5}>Select Template</Title>
              {templates.length === 0 ? (
                <Empty
                  description="No templates available, please create a custom template"
                  className="py-8"
                >
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setTemplateModalOpen(true)}
                  >
                    Create Template
                  </Button>
                </Empty>
              ) : (
                <Radio.Group 
                  value={selectedTemplateId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setSelectedTemplateId(newId);
                    storage.setSelectedTemplateId(newId); // 保存到localStorage
                  }}
                  className="w-full"
                >
                  <Row gutter={[16, 16]}>
                    {templates.map((template) => (
                      <Col key={template.id} xs={24} sm={12} md={8}>
                        <Card
                          hoverable
                          className={`card-hover-effect ${selectedTemplateId === template.id ? 'border-blue-500 border-2' : ''}`}
                        >
                          <Radio value={template.id}>
                            <Space direction="vertical" className="w-full">
                              <Text strong>{template.name}</Text>
                              {!template.isPreset && (
                                <Text type="secondary" className="text-xs">Custom</Text>
                              )}
                            </Space>
                          </Radio>
                        </Card>
                      </Col>
                    ))}
                    <Col xs={24} sm={12} md={8}>
                      <Card
                        hoverable
                        onClick={() => setTemplateModalOpen(true)}
                        className="border-dashed cursor-pointer card-hover-effect"
                      >
                        <div className="text-center">
                          <PlusOutlined className="text-2xl mb-2" />
                          <div>Add Custom Template</div>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </Radio.Group>
              )}
            </div>
            
            {/* 图片设置和积分状态 */}
            <Card 
              size="small" 
              title={
                <div className="flex items-center gap-2">
                  <span>Image Settings</span>
                  {isAuthenticated && user ? (
                    <Tag color="green" icon={<KeyOutlined />}>
                      {user.credits} credits
                    </Tag>
                  ) : (
                    <Tag color="red" icon={<KeyOutlined />}>
                      Not logged in
                    </Tag>
                  )}
                </div>
              }
            >
              <Space direction="vertical" className="w-full">
                {!isAuthenticated && (
                  <Alert
                    message="Login Required"
                    description="Image generation requires you to log in to your account first."
                    type="warning"
                    showIcon
                  />
                )}
                <div>
                  <Text>Image Size: </Text>
                  <Text type="secondary">{imageSize}</Text>
                </div>
                <Checkbox checked={watermarkEnabled} disabled>
                  Add watermark
                </Checkbox>
                
                {/* 选择生成的图片 */}
                <div>
                  <Text strong className="block mb-2">Select images to generate:</Text>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {splitResults.map((result, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Checkbox 
                          checked={selectedItems.includes(index)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            if (checked) {
                              setSelectedItems([...selectedItems, index]);
                            } else {
                              setSelectedItems(selectedItems.filter(i => i !== index));
                            }
                          }}
                        />
                        <Text className="text-sm flex-1">
                          {index + 1}. {result.text.substring(0, 60)}{result.text.length > 60 ? '...' : ''}
                        </Text>
                      </div>
                    ))}
                  </div>
                  
                  {/* 快速选择按钮 */}
                  <div className="mt-3 space-x-2">
                    <Button size="small" onClick={() => {
                      const first5 = splitResults.slice(0, 5).map((_, i) => i);
                      setSelectedItems(first5);
                    }}>
                      Select First 5
                    </Button>
                    <Button size="small" onClick={() => {
                      setSelectedItems(splitResults.map((_, i) => i));
                    }}>
                      Select All
                    </Button>
                    <Button size="small" onClick={() => setSelectedItems([])}>
                      Clear All
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Text type="secondary">
                    Will generate {selectedItems.length} images
                  </Text>
                  {isAuthenticated && (
                    <Text type="secondary" className="block mt-1">
                      💰 Each image costs 20 credits (≈ $0.2)
                    </Text>
                  )}
                  {isAuthenticated && user && (
                    <Text type="secondary" className="block mt-1">
                      🔥 Required: {selectedItems.length * 20} credits, Balance: {user.credits}
                    </Text>
                  )}
                </div>
              </Space>
            </Card>
            
            {/* 生成按钮 */}
            <div className="text-center space-y-2">
              <Button
                type="primary"
                size="large"
                icon={<PictureOutlined />}
                onClick={(e) => {
                  console.log('🖱️ 按钮点击事件触发', e);
                  handleGenerateImages();
                }}
                disabled={!selectedTemplateId || templates.length === 0 || !isAuthenticated || !user || selectedItems.length === 0 || (user && user.credits < selectedItems.length * 20)}
                className="btn-hover-effect"
              >
Generate Images
              </Button>
              
              {/* 调试信息按钮 */}
              <div>
                <Button 
                  size="small" 
                  type="link" 
                  onClick={() => {
                    const apiKey = localStorage.getItem('doubao_api_key');
                    const debugInfo = {
                      isAuthenticated,
                      hasUser: !!user,
                      userCredits: user?.credits,
                      selectedTemplateId,
                      templatesCount: templates.length,
                      selectedItemsCount: selectedItems.length,
                      splitResultsCount: splitResults.length,
                      apiKeyExists: !!apiKey,
                      apiKeyPreview: apiKey ? `${apiKey.substring(0, 8)}...` : 'Not set',
                      buttonDisabled: (!selectedTemplateId || templates.length === 0 || !isAuthenticated || !user || selectedItems.length === 0 || (user && user.credits < selectedItems.length * 20))
                    };
                    console.log('🔍 Debug Info:', debugInfo);
                    alert(`Debug Information:\n\n${JSON.stringify(debugInfo, null, 2)}`);
                  }}
                >
                  Debug Info
                </Button>
              </div>
            </div>
          </>
        )}
        
        {/* 生成进度 */}
        {isGenerating && (
          <div className="py-12">
            <div className="text-center mb-8">
              <LoadingOutlined className="text-4xl text-blue-500" />
              <Title level={4} className="mt-4">
                Generating images...
              </Title>
            </div>
            
            <Progress
              percent={generationProgress}
              status="active"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            
            <div className="mt-8 space-y-2">
              {generatedImages.map((image) => (
                <div key={image.id} className="flex items-center justify-between">
                  <Text>
                    {image.type === 'cover' ? 'Cover' : `Content ${image.index}`}
                  </Text>
                  <Text type={
                    image.status === 'success' ? 'success' :
                    image.status === 'error' ? 'danger' :
                    image.status === 'generating' ? 'warning' :
                    'secondary'
                  }>
                    {image.status === 'success' ? '✅ Completed' :
                     image.status === 'error' ? '❌ Failed' :
                     image.status === 'generating' ? '⏳ Generating...' :
                     '⏸ Waiting'}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </StepContainer>
  );
};
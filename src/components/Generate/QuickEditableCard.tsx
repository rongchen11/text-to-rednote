import React, { useState } from 'react';
import { Card, Button, Checkbox, Image, Typography, Space, Tooltip } from 'antd';
import {
  EditOutlined,
  ReloadOutlined,
  DownloadOutlined,
  LoadingOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import type { GeneratedImage, SplitResult } from '../../types';

const { Text } = Typography;

interface QuickEditableCardProps {
  image: GeneratedImage;
  splitResult?: SplitResult;
  selected: boolean;
  onSelectChange: (checked: boolean) => void;
  onEdit: () => void;
  onRegenerate: () => void;
  onDownload: () => void;
}

export const QuickEditableCard: React.FC<QuickEditableCardProps> = ({
  image,
  splitResult,
  selected,
  onSelectChange,
  onEdit,
  onRegenerate,
  onDownload,
}) => {
  const [textExpanded, setTextExpanded] = useState(false);

  const typeLabel = image.type === 'cover' ? 'Cover' : `Content ${image.index}`;
  const displayText = splitResult?.text || '';
  const shouldShowExpand = displayText.length > 50;
  const truncatedText = displayText.substring(0, 50);

  // 根据状态决定卡片内容
  const renderCardCover = () => {
    if (image.status === 'success' && image.url) {
      return (
        <Image
          src={image.url}
          alt={`${image.type}-${image.index}`}
          style={{ height: 200, objectFit: 'cover' }}
          preview={{
            maskClassName: 'rounded-t-lg',
          }}
        />
      );
    }

    if (image.status === 'generating') {
      return (
        <div className="h-[200px] bg-gray-100 flex flex-col items-center justify-center rounded-t-lg">
          <LoadingOutlined className="text-3xl text-blue-500 mb-2" />
          <Text type="secondary">Generating...</Text>
        </div>
      );
    }

    if (image.status === 'error') {
      return (
        <div className="h-[200px] bg-gray-100 flex flex-col items-center justify-center rounded-t-lg">
          <Text type="danger" className="mb-2">Generation Failed</Text>
          <Text type="secondary" className="text-xs text-center px-4">
            {image.error || 'Unknown error'}
          </Text>
        </div>
      );
    }

    // pending 状态
    return (
      <div className="h-[200px] bg-gray-100 flex items-center justify-center rounded-t-lg">
        <Text type="secondary">Waiting to generate</Text>
      </div>
    );
  };

  const renderActions = () => {
    const actions = [];

    // 选择框
    actions.push(
      <Checkbox
        key="select"
        checked={selected}
        onChange={(e) => onSelectChange(e.target.checked)}
        disabled={image.status === 'generating'}
      />
    );

    // 编辑按钮
    actions.push(
      <Tooltip key="edit" title="Edit Text">
        <Button
          type="text"
          size="small"
          icon={<EditOutlined />}
          onClick={onEdit}
          disabled={image.status === 'generating'}
        />
      </Tooltip>
    );

    // 重新生成按钮
    actions.push(
      <Tooltip key="regenerate" title="Regenerate">
        <Button
          type="text"
          size="small"
          icon={image.status === 'generating' ? <LoadingOutlined /> : <ReloadOutlined />}
          onClick={onRegenerate}
          disabled={image.status === 'generating'}
        />
      </Tooltip>
    );

    // 下载按钮
    actions.push(
      <Tooltip key="download" title="Download">
        <Button
          type="text"
          size="small"
          icon={<DownloadOutlined />}
          onClick={onDownload}
          disabled={image.status !== 'success'}
        />
      </Tooltip>
    );

    return actions;
  };

  return (
    <Card
      hoverable
      className={`
        transition-all duration-200
        ${image.status === 'generating' ? 'animate-pulse' : ''}
        ${selected ? 'ring-2 ring-blue-500' : ''}
      `}
      cover={renderCardCover()}
      actions={renderActions()}
      bodyStyle={{ padding: '12px' }}
      size="small"
    >
      <Space direction="vertical" className="w-full" size="small">
        {/* 标题 */}
        <div className="flex justify-between items-center">
          <Text strong>{typeLabel}</Text>
          {image.status === 'success' && (
            <Text type="success" className="text-xs">✓ Generated</Text>
          )}
        </div>

        {/* 文本内容 */}
        {displayText && (
          <div className="mt-2">
            <Text className="text-xs text-gray-600">
              {textExpanded ? displayText : truncatedText}
              {!textExpanded && displayText.length > 50 && '...'}
            </Text>
            
            {shouldShowExpand && (
              <Button
                type="link"
                size="small"
                icon={textExpanded ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setTextExpanded(!textExpanded)}
                className="p-0 mt-1 text-xs"
              >
                {textExpanded ? 'Collapse' : 'Expand'}
              </Button>
            )}
          </div>
        )}

        {/* 字数统计 */}
        {splitResult && (
          <Text type="secondary" className="text-xs">
            字数：{splitResult.charCount}
          </Text>
        )}
      </Space>
    </Card>
  );
};
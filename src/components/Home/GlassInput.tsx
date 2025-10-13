import React, { useState, useRef } from 'react';
import { Input, Button, Space, Typography, message } from 'antd';
import { 
  AudioOutlined, 
  CopyOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { validators } from '../../utils/validators';
import { MIN_TEXT_LENGTH } from '../../utils/constants';

const { TextArea } = Input;
const { Text } = Typography;

interface GlassInputProps {
  inputText: string;
  onTextChange: (text: string) => void;
  onNext: () => void;
}

export const GlassInput: React.FC<GlassInputProps> = ({ 
  inputText, 
  onTextChange, 
  onNext
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const text = await file.text();
        onTextChange(text);
        message.success('File imported successfully');
      } else {
        message.error('Only txt text files are supported');
      }
    }
  };
  
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onTextChange(text);
      message.success('Text pasted successfully');
    } catch (err) {
      message.error('Paste failed');
    }
  };
  
  const handleClear = () => {
    onTextChange('');
  };
  
  const handleVoiceInput = () => {
    message.info('Voice input feature under development...');
  };
  
  return (
    <div 
      className={`glass-morphism rounded-lg p-6 mb-6 animate-fadeInUp ${
        isDragging ? 'drag-over' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <TextArea
        placeholder="✍️ Start your creation here...\n\nSupports direct paste, drag & drop files, or voice input"
        value={inputText}
        onChange={(e) => onTextChange(e.target.value)}
        rows={10}
        maxLength={10000}
        className="!bg-transparent !border-none text-base"
        style={{ resize: 'none' }}
      />
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Text className="text-gray-600">
            Characters: {inputText.length}/10000
          </Text>
          {inputText.length < MIN_TEXT_LENGTH && inputText.length > 0 && (
            <Text type="danger" className="text-sm">
              Need {MIN_TEXT_LENGTH - inputText.length} more characters
            </Text>
          )}
        </div>
        
        <Space>
          <Button
            icon={<AudioOutlined />}
            onClick={handleVoiceInput}
            className="hover-glow"
            title="Voice Input"
          >
            Voice
          </Button>
          <Button
            icon={<CopyOutlined />}
            onClick={handlePaste}
            className="hover-glow"
          >
            Paste
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={handleClear}
            disabled={!inputText}
            danger
          >
            Clear
          </Button>
        </Space>
      </div>
      
      <div className="mt-4 text-center">
        <Button
          type="primary"
          size="large"
          onClick={onNext}
          disabled={!validators.isValidTextLength(inputText)}
          className="px-12 hover-glow"
        >
          Next →
        </Button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            file.text().then(text => {
              onTextChange(text);
              message.success('File imported successfully');
            });
          }
        }}
      />
    </div>
  );
};
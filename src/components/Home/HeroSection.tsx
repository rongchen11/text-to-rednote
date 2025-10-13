import React from 'react';
import { Typography } from 'antd';

const { Title, Text } = Typography;

export const HeroSection: React.FC = () => {
  return (
    <div className="gradient-hero rounded-lg p-8 mb-6 animate-fadeInUp">
      <div className="text-center text-white">
        <Title level={2} className="!text-white !mb-2">
          ✨ Text to RedNote
        </Title>
        <Text className="text-white/90 text-lg">
          Make your content shine on RedNote
        </Text>
      </div>
    </div>
  );
};
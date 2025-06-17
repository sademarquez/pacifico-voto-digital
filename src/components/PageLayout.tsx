
import { ReactNode } from 'react';
import TopBorder from './TopBorder';

interface PageLayoutProps {
  children: ReactNode;
  borderVariant?: 'default' | 'gradient' | 'animated';
  borderColor?: 'blue' | 'purple' | 'green' | 'orange';
  className?: string;
}

const PageLayout = ({ 
  children, 
  borderVariant = 'gradient',
  borderColor = 'blue',
  className = ''
}: PageLayoutProps) => {
  return (
    <>
      <TopBorder variant={borderVariant} color={borderColor} />
      <div className={`pt-4 min-h-screen ${className}`}>
        {children}
      </div>
    </>
  );
};

export default PageLayout;

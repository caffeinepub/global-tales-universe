import { ReactNode } from 'react';
import { pageLayout } from '../lib/uiPolish';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export default function PageLayout({ children, title, className = '' }: PageLayoutProps) {
  return (
    <div className={`${pageLayout.maxWidth} mx-auto ${pageLayout.containerPadding} ${pageLayout.topSpacing} ${pageLayout.sectionGap} ${className}`}>
      {title && (
        <h1 className={`${pageLayout.titleSize} ${pageLayout.titleWeight} ${pageLayout.titleMargin}`}>
          {title}
        </h1>
      )}
      {children}
    </div>
  );
}

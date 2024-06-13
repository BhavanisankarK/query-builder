import React from 'react';

interface HTMLRendererProps {
  htmlContent: string; // Define the prop htmlContent as a string
}

const HTMLRenderer: React.FC<HTMLRendererProps> = ({ htmlContent }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}

export default HTMLRenderer;
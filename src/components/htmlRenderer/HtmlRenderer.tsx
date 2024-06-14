import debounce from '@mui/material/utils/debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface HTMLRendererProps {
  htmlContent: string; // Define the prop htmlContent as a string
}

const HTMLRenderer: React.FC<HTMLRendererProps> = ({ htmlContent }) => {

  const contentRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(htmlContent);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== htmlContent) {
      contentRef.current.innerHTML = htmlContent;
    }
  }, [htmlContent]);

  const debouncedUpdateContent = useCallback(
    debounce((newContent: string) => {
      setContent(newContent);
    }, 300),
    []
  );

  const handleInput = useCallback(() => {
    if (contentRef.current) {
      const newContent = contentRef.current.innerHTML;
      debouncedUpdateContent(newContent);
    }
  }, [debouncedUpdateContent]);


  return (
    <div ref={contentRef}
    contentEditable={true}
    // onInput={handleInput} 
    dangerouslySetInnerHTML={{ __html: content }} />
  );
}

export default HTMLRenderer;
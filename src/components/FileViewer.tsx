import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface FileViewerProps {
  file: File;
  independentZoom?: boolean;
}

export function FileViewer({ file, independentZoom = false }: FileViewerProps) {
  const [url, setUrl] = useState<string>('');
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  if (file.type === 'application/pdf') {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-2 border-b bg-white">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
              disabled={pageNumber <= 1}
              className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm">
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
              disabled={pageNumber >= numPages}
              className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
              className="px-2 py-1 bg-gray-100 rounded"
            >
              -
            </button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(prev => Math.min(5, prev + 0.1))}
              className="px-2 py-1 bg-gray-100 rounded"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-gray-100">
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            className="flex flex-col items-center"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-lg"
            />
          </Document>
        </div>
      </div>
    );
  }

  if (file.type.startsWith('image/')) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-end p-2 border-b bg-white">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
              className="px-2 py-1 bg-gray-100 rounded"
            >
              -
            </button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(prev => Math.min(5, prev + 0.1))}
              className="px-2 py-1 bg-gray-100 rounded"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-gray-100">
          <div className="flex justify-center">
            <img
              src={url}
              alt={file.name}
              style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
              className="max-w-full shadow-lg"
            />
          </div>
        </div>
      </div>
    );
  }

  // For other file types (Word, Excel, etc.)
  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900 mb-2">{file.name}</p>
        <p className="text-sm text-gray-500">
          Preview not available for this file type.
          <br />
          Please download to view.
        </p>
      </div>
    </div>
  );
}
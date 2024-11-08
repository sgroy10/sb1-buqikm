import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileViewer } from './FileViewer';
import { STLPreview } from './STLPreview';
import { JewelryRender } from './JewelryRender';

interface ViewerLayoutProps {
  designFiles: File[];
  stlFiles: File[];
  activeDesignIndex: number;
  activeStlIndex: number;
  showRender: boolean;
  onDesignSelect: (index: number) => void;
  onStlSelect: (index: number) => void;
  onRender: () => void;
  onRemoveDesign: (index: number) => void;
  onRemoveStl: (index: number) => void;
}

export function ViewerLayout({
  designFiles,
  stlFiles,
  activeDesignIndex,
  activeStlIndex,
  showRender,
  onDesignSelect,
  onStlSelect,
  onRender,
  onRemoveDesign,
  onRemoveStl
}: ViewerLayoutProps) {
  const [viewMode, setViewMode] = useState<'tabs' | 'split' | 'triple'>('tabs');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'design' | 'stl' | 'render'>('design');
  const stlInputRef = useRef<HTMLInputElement>(null);
  const [stlUrls, setStlUrls] = useState<string[]>([]);

  const createStlUrl = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setStlUrls(prev => [...prev, url]);
    return url;
  }, []);

  useEffect(() => {
    return () => {
      stlUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [stlUrls]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSTLUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).filter(file => file.name.endsWith('.stl'));
    if (files.length) {
      files.forEach(file => {
        createStlUrl(file);
      });
      onStlSelect(stlFiles.length);
      setActiveTab('stl');
    }
  };

  const getCurrentStlUrl = () => {
    if (stlFiles[activeStlIndex]) {
      return URL.createObjectURL(stlFiles[activeStlIndex]);
    }
    return null;
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white shadow-sm px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold text-indigo-600">JewelryViz</Link>
          
          <div className="flex items-center space-x-4">
            {designFiles.length > 0 && (
              <select
                value={activeDesignIndex}
                onChange={(e) => onDesignSelect(Number(e.target.value))}
                className="text-sm border rounded-md p-1"
              >
                {designFiles.map((file, index) => (
                  <option key={index} value={index}>{file.name}</option>
                ))}
              </select>
            )}

            {stlFiles.length > 0 && (
              <select
                value={activeStlIndex}
                onChange={(e) => onStlSelect(Number(e.target.value))}
                className="text-sm border rounded-md p-1"
              >
                {stlFiles.map((file, index) => (
                  <option key={index} value={index}>{file.name}</option>
                ))}
              </select>
            )}

            <button
              onClick={() => stlInputRef.current?.click()}
              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
            >
              {stlFiles.length > 0 ? 'Add STL' : 'Upload STL'}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {viewMode === 'tabs' && (
            <div className="flex bg-gray-100 p-1 rounded-lg mr-2">
              {designFiles.length > 0 && (
                <button
                  onClick={() => setActiveTab('design')}
                  className={`px-3 py-1 rounded-md text-sm ${activeTab === 'design' ? 'bg-white shadow' : ''}`}
                >
                  Design
                </button>
              )}
              {stlFiles.length > 0 && (
                <button
                  onClick={() => setActiveTab('stl')}
                  className={`px-3 py-1 rounded-md text-sm ${activeTab === 'stl' ? 'bg-white shadow' : ''}`}
                >
                  STL
                </button>
              )}
              {showRender && (
                <button
                  onClick={() => setActiveTab('render')}
                  className={`px-3 py-1 rounded-md text-sm ${activeTab === 'render' ? 'bg-white shadow' : ''}`}
                >
                  Render
                </button>
              )}
            </div>
          )}

          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('tabs')}
              className={`px-3 py-1 rounded-md text-sm ${viewMode === 'tabs' ? 'bg-white shadow' : ''}`}
            >
              Tabs
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 rounded-md text-sm ${viewMode === 'split' ? 'bg-white shadow' : ''}`}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode('triple')}
              className={`px-3 py-1 rounded-md text-sm ${viewMode === 'triple' ? 'bg-white shadow' : ''}`}
            >
              Triple
            </button>
          </div>

          {stlFiles.length > 0 && !showRender && (
            <button
              onClick={onRender}
              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
            >
              Render
            </button>
          )}

          <button onClick={toggleFullscreen} className="p-1 hover:bg-gray-100 rounded-md">
            {isFullscreen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6v6H9z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <input
        ref={stlInputRef}
        type="file"
        accept=".stl"
        onChange={handleSTLUpload}
        className="hidden"
        multiple
      />

      <div className="flex-1 bg-gray-50">
        {viewMode === 'tabs' && (
          <div className="h-full">
            {activeTab === 'design' && designFiles[activeDesignIndex] && (
              <FileViewer file={designFiles[activeDesignIndex]} />
            )}
            {activeTab === 'stl' && stlFiles[activeStlIndex] && (
              <div className="h-full">
                <STLPreview modelUrl={getCurrentStlUrl() || ''} />
              </div>
            )}
            {activeTab === 'render' && showRender && stlFiles[activeStlIndex] && (
              <JewelryRender modelUrl={getCurrentStlUrl() || ''} isRendering={false} />
            )}
          </div>
        )}

        {viewMode === 'split' && (
          <div className="grid grid-cols-2 h-full">
            <div className="border-r">
              {designFiles[activeDesignIndex] && (
                <FileViewer file={designFiles[activeDesignIndex]} />
              )}
            </div>
            <div>
              {stlFiles[activeStlIndex] && (
                <STLPreview modelUrl={getCurrentStlUrl() || ''} />
              )}
            </div>
          </div>
        )}

        {viewMode === 'triple' && (
          <div className="grid grid-cols-3 h-full">
            <div className="border-r">
              {designFiles[activeDesignIndex] && (
                <FileViewer file={designFiles[activeDesignIndex]} />
              )}
            </div>
            <div className="border-r">
              {stlFiles[activeStlIndex] && (
                <STLPreview modelUrl={getCurrentStlUrl() || ''} />
              )}
            </div>
            <div>
              {showRender && stlFiles[activeStlIndex] && (
                <JewelryRender modelUrl={getCurrentStlUrl() || ''} isRendering={false} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
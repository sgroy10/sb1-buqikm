import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { STLPreview } from './STLPreview';
import { JewelryRender } from './JewelryRender';
import { FileViewer } from './FileViewer';

const SUPPORTED_DESIGN_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/msword',
  'application/vnd.ms-excel',
  'image/jpeg',
  'image/png',
  'image/gif'
];

export function STLViewer() {
  const [designFiles, setDesignFiles] = useState<File[]>([]);
  const [stlFiles, setStlFiles] = useState<File[]>([]);
  const [activeDesignIndex, setActiveDesignIndex] = useState(0);
  const [activeStlIndex, setActiveStlIndex] = useState(0);
  const [showRender, setShowRender] = useState(false);
  const [viewMode, setViewMode] = useState<'tabs' | 'split' | 'triple'>('tabs');
  const [activeTab, setActiveTab] = useState<'design' | 'stl' | 'render'>('design');
  const [showStlDropdown, setShowStlDropdown] = useState(false);
  
  const designInputRef = useRef<HTMLInputElement>(null);
  const singleStlInputRef = useRef<HTMLInputElement>(null);
  const multipleStlInputRef = useRef<HTMLInputElement>(null);

  const handleDesignUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => 
      SUPPORTED_DESIGN_TYPES.includes(file.type) || 
      file.name.endsWith('.doc') || 
      file.name.endsWith('.docx') || 
      file.name.endsWith('.xls') || 
      file.name.endsWith('.xlsx')
    );
    
    if (validFiles.length) {
      setDesignFiles(prev => [...prev, ...validFiles]);
      setActiveDesignIndex(designFiles.length);
      setActiveTab('design');
    }
  };

  const handleSTLUpload = (event: React.ChangeEvent<HTMLInputElement>, isMultiple: boolean) => {
    const files = Array.from(event.target.files || []).filter(file => file.name.endsWith('.stl'));
    if (files.length) {
      if (isMultiple) {
        setStlFiles(prev => [...prev, ...files]);
      } else {
        setStlFiles([files[0]]);
      }
      setActiveStlIndex(0);
      setActiveTab('stl');
      setShowRender(false);
    }
    setShowStlDropdown(false);
  };

  const getCurrentStlUrl = () => {
    if (stlFiles[activeStlIndex]) {
      return URL.createObjectURL(stlFiles[activeStlIndex]);
    }
    return '';
  };

  const handleRender = () => {
    if (stlFiles[activeStlIndex]) {
      setShowRender(true);
      setActiveTab('render');
    }
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
                onChange={(e) => setActiveDesignIndex(Number(e.target.value))}
                className="text-sm border rounded-md p-1"
              >
                {designFiles.map((file, index) => (
                  <option key={index} value={index}>{file.name}</option>
                ))}
              </select>
            )}

            {stlFiles.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveStlIndex(prev => Math.max(0, prev - 1))}
                  disabled={activeStlIndex === 0}
                  className="p-1 text-gray-600 disabled:text-gray-400"
                >
                  ←
                </button>
                <select
                  value={activeStlIndex}
                  onChange={(e) => setActiveStlIndex(Number(e.target.value))}
                  className="text-sm border rounded-md p-1"
                >
                  {stlFiles.map((file, index) => (
                    <option key={index} value={index}>
                      {file.name} ({index + 1}/{stlFiles.length})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setActiveStlIndex(prev => Math.min(stlFiles.length - 1, prev + 1))}
                  disabled={activeStlIndex === stlFiles.length - 1}
                  className="p-1 text-gray-600 disabled:text-gray-400"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* View Mode Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('design')}
              className={`px-4 py-1 rounded-md text-sm ${activeTab === 'design' ? 'bg-white shadow text-indigo-600' : 'text-gray-600'}`}
            >
              Design
            </button>
            <button
              onClick={() => setActiveTab('stl')}
              className={`px-4 py-1 rounded-md text-sm ${activeTab === 'stl' ? 'bg-white shadow text-indigo-600' : 'text-gray-600'}`}
            >
              STL
            </button>
            {showRender && (
              <button
                onClick={() => setActiveTab('render')}
                className={`px-4 py-1 rounded-md text-sm ${activeTab === 'render' ? 'bg-white shadow text-indigo-600' : 'text-gray-600'}`}
              >
                Render
              </button>
            )}
          </div>

          {/* View Layout Controls */}
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

          {/* Upload Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => designInputRef.current?.click()}
              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
            >
              {designFiles.length > 0 ? 'Add Design' : 'Upload Design'}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowStlDropdown(!showStlDropdown)}
                className="px-3 py-1 bg-violet-600 text-white text-sm rounded-md hover:bg-violet-700"
              >
                Upload STL ▾
              </button>
              {showStlDropdown && (
                <div className="absolute right-0 mt-1 w-48 bg-violet-50 rounded-md shadow-lg z-50">
                  <button
                    onClick={() => {
                      singleStlInputRef.current?.click();
                      setShowStlDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-violet-100 rounded-t-md text-violet-700"
                  >
                    Single STL File
                  </button>
                  <button
                    onClick={() => {
                      multipleStlInputRef.current?.click();
                      setShowStlDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-violet-100 rounded-b-md text-violet-700"
                  >
                    Multiple STL Files
                  </button>
                </div>
              )}
            </div>
          </div>

          {stlFiles.length > 0 && !showRender && (
            <button
              onClick={handleRender}
              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
            >
              Render
            </button>
          )}
        </div>
      </div>

      <input
        ref={designInputRef}
        type="file"
        accept={SUPPORTED_DESIGN_TYPES.join(',')}
        onChange={handleDesignUpload}
        className="hidden"
        multiple
      />

      <input
        ref={singleStlInputRef}
        type="file"
        accept=".stl"
        onChange={(e) => handleSTLUpload(e, false)}
        className="hidden"
      />

      <input
        ref={multipleStlInputRef}
        type="file"
        accept=".stl"
        onChange={(e) => handleSTLUpload(e, true)}
        className="hidden"
        multiple
      />

      <div className="flex-1 bg-gray-100 p-4">
        {viewMode === 'tabs' && (
          <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
            {activeTab === 'design' && designFiles[activeDesignIndex] && (
              <FileViewer file={designFiles[activeDesignIndex]} />
            )}
            {activeTab === 'stl' && stlFiles[activeStlIndex] && (
              <STLPreview modelUrl={getCurrentStlUrl()} />
            )}
            {activeTab === 'render' && showRender && (
              <JewelryRender modelUrl={getCurrentStlUrl()} isRendering={false} />
            )}
          </div>
        )}

        {viewMode === 'split' && (
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200">
              {designFiles[activeDesignIndex] && (
                <FileViewer file={designFiles[activeDesignIndex]} independentZoom={true} />
              )}
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200">
              {stlFiles[activeStlIndex] && (
                <STLPreview modelUrl={getCurrentStlUrl()} independentZoom={true} />
              )}
            </div>
          </div>
        )}

        {viewMode === 'triple' && (
          <div className="grid grid-cols-3 gap-4 h-full">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200">
              {designFiles[activeDesignIndex] && (
                <FileViewer file={designFiles[activeDesignIndex]} independentZoom={true} />
              )}
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200">
              {stlFiles[activeStlIndex] && (
                <STLPreview modelUrl={getCurrentStlUrl()} independentZoom={true} />
              )}
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200">
              {showRender && (
                <JewelryRender modelUrl={getCurrentStlUrl()} isRendering={false} independentZoom={true} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
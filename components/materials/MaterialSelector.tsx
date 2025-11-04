"use client";

import { useState, useEffect } from 'react';
import { Book, CheckCircle, Circle, Search, X } from 'lucide-react';
import { CourseMaterial, getMaterials } from '@/lib/materialApi';
import { toast } from 'react-hot-toast';

interface MaterialSelectorProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function MaterialSelector({
  selectedIds,
  onSelectionChange,
  isOpen,
  onClose
}: MaterialSelectorProps) {
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchMaterials();
    }
  }, [isOpen]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const data = await getMaterials({ status: 'ready' });
      setMaterials(data);
    } catch (error) {
      console.error('Fetch materials error:', error);
      toast.error('Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter(
    m =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMaterial = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    onSelectionChange(filteredMaterials.map(m => m._id));
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Select Course Materials</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search materials..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">
              {selectedIds.length} of {filteredMaterials.length} selected
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={selectAll}
                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Select All
              </button>
              <button
                onClick={clearAll}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Materials List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="text-center py-12">
              <Book className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-600">No materials found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMaterials.map(material => {
                const isSelected = selectedIds.includes(material._id);
                return (
                  <button
                    key={material._id}
                    onClick={() => toggleMaterial(material._id)}
                    className={`
                      w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all
                      ${isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3 flex-1 text-left">
                      {isSelected ? (
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{material.title}</p>
                        <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                          <span>{material.topic}</span>
                          <span>•</span>
                          <span>{material.chunkCount} chunks</span>
                          <span>•</span>
                          <span>{material.wordCount.toLocaleString()} words</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { CourseMaterial } from '@/lib/materialApi';
import { FileText, Clock, BookOpen, Trash2, Edit, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface MaterialCardProps {
  material: CourseMaterial;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onSelect?: (id: string) => void;
  selected?: boolean;
}

export default function MaterialCard({ material, onDelete, onEdit, onSelect, selected }: MaterialCardProps) {
  const statusConfig = {
    ready: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      label: 'Ready'
    },
    processing: {
      icon: Loader,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      label: 'Processing'
    },
    failed: {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      label: 'Failed'
    }
  };

  const status = statusConfig[material.status];
  const StatusIcon = status.icon;

  return (
    <div
      className={`
        bg-white rounded-lg border-2 p-6 hover:shadow-lg transition-all cursor-pointer
        ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}
      `}
      onClick={() => onSelect?.(material._id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{material.title}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <BookOpen className="h-4 w-4" />
            <span>{material.topic}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${status.bgColor} ${status.borderColor} border`}>
          <StatusIcon className={`h-4 w-4 ${status.color} ${material.status === 'processing' ? 'animate-spin' : ''}`} />
          <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <FileText className="h-4 w-4" />
          <span>{material.chunkCount} chunks</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="font-medium">{material.wordCount.toLocaleString()}</span>
          <span>words</span>
        </div>
      </div>

      {/* Subject */}
      {material.subject && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            {material.subject}
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>{formatDistanceToNow(new Date(material.createdAt), { addSuffix: true })}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(material._id);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="h-4 w-4 text-gray-600" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(material._id);
              }}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { CourseMaterial } from '@/lib/materialApi';
import MaterialCard from './MaterialCard';
import { FileQuestion } from 'lucide-react';

interface MaterialListProps {
  materials: CourseMaterial[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onSelect?: (id: string) => void;
  selectedIds?: string[];
  loading?: boolean;
}

export default function MaterialList({
  materials,
  onDelete,
  onEdit,
  onSelect,
  selectedIds = [],
  loading = false
}: MaterialListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-lg h-64 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="text-center py-12">
        <FileQuestion className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
        <p className="text-gray-600 mb-6">
          Upload your first course material to get started with AI-powered studying
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {materials.map((material) => (
        <MaterialCard
          key={material._id}
          material={material}
          onDelete={onDelete}
          onEdit={onEdit}
          onSelect={onSelect}
          selected={selectedIds.includes(material._id)}
        />
      ))}
    </div>
  );
}

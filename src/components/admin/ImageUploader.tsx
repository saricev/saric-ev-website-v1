'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  multiple?: boolean;
  maxImages?: number;
}

export default function ImageUploader({
  value = [],
  onChange,
  folder = 'products',
  multiple = true,
  maxImages = 10,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Upload failed');
    }

    const data = await res.json();
    return data.url as string;
  }, [folder]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remaining = maxImages - value.length;
    const toUpload = fileArray.slice(0, remaining);

    if (toUpload.length === 0) {
      setError(`Maximum ${maxImages} images allowed.`);
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadPromises = toUpload.map(upload);
      const urls = await Promise.all(uploadPromises);
      onChange([...value, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }, [value, onChange, upload, maxImages]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  }, [handleFiles]);

  const removeImage = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  const moveImage = (from: number, to: number) => {
    const newValue = [...value];
    const [moved] = newValue.splice(from, 1);
    newValue.splice(to, 0, moved);
    onChange(newValue);
  };

  return (
    <div className="space-y-3">
      {/* Image previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((url, index) => (
            <div key={url} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-square">
              <img src={url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="p-1.5 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                    title="Move left"
                  >
                    &larr;
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
                {index < value.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="p-1.5 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                    title="Move right"
                  >
                    &rarr;
                  </button>
                )}
              </div>
              {index === 0 && (
                <span className="absolute top-1 left-1 text-xs bg-primary text-white px-1.5 py-0.5 rounded">Main</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {value.length < maxImages && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-gray-50'
          }`}
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-center">
                {value.length === 0 ? (
                  <ImageIcon className="w-10 h-10 text-gray-300" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {value.length === 0 ? 'Drop images here or click to browse' : 'Add more images'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, WebP up to 10MB ({value.length}/{maxImages})
                </p>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

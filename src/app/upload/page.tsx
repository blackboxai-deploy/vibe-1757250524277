'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockDB } from '@/lib/mockDatabase';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface FilterType {
  name: string;
  displayName: string;
  filter: string;
}

const filters: FilterType[] = [
  { name: 'none', displayName: 'Normal', filter: 'none' },
  { name: 'sepia', displayName: 'Sepia', filter: 'sepia(100%)' },
  { name: 'grayscale', displayName: 'B&W', filter: 'grayscale(100%)' },
  { name: 'brightness', displayName: 'Bright', filter: 'brightness(120%)' },
  { name: 'contrast', displayName: 'Pop', filter: 'contrast(120%)' },
  { name: 'vintage', displayName: 'Vintage', filter: 'sepia(50%) contrast(110%) brightness(110%)' },
];

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) return;

    setIsUploading(true);

    try {
      // In a real app, you would upload to a cloud storage service
      // For MVP, we'll use the preview URL as the image URL
      const imageUrl = previewUrl;

      const newPost = mockDB.createPost({
        userId: user.id,
        imageUrl,
        caption: caption.trim() || undefined
      });

      if (newPost) {
        router.push('/');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setSelectedFilter('none');
    setCaption('');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Create New Post</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedFile ? (
                // File Upload Area
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-pink-400 hover:bg-gray-50"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="file-input"
                  />
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-700">
                        Drag photos here
                      </p>
                      <p className="text-gray-500 mt-2">or</p>
                      <Button 
                        type="button" 
                        className="mt-3 bg-gradient-to-r from-purple-600 to-pink-600"
                        onClick={() => document.getElementById('file-input')?.click()}
                      >
                        Select from computer
                      </Button>
                    </div>
                    <p className="text-sm text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              ) : (
                // Preview and Edit
                <div className="space-y-6">
                  {/* Image Preview */}
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-black">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-contain"
                      style={{
                        filter: filters.find(f => f.name === selectedFilter)?.filter || 'none'
                      }}
                    />
                  </div>

                  {/* Filter Options */}
                  <div>
                    <Label className="text-base font-semibold">Filters</Label>
                    <div className="flex space-x-2 mt-3 overflow-x-auto pb-2">
                      {filters.map((filter) => (
                        <button
                          key={filter.name}
                          onClick={() => setSelectedFilter(filter.name)}
                          className={`flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                            selectedFilter === filter.name
                              ? 'border-pink-500'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Image
                            src={previewUrl}
                            alt={filter.displayName}
                            fill
                            className="object-cover"
                            style={{ filter: filter.filter }}
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 text-center">
                            {filter.displayName}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Caption */}
                  <div>
                    <Label htmlFor="caption">Caption</Label>
                    <Textarea
                      id="caption"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write a caption..."
                      className="mt-1 resize-none"
                      rows={3}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {caption.length}/2200
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetUpload}
                      disabled={isUploading}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isUploading}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      {isUploading ? 'Sharing...' : 'Share'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
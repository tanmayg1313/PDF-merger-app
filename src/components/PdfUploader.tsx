'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { File, Plus, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface UploadedFile {
  file: File;
  id: string;
}

interface PdfUploaderProps {
  onFilesChange: (files: UploadedFile[]) => void;
}

export function PdfUploader({ onFilesChange }: PdfUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles
        .filter((file) => file.type === 'application/pdf')
        .map((file) => ({
          file,
          id: crypto.randomUUID(),
        }));

      if (newFiles.length < acceptedFiles.length) {
        toast.error('Some files were rejected. Only PDF files are allowed.');
      }

      if (newFiles.length > 0) {
        const updatedFiles = [...uploadedFiles, ...newFiles];
        setUploadedFiles(updatedFiles);
        onFilesChange(updatedFiles);
        toast.success(`Added ${newFiles.length} PDF files`);
      }
    },
    [uploadedFiles, onFilesChange]
  );

  const removeFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter((file) => file.id !== id);
    setUploadedFiles(updatedFiles);
    onFilesChange(updatedFiles);
    toast.info('File removed');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
  });

  return (
    <div className="w-full space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
            : 'border-zinc-700 hover:border-blue-400/50 hover:bg-blue-500/5'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
          isDragActive 
            ? 'bg-blue-500/20' 
            : 'bg-zinc-800/80'
        }`}>
          {isDragActive ? (
            <Upload className="h-8 w-8 text-blue-400" />
          ) : (
            <Plus className="h-8 w-8 text-zinc-400" />
          )}
        </div>
        
        <h3 className={`font-medium mb-2 text-lg transition-colors ${
          isDragActive ? 'text-blue-400' : 'text-zinc-200'
        }`}>
          {isDragActive ? 'Drop PDFs here' : 'Upload PDF Files'}
        </h3>
        
        <p className="text-center text-zinc-500 mb-4 max-w-md">
          {isDragActive
            ? 'Release to add them to your collection'
            : 'Drag & drop PDF files here, or click to select files from your device'}
        </p>
        
        <Button 
          variant={isDragActive ? "default" : "outline"} 
          className={`group ${isDragActive ? 'bg-blue-500 hover:bg-blue-600' : 'border-zinc-700 hover:border-blue-500/50'}`}
        >
          <Upload className="h-4 w-4 mr-2 group-hover:animate-bounce" />
          Select PDFs
        </Button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-zinc-200">
              Uploaded PDFs ({uploadedFiles.length})
            </h3>
            {uploadedFiles.length > 1 && (
              <p className="text-xs text-zinc-500">Files will be merged in the order shown below</p>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {uploadedFiles.map(({ id, file }, index) => (
              <Card key={id} className="overflow-hidden bg-zinc-800/40 border-zinc-700 hover:border-zinc-600 transition-all duration-200 group">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      {index + 1}
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-sm truncate block text-zinc-300 group-hover:text-zinc-100 transition-colors" title={file.name}>
                        {file.name}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full opacity-70 hover:opacity-100 hover:bg-red-500/20 hover:text-red-400"
                    onClick={() => removeFile(id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
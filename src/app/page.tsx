'use client';

import { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { PdfUploader } from '@/components/PdfUploader';
import { PdfMerger } from '@/components/PdfMerger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UploadedFile {
  file: File;
  id: string;
}

export default function Home() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleFilesChange = (newFiles: UploadedFile[]) => {
    setFiles(newFiles);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <main className="container mx-auto py-12 px-4 max-w-4xl">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="relative">
            <div className="flex items-center justify-center w-20 h-20 bg-blue-600/20 rounded-full mb-6 backdrop-blur-sm border border-blue-500/30 shadow-lg shadow-blue-500/20">
              <FileText className="h-9 w-9 text-blue-400" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-3">Tanmay's PDF Merger</h1>
          <p className="text-zinc-400 mt-2 max-w-xl text-lg">
            Easily combine multiple PDF files into a single document with our secure, browser-based tool.
          </p>
        </div>

        <Card className="shadow-xl bg-zinc-800/50 border-zinc-700 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 -z-10"></div>
          
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-zinc-200">Upload PDF Files</CardTitle>
            <CardDescription className="text-zinc-400">
              Drag and drop your PDFs or click to select files from your device.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <PdfUploader onFilesChange={handleFilesChange} />
            
            {files.length > 0 && (
              <div className="border-t border-zinc-700/50 pt-6">
                <PdfMerger files={files} />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-zinc-500">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-xs">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Your files never leave your browser. All processing happens locally on your device.
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-xs text-zinc-600">
        <p>Tanmay's PDF Merger | Built with Next.js, React and pdf-lib</p>
      </footer>
    </div>
  );
}

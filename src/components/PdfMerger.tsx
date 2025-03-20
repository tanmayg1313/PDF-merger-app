'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileDown, Download, DownloadCloud, FileEdit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface UploadedFile {
  file: File;
  id: string;
}

interface PdfMergerProps {
  files: UploadedFile[];
}

export function PdfMerger({ files }: PdfMergerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputFilename, setOutputFilename] = useState(`merged-document-${new Date().toISOString().slice(0, 10)}`);

  const mergePdfs = async () => {
    if (files.length === 0) {
      toast.error('Please upload at least one PDF file to merge');
      return;
    }

    // Validate filename
    let filename = outputFilename.trim();
    if (!filename) {
      filename = `merged-document-${new Date().toISOString().slice(0, 10)}`;
      setOutputFilename(filename);
    }
    
    // Make sure filename has .pdf extension
    if (!filename.toLowerCase().endsWith('.pdf')) {
      filename += '.pdf';
    }

    try {
      setIsProcessing(true);
      setProgress(0);

      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();
      
      // Process each PDF file
      for (let i = 0; i < files.length; i++) {
        const file = files[i].file;
        const fileData = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileData);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        
        // Add each page to the merged PDF
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
        
        // Update progress
        setProgress(((i + 1) / files.length) * 100);
      }

      // Save the merged PDF
      const mergedPdfBytes = await mergedPdf.save();
      
      // Create a blob from the PDF bytes
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('PDFs merged successfully!');
      setProgress(100);
    } catch (error) {
      console.error('Error merging PDFs:', error);
      toast.error('Failed to merge PDFs. Please try again.');
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
      }, 1000);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="space-y-2">
          <label htmlFor="filename" className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
            <FileEdit className="h-4 w-4" />
            Output Filename
          </label>
          <div className="relative">
            <input
              type="text"
              id="filename"
              className="w-full px-3 py-2 bg-zinc-800/60 border border-zinc-700 rounded-md text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              placeholder="Enter filename for the merged PDF"
              value={outputFilename}
              onChange={(e) => setOutputFilename(e.target.value)}
              disabled={isProcessing}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 text-sm">
              .pdf
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            Customize the name of your merged PDF file
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
        <div>
          <h3 className="text-zinc-200 font-medium mb-1">Ready to merge</h3>
          <p className="text-zinc-500 text-sm">
            {files.length} {files.length === 1 ? 'file' : 'files'} selected for merging
          </p>
        </div>
        
        <Button 
          onClick={mergePdfs} 
          disabled={isProcessing || files.length === 0}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 shadow-lg shadow-blue-900/20"
          size="lg"
        >
          {isProcessing ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <>
              <DownloadCloud className="mr-2 h-5 w-5" />
              Merge & Download PDF
            </>
          )}
        </Button>
      </div>
      
      {isProcessing && (
        <div className="space-y-2 bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
          <div className="flex justify-between text-xs text-zinc-400 mb-1">
            <span>Processing files...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full h-2" />
          <p className="text-xs text-zinc-500 mt-2">
            Merging PDF {Math.ceil((files.length * progress) / 100)} of {files.length}
          </p>
        </div>
      )}
    </div>
  );
} 
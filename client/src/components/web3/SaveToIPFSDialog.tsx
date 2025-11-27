import { useState } from "react";
import { Upload, Loader2, Check, FileCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { uploadToIPFS, type ProjectFile } from "@/lib/ipfs";
import { useToast } from "@/hooks/use-toast";

interface SaveToIPFSDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  files: ProjectFile[];
}

export function SaveToIPFSDialog({ 
  open, 
  onOpenChange, 
  projectName,
  files 
}: SaveToIPFSDialogProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ cid: string; url: string } | null>(null);
  const { isConnected, verifyOwnership } = useWalletAuth();
  const { toast } = useToast();

  const handleUpload = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Verify wallet ownership
      const authData = await verifyOwnership();
      if (!authData) {
        throw new Error('Failed to verify wallet ownership');
      }

      // Upload to IPFS
      const result = await uploadToIPFS(files, projectName);
      
      // Save to backend with signature
      await fetch('/api/projects/ipfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          cid: result.cid,
          walletAddress: authData.address,
          signature: authData.signature,
          message: authData.message,
          fileCount: files.length,
        }),
      });

      setUploadResult(result);
      toast({
        title: "Success!",
        description: "Project uploaded to IPFS",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setUploadResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {uploadResult ? <Check className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
            </div>
            {uploadResult ? 'Saved to IPFS' : 'Save to IPFS'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {uploadResult 
              ? 'Your project has been uploaded to the decentralized web.'
              : 'Upload your project to IPFS and secure it with your wallet signature.'
            }
          </DialogDescription>
        </DialogHeader>
        
        {!uploadResult ? (
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <FileCode className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">{projectName}</p>
                  <p className="text-xs text-muted-foreground">{files.length} files</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                {files.slice(0, 5).map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary/50" />
                    {file.path}
                  </div>
                ))}
                {files.length > 5 && (
                  <div className="text-muted-foreground/50">
                    ... and {files.length - 5} more files
                  </div>
                )}
              </div>
            </div>

            {!isConnected && (
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  ⚠️ Connect your wallet to save projects to IPFS
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                ✓ Project uploaded successfully!
              </p>
              <div className="space-y-2 text-xs">
                <div>
                  <p className="text-muted-foreground">IPFS CID:</p>
                  <p className="font-mono text-foreground break-all">{uploadResult.cid}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gateway URL:</p>
                  <a 
                    href={uploadResult.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {uploadResult.url}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="border-border hover:bg-secondary/50"
          >
            {uploadResult ? 'Close' : 'Cancel'}
          </Button>
          {!uploadResult && (
            <Button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || !isConnected}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:shadow-none"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload to IPFS
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

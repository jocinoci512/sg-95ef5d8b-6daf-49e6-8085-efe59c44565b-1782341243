// Document Upload Component for Shipment POD and Documents
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload, File, X, Image as ImageIcon, FileText } from "lucide-react";

interface DocumentUploadProps {
  shipmentId: string;
  onUploadComplete?: () => void;
}

interface UploadedDocument {
  id: string;
  document_type: string;
  document_name: string;
  file_path: string;
  file_size: number;
  category: string;
  created_at: string;
}

export function DocumentUpload({ shipmentId, onUploadComplete }: DocumentUploadProps) {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentCategory, setDocumentCategory] = useState<string>("proof_of_delivery");
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("shipment_documents")
        .select("*")
        .eq("shipment_id", shipmentId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      console.error("Error loading documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload JPG, PNG, WebP images or PDF documents only",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Generate unique file path
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${shipmentId}/${Date.now()}.${fileExt}`;
      const filePath = `shipment-documents/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("shipment-files")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("shipment-files")
        .getPublicUrl(filePath);

      // Save document record
      const { error: dbError } = await supabase
        .from("shipment_documents")
        .insert({
          shipment_id: shipmentId,
          document_type: selectedFile.type,
          document_name: selectedFile.name,
          file_path: publicUrl,
          file_size: selectedFile.size,
          uploaded_by: user.id,
          category: documentCategory,
        });

      if (dbError) throw dbError;

      toast({
        title: "Upload Successful",
        description: `${selectedFile.name} uploaded successfully`,
      });

      setShowDialog(false);
      setSelectedFile(null);
      loadDocuments();
      onUploadComplete?.();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string, filePath: string) => {
    try {
      // Extract file path from URL
      const urlParts = filePath.split("/shipment-documents/");
      const storagePath = urlParts[1];

      if (storagePath) {
        // Delete from storage
        await supabase.storage
          .from("shipment-files")
          .remove([`shipment-documents/${storagePath}`]);
      }

      // Delete from database
      const { error } = await supabase
        .from("shipment_documents")
        .delete()
        .eq("id", docId);

      if (error) throw error;

      toast({
        title: "Document Deleted",
        description: "Document removed successfully",
      });

      loadDocuments();
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Documents & Attachments</h3>
        <Button onClick={() => setShowDialog(true)} size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading documents...
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-start gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                {doc.document_type.startsWith("image/") ? (
                  <ImageIcon className="h-5 w-5 text-primary" />
                ) : (
                  <FileText className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{doc.document_name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {doc.category.replace(/_/g, " ")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(doc.file_size / 1024).toFixed(1)} KB
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open(doc.file_path, "_blank")}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(doc.id, doc.file_path)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload proof of delivery photos, shipping labels, or other documents
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Document Category</Label>
              <Select value={documentCategory} onValueChange={setDocumentCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proof_of_delivery">Proof of Delivery</SelectItem>
                  <SelectItem value="delivery_photo">Delivery Photo</SelectItem>
                  <SelectItem value="shipping_label">Shipping Label</SelectItem>
                  <SelectItem value="bill_of_lading">Bill of Lading</SelectItem>
                  <SelectItem value="customs_document">Customs Document</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="package_image">Package Image</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Select File</Label>
              <Input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                onChange={handleFileSelect}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Accepted: JPG, PNG, WebP, PDF (Max 10MB)
              </p>
            </div>

            {selectedFile && (
              <div className="p-3 bg-muted rounded border border-border">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
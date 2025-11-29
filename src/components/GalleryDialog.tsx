import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { galleryStore, GalleryImage } from "@/lib/galleryStore";
import { toast } from "sonner";
import { X } from "lucide-react";

interface GalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GalleryDialog = ({ open, onOpenChange }: GalleryDialogProps) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    if (open) {
      loadImages();
    }
  }, [open]);

  const loadImages = async () => {
    setLoading(true);
    const galleryImages = await galleryStore.getImages();
    setImages(galleryImages);
    setLoading(false);

    if (galleryImages.length === 0) {
      toast.info("No images in gallery yet");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Gallery Album</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No images in the gallery yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.image_url}
                    alt={image.title || "Gallery image"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/400x400?text=Image+Not+Found";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {image.title && (
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-sm font-semibold truncate">{image.title}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Full Screen Image View */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-7xl max-h-[95vh] p-0 overflow-hidden">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            <div className="relative w-full h-[95vh] flex items-center justify-center bg-black">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title || "Gallery image"}
                className="max-w-full max-h-full object-contain"
              />
              {selectedImage.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="text-white text-xl font-semibold">{selectedImage.title}</h3>
                  {selectedImage.description && (
                    <p className="text-white/80 text-sm mt-1">{selectedImage.description}</p>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default GalleryDialog;

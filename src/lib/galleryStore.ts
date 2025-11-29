import { supabase } from '@/integrations/supabase/client';

export interface GalleryImage {
  id: string;
  image_url: string;
  title?: string;
  description?: string;
  display_order: number;
  created_at: string;
}

export const galleryStore = {
  async getImages(): Promise<GalleryImage[]> {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching gallery images:', error);
      return [];
    }

    return data || [];
  },

  async addImage(imageData: { image_url: string; title?: string; display_order?: number }): Promise<GalleryImage | null> {
    const { data, error } = await supabase
      .from('gallery')
      .insert({
        image_url: imageData.image_url,
        title: imageData.title,
        display_order: imageData.display_order || 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding gallery image:', error);
      return null;
    }

    return data;
  },

  async deleteImage(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting gallery image:', error);
      return false;
    }

    return true;
  },
};

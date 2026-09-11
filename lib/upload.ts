export interface UploadResult {
  url: string;
  display_url?: string;
  thumb_url?: string;
  delete_url?: string;
}

const IMGBB_API_KEY =
  process.env.NEXT_PUBLIC_IMGBB_API_KEY || '7a72f02b65e930275334abe25b3c27d0';

/**
 * Uploads an image file to ImgBB via the project API or direct client fallback
 * using API Key: 7a72f02b65e930275334abe25b3c27d0
 */
export async function uploadImageToImgBB(file: File): Promise<UploadResult> {
  // 1. Try Next.js server route /api/upload
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.url) {
        return {
          url: json.url,
          display_url: json.display_url,
          thumb_url: json.thumb_url,
          delete_url: json.delete_url,
        };
      }
    }
  } catch (err) {
    console.warn('Server upload endpoint error, falling back to direct ImgBB:', err);
  }

  // 2. Direct browser upload fallback to ImgBB
  const directFormData = new FormData();
  directFormData.append('image', file);

  const directRes = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    {
      method: 'POST',
      body: directFormData,
    }
  );

  const directJson = await directRes.json();
  if (!directRes.ok || !directJson.success) {
    throw new Error(directJson?.error?.message || 'Failed to upload image to ImgBB');
  }

  return {
    url: directJson.data.url,
    display_url: directJson.data.display_url,
    thumb_url: directJson.data.thumb?.url || directJson.data.url,
    delete_url: directJson.data.delete_url,
  };
}

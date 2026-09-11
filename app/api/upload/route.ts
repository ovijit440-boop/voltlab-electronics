import { NextRequest, NextResponse } from 'next/server';

const IMGBB_API_KEY = process.env.IMGBB_API_KEY || '7a72f02b65e930275334abe25b3c27d0';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const imageParam = formData.get('image') as File | string | null;

    const uploadTarget = file || imageParam;

    if (!uploadTarget) {
      return NextResponse.json(
        { success: false, error: 'No image file or data provided for upload' },
        { status: 400 }
      );
    }

    // Build form data for ImgBB API
    const imgbbForm = new FormData();
    if (typeof uploadTarget === 'string') {
      imgbbForm.append('image', uploadTarget);
    } else {
      // File object
      imgbbForm.append('image', uploadTarget);
    }

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: imgbbForm,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json(
        {
          success: false,
          error: data?.error?.message || 'ImgBB upload failed',
          status: response.status,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      url: data.data.url,
      display_url: data.data.display_url,
      thumb_url: data.data.thumb?.url || data.data.url,
      delete_url: data.data.delete_url,
      width: data.data.width,
      height: data.data.height,
      size: data.data.size,
    });
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Server error uploading image to ImgBB',
      },
      { status: 500 }
    );
  }
}

import { NextRequest } from "next/server";
import ytdl from "ytdl-core";

export async function GET(request: NextRequest) {
  try {
    const videoId = request.nextUrl.searchParams.get("videoId");
    const quality = request.nextUrl.searchParams.get("quality");
    
    if (!videoId) {
      return new Response("Video ID is required", { status: 400 });
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const info = await ytdl.getInfo(videoUrl);
    
    // Get available formats with both video and audio
    const formats = ytdl.filterFormats(info.formats, "video");
    
    // Sort formats by quality (height)
    formats.sort((a, b) => (b.height || 0) - (a.height || 0));
    
    // Find the format that matches the requested quality or get the closest lower quality
    const requestedHeight = parseInt(quality?.replace("p", "") || "");
    const format = formats.find(f => f.height === requestedHeight) || 
                  formats.find(f => f.height && f.height < requestedHeight) ||
                  formats[0];

    const stream = ytdl(videoUrl, { format });
    
    // Set headers for the response
    const sanitizedTitle = info.videoDetails.title.replace(/[^\w\s]/gi, "");
    const headersList = new Headers();
    headersList.set("Content-Disposition", `attachment; filename="${sanitizedTitle}.mp4"`);
    headersList.set("Content-Type", "video/mp4");
    
    return new Response(stream as any, {
      headers: headersList,
    });
  } catch (error) {
    console.error("Error downloading video:", error);
    return new Response("Failed to download video", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import ytdl from "ytdl-core";

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export async function GET(request: NextRequest) {
  try {
    const videoId = request.nextUrl.searchParams.get("videoId");
    
    if (!videoId) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const info = await ytdl.getInfo(videoUrl);
    
    // Get available formats with both video and audio
    const formats = ytdl.filterFormats(info.formats, "video");
    
    // Get unique qualities
    const qualities = [...new Set(formats
      .filter(format => format.height)
      .map(format => `${format.height}p`))
    ].sort((a, b) => parseInt(b) - parseInt(a));
    
    const videoInfo = {
      id: videoId,
      url: videoUrl,
      title: info.videoDetails.title,
      description: info.videoDetails.shortDescription,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
      duration: formatDuration(parseInt(info.videoDetails.lengthSeconds)),
      channel: info.videoDetails.author.name,
      qualities: qualities
    };
    
    return NextResponse.json(videoInfo);
  } catch (error) {
    console.error("Error fetching video info:", error);
    return NextResponse.json({ error: "Failed to fetch video information" }, { status: 500 });
  }
}
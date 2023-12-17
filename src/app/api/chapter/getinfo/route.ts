// /api/chapter/getInto

import { prisma } from "@/lib/db";
import {

  getTranscript,
  searchYoutube,
} from "@/lib/actions/youtube";
import { NextResponse } from "next/server";
import { z } from "zod";
import { strict_output } from "@/lib/actions/gpt";

const bodyParser = z.object({
  chapterId: z.string()
})

export async function POST (req:Request, res:Response) {
  try {
    const body = await req.json()
    const { chapterId } = bodyParser.parse(body)
    const chapter = await prisma.chapter.findUnique({
      where : {
        id: chapterId,
      }
    })
    if(!chapter) {
      return NextResponse.json({success:false, error:"Chapter not found"}, {status:400})
    }

    const videoId = await searchYoutube(chapter.youtubeSearchQuery)
    let transcript = await getTranscript(videoId)
    let maxLength = 500;
    transcript = transcript.split('').slice(0,maxLength).join("")

    const { summary }: {summary:string} = await strict_output(
      "You are an AI capable of summarising a youtube transcript",
      "summarise in 250 words or less and do not talk of the sponsors or anything unrelated to the main topic, also do not introduce what the summary is about.\n" + transcript,
      {summary: "summary of the transcript"}
    )

    await prisma.chapter.update({
      where : {id:chapterId},
      data  : {
        videoId: videoId,
        summary: summary,
      }
    })

    return NextResponse({success:true}, {status:200})
    
  } catch (error) {
      if(error instanceof z.ZodError) {
        return NextResponse({
          success:false,
          error: "Invalid body"
        },
        {status: 400}
        )
      } else {
        return NextResponse.json(
          {
          success: false,
          error: "unknown"
        },
        {status : 500 }
        )
      }
    
  }
}


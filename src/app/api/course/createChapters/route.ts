// /api/course/createChapters

import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { createChaptersSchema } from "@/validators/course";
// import { checkSubscription } from "@/lib/subscription";
import { prisma } from "@/lib/db";
import { ZodError } from "zod";
import { getUnsplashImage } from "@/lib/actions/unsplash";
import { strict_output } from "@/lib/actions/gpt"

export async function POST(req: Request, res: Response) {
    try 
    {
        // User state if
        const session = await getAuthSession();
        if (!session?.user) {
            return new NextResponse("unauthorised", { status: 401 });
        }
        // const isPro = await checkSubscription()
        // if (session.user.credits <= 0 && !isPro) {
        //     return new NextResponse("no credits", { status: 402 });
        //   }

        const body = await req.json()
        console.log('body',body)
        const { title, units } = createChaptersSchema.parse(body)
        console.log(title, units)

        type outputUnits = {
            title: string;
            chapters: {
              youtube_search_query: string;
              chapter_title: string;
            }[];
          }[];
            
        let output_units: outputUnits = await strict_output(
          "You are an AI capable of curating course content, coming up with relevant chapter titles, and finding relevant youtube videos for each chapter",
          new Array(units.length).fill(
            `It is your job to create a course about ${title}. The user has requested to create chapters for each of the units. Then, for each chapter, provide a detailed youtube search query that can be used to find an informative educationalvideo for each chapter. Each query should give an educational informative course in youtube.`
          ),
          {
            title: "title of the unit",
            chapters:
              "an array of chapters, each chapter should have a youtube_search_query and a chapter_title key in the JSON object",
          }
        );

        const imageSearchTerm = await strict_output(
          "you are an AI capable of finding the most relevant image for a course",
          `Please provide a good image search term for the title of a course about ${title}. This search term will be fed into the unsplash API, so make sure it is a good search term that will return good results`,
          {
            image_search_term: "a good search term for the title of the course",
          }
        );
        // Create
        const course_image = await getUnsplashImage(
            imageSearchTerm.image_search_term
        );

        const course = await prisma.course.create({
            data: {
                name: title,
                image: course_image,
            }
        })

        // Create Units
        for (let unit of output_units) {
            const newUnit = await prisma.unit.create({
                data: {
                    name: unit.title,
                    courseId: course.id
                }
            })
            // Create Chapters
            await prisma.chapter.createMany({
                data: unit.chapters.map((chapter) => {
                return {
                    name: chapter.chapter_title,
                    youtubeSearchQuery: chapter.youtube_search_query,
                    unitId: newUnit.id,
                };
                }),
            });
        }
        // User point decrement
        await prisma.user.update({
            where: {
              id: session?.user.id,
            },
            data: {
              credits: {
                decrement: 1,
              },
            },
        });
        console.log(course);
        console.log(course.id);

        return NextResponse.json({ course_id: course.id });
    }
    catch(error) {
        if (error instanceof ZodError) {
            return new NextResponse("invalid body", { status: 400 });
        }
        console.error(error)
        return new NextResponse("unknown", {status:500})
    }
}
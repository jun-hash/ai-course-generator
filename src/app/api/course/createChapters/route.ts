import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { createChaptersSchema } from "@/validators/course";
// import { checkSubscription } from "@/lib/subscription";
import { prisma } from "@/lib/db";
import { getUnsplashImage } from "@/lib/actions/unsplash";

export async function POST(req: Request, res: Response) {
    try {
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
        const { title, units } = createChaptersSchema.parse(body)

        //outputUnits Logic -gpt


        // Create
        // const course_image = await getUnsplashImage(
        //     imageSearchTerm.image_search_term
        //   );

        const course = awiat prisma.course.create({
            data: {
                name: title,
                image: course_image,
            }
        })

    } catch(error) {

    }
}
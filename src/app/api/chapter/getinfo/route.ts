// /api/chapter/getInto

import { prisma } from "@/lib/db";
import {

  searchYoutube,
} from "@/lib/actions/youtube";
import { NextResponse } from "next/server";
import { z } from "zod";


// flow chart

// 1. find chapter (id) -> 2. chatpter.query -> get video(search and get => videoid)
// => chapter update (videoid,summary)
// => get transcript (chaper에 추가)


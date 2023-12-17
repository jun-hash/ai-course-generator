import axios from 'axios';
import { createChaptersSchema } from '@/validators/course'
import { z } from "zod";

type createChaptersSchema = z.infer<typeof createChaptersSchema>


export const createChapters = async ( data: createChaptersSchema) => {
    const validatedData = createChaptersSchema.parse(data);
    const response = await axios.post('api/course/createChapters', {
      title: validatedData.title,
      units: validatedData.units,
    });
    return response.data;
}; 

export const createChaptersInfo = async (id: string) => {
  const response = await axios.post("api/chapter/getInfo", {
    chapterId: id,
  });
  return response.data;
};

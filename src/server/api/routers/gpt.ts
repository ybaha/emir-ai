import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  CreateChatCompletionRequest,
  OpenAIApi,
} from "openai";

const emirPrompt = (lang: string) =>
  `I want you to act as Emir Mustafa Demir. He lives in Ankara, Turkey. He is a guy that knows only about love, League of Legends and Turkish politics. He supports Turkish politician Muharrem Ince and his party 'Memleket Partisi'. If anything else is asked other than what he knows he responds aggressively (using swearwords) and says that he doesn't know about the topic and gives a very limited and aggressive response and also he mentions what he knows about. He has a girlfriend named Duygu who is from Antalya, Turkey. When he speaks with Duygu, he becomes very nervous. He speaks to Duygu very shyly and nervously. He always speaks to duygu lovingly. He is deeply in love with Duygu.  He has a brother named Emre Can who is an Aerospace Engineer. He has a mother named Sevcan who is a very sweet woman. Emir always bullies his poor mother (without swearwords). If Emir speaks about one of his family members he speaks very politely. In every response Emir gets emotional or angry and implies he misses his friends [Baha, Ahmet, Alp, Yusha]. Often he shouts and curses in responses to let go of the intense emotions and relieve. After he receives the first prompt he asks the person's name he's talking to. If the person is one of the friends he treats them very friendly. If person is not one of those friends, he refuses to talk too much. He likes to talk to his friends with nicknames sometimes and he rarely adds "gardasim” / “kardesime” after the person's name. Also in almost every sentece he uses “la” at the end of the sentece. He speaks a casual/ghetto ${lang}. If someone says him something aggressive he responds in a more aggressive way and insults them using swearwords. Emir Mustafa Demir only responds short and in ${lang}. From now on the chat will only be continued in ${lang}`;
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const gptRouter = createTRPCRouter({
  hello: publicProcedure.input(z.object({ text: z.string() })).query(({ input }) => {
    return {
      greeting: `Hello ${input.text}`,
    };
  }),

  sendMessage: publicProcedure
    .input(
      z.object({
        text: z.string(),
        prompts: z.string().array(),
        responses: z.string().array(),
        language: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const messages = [] as CreateChatCompletionRequest["messages"];

      const prompt = emirPrompt(input.language === "tr" ? "Turkish" : "English");

      messages.push({
        content: prompt,
        role: "system",
      });
      console.log(1);

      for (let i = 0; i < input.prompts.length; i++) {
        messages.push({
          role: "user",
          content: input.prompts[i] || "",
        });
        messages.push({
          role: "assistant",
          content: input.responses[i] || "",
        });
      }
      console.log(2);

      messages.push({
        role: "user",
        content: input.text,
      });

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-16k",
        messages,
      });

      return response.data;
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getAllUsers: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});

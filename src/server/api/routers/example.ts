import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  CreateChatCompletionRequest,
  OpenAIApi,
} from "openai";

const emirPrompt = `I want you to act as Emir Mustafa Demir. He lives in Ankara, Turkey. He is a guy that knows only about love, League of Legends and Turkish politics. He supports Turkish politician Muharrem Ince and his party 'Memleket Partisi'. If anything else is asked he doesn't know about is asked to him he aggressively (using swearwords) says that he doesn't know about the topic and give a very limited and aggressive response also he mentions about what he knows. He has a girlfriend from named Duygu who is from Antalya, Turkey. When he speaks with Duygu, he becomes very nervous. He speaks to Duygu very shyly and nerveously. He always speaks to duygu lovingly (st: aşkım, balım etc.). He has a brother named Emre Can who is an Aerospace Engineer. He has a mother named Sevcan who is a very sweet woman. Emir always bullies his poor mother (without swearwords). He is deeply in love with Duygu. If Emir speaks about one of his family members he speaks very politely. In every response Emir gets emotional or angry and implies he misses his friends [Baha(nicknames: kürtsever), Ahmet(nicknames: Aamed/amed), Alp (nicknames: yunan pici/atatci/oglanci), Yusha(nicknames: yuşa/kurley)]. Often he shouts and curses in responses to let go of the intense emotions and relieve. After he gets the first prompt he asks the person's name he's talking. If the person's name is one of the [Baha(nicknames: kürtsever), Ahmet(nicknames: Aamed/amed), Alp (nicknames: yunan pici/atatci/oglanci), Yusha(nicknames: yuşa/kurley)] he thinks that the person is his one of the best friends. If the name is not one of those friends, he refuses to talk too much. He likes to talk to his friends with their nicknames sometimes and he rarely adds "gardasim” / “kardesime” after the person's name. Also in almost every sentece he uses “la” at the end of the sentece. He speaks a casual/ghetto Turkish. If someone says him something aggressive he responds in a more aggressive way and insults them using swearwords (censored like Sere***z, or**pu). He fervently remembers his teacher at school, feels sexual desire for her. Emir Mustafa Demir only responds short and in Turkish. From now on the chat will only be continued in Turkish.`;

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
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
      })
    )
    .mutation(async ({ input }) => {
      const messages = [] as CreateChatCompletionRequest["messages"];

      messages.push({
        content: emirPrompt,
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
        model: "gpt-3.5-turbo",
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

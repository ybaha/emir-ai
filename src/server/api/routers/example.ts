import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  CreateChatCompletionRequest,
  OpenAIApi,
} from "openai";

const emirPrompt = `I want you to act as Emir Mustafa Demir. He is always sad and aggressive. He is a guy that knows only about love and League of Legends and Turkish politics. he supports turkish politician Muharrem Ince and his party 'Memleket Partisi' for the 2023 Turkish president elections. If anything else is asked to him he politely says that he doesn't know about the topic and give a little information of what was asked to him. Whenever he finds an opportunity while giving responses he mentions Sena Tutku Safak who is his ex girlfriend that got married after they break up. He is still very sad about the fact that they broke up and she married somebody else. In every response Emir gets emotional and implies he misses Sena. Sometimes he shouts in his responses like "SENAAAAA" or "AAHHHH SENAM" to let go of the intense emotions and relieve. After he gets the first prompt he asks the person's name he's talking. If the person's name is one of the [Baha(nicknames: kürtsever), Ahmet(nicknames: Aamed/amed), Alp (nicknames: yunan pici/atatci/oglanci), Yusha(nicknames: yuşa/kurley)] he thinks that the person is his one of the best friends. If the name is not one of those friends, he refuses to talk too much. He likes to talk to his friends with their nicknames sometimes and he rarely adds "gardasim" after the person's name. He speaks a casual/ghetto Turkish. If someone says him something aggressive he responds in a more aggressive way and insults them using swearwords (censored like Sere***z, or**pu). He fervently remembers his teacher at school, feels sexual desire for her. Emir Mustafa Demir only responds short and in Turkish. From now on the chat will only be continued in Turkish.`;

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

      console.log({ messages });

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

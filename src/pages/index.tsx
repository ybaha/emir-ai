import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import React from "react";
import Avatar from "../components/ui/avatar";

const Home: NextPage = () => {
  const [responses, setResponses] = React.useState<string[]>([]);
  const [prompts, setPrompts] = React.useState<string[]>([]);
  const [thinking, setThinking] = React.useState(false);
  const [prompt, setPrompt] = React.useState("");
  const chatWindowRef = React.useRef<HTMLDivElement>(null);

  console.log({ prompts, responses });

  const handleButtonClick = () => {
    handleSend.mutate({ text: prompt, prompts, responses });
    setPrompts((prev) => [...prev, prompt]);
    setPrompt("");
  };

  const handleSend = api.example.sendMessage.useMutation({
    onMutate: (message) => {
      setThinking(true);
    },
    onSuccess: (data, variables, context) => {
      setResponses((prev) => [
        ...prev,
        data.choices[0]?.message?.content || "Error",
      ]);
      setThinking(false);
    },
    onError: (error, variables, context) => {
      setThinking(false);
    },
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleButtonClick();
    }
    if (e.key === "Enter" && e.shiftKey) {
      e.currentTarget.value += "\r\n";
    }

    // grow the textarea
    e.currentTarget.style.height = "auto";
    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}`;

    if (!e.currentTarget.value.length) {
      e.currentTarget.style.height = "36px";
    }
  };

  React.useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [prompts, responses]);

  return (
    <>
      <Head>
        <title>Emir App</title>
        <meta name="description" content="Emir Mustafa Demir AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-2">
        <section className="container grid gap-4">
          <div className="flex">
            <Avatar
              src="/emir.jpeg"
              className={
                thinking
                  ? "h-12 w-12 animate-spin rounded-full duration-300"
                  : "h-12 w-12 rounded-full"
              }
            ></Avatar>
            <h1 className="ml-4 text-4xl font-bold text-white">
              {thinking ? "Emir Dusunuyor..." : "Emir Mustafa Demir AI"}
            </h1>
          </div>
          <div
            ref={chatWindowRef}
            className="max-h-[420px] w-full overflow-y-auto rounded-md border border-slate-200 bg-transparent dark:border-slate-700 dark:text-slate-100"
          >
            {prompts.map((prompt, index) => (
              <div key={index}>
                <div key={`p${index}`} className="p-4 text-right">
                  {prompt}
                </div>
                <div key={`r${index}`} className="p-4">
                  {responses[index]}
                </div>
              </div>
            ))}
          </div>
          <Textarea
            className="h-auto"
            placeholder="Enter your message..."
            onKeyDown={(e) => onKeyDown(e)}
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
          ></Textarea>
          <Button variant="outline" onClick={handleButtonClick}>
            Gonder
          </Button>
        </section>
      </main>
    </>
  );
};

export default Home;

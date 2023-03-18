import { type NextPage } from "next";
import { api } from "../utils/api";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import React from "react";
import Avatar from "../components/ui/avatar";
import Meta from "@/src/utils/meta";

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
      console.log({ error });
    },
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.currentTarget.value += "\r\n";
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleButtonClick();
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
      <Meta
        title="Emir Mustafa Demir AI - The Aggressive Lover of League of Legends and Turkish Politics"
        description="Meet Emir Mustafa Demir, a character AI who is always aggressive and passionate about love, League of Legends, and Turkish politics. He supports the Memleket Partisi and fervently remembers his ex-girlfriend Sena. Talk to him about these topics and watch his emotions run wild. He also loves talking to his best friends Baha, Ahmet, Alp, and Yusha, but beware of his fiery temper and profanity-laden insults. Interact with Emir Mustafa Demir AI and experience a unique and entertaining conversation."
        image="/emir.jpeg"
        url="https://emir-ai.vercel.app"
      />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-2">
        <section className="container grid max-w-[640px] gap-4">
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
                <div key={`p${index}`} className="p-4 text-right text-gray-400">
                  {prompt}
                </div>
                <div key={`r${index}`} className="p-4 text-gray-300">
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
          <Button
            variant="outline"
            onClick={handleButtonClick}
            className="text-gray-200"
          >
            Gonder
          </Button>
        </section>
      </main>
    </>
  );
};

export default Home;

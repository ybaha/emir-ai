import React from "react";
import Layout from "@/components/layout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Dropzone from "@/components/dropzone";
import { api } from "@/utils/api";

type Props = {};

const Create = (props: Props) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [name, setName] = React.useState("");
  const [prompt, setPrompt] = React.useState("");

  const onCreate = () => {
    if (name === "") return alert("Please input name");
    if (prompt === "") return alert("Please input prompt");
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-white">Create your AI character</h1>
      <label className="text-white" htmlFor="name">
        Name
      </label>
      <Input id="name" placeholder="Jennifer AI"></Input>
      <label className="text-white" htmlFor="prompt">
        Prompt
      </label>
      <Textarea
        id="prompt"
        placeholder="Act as Jeniffer who is a witty girl..."
        default
        className="border-slate-700 text-white"
      ></Textarea>
      <label className="text-white" htmlFor="Image">
        Image
      </label>
      {files.length > 0 ? (
        <div className="flex items-center">
          <img
            src={URL.createObjectURL(files[0]!)}
            alt="image"
            className="h-32 w-32 rounded-md object-cover"
          />
          <Button className="ml-8" onClick={() => setFiles([])}>
            Remove
          </Button>
        </div>
      ) : (
        <Dropzone files={files} setFiles={setFiles} />
      )}
      <Button>Create</Button>
    </Layout>
  );
};

export default Create;

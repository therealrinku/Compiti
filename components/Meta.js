import Head from "next/head";

export default function Meta({ title, description }) {
  return (
    <Head>
      <title>{title}</title>
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      <link rel="shortcut icon" href="https://img.icons8.com/bubbles/2x/todo-list.png" />
      <meta name="description" content={description} />
    </Head>
  );
}

Meta.defaultProps = {
  title: "doit",
  description: "Your daily task manager.",
};

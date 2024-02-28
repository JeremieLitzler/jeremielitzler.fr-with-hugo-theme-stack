import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "master";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "static",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "static",
    },
  },

  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content/post",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
          },
          {
            type: "image",
            name: "image",
            label: "Image Url",
            required: true,
          },
          {
            type: "string",
            name: "imageAlt",
            label: "Image Alt text",
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Publishing date",
            required: true,
          },
          {
            label: "Categories",
            name: "categories",
            type: "string",
            list: true,
            options: [
              { value: "Jardin", label: "Développement Web" },
              { value: "Plantes", label: "Plantes" },
              { value: "Energie", label: "Energie" },
              { value: "Tutoriels", label: "Tutoriels" },
              { value: "Santé", label: "Santé" },
              { value: "Entreprenariat", label: "Entreprenariat" },
              { value: "Témoignages", label: "Témoignages" },
              { value: "Avis de produits", label: "Avis de produits" },
              { value: "Alimentation", label: "Alimentation" },
            ],
          },
          {
            label: "Tags",
            name: "tags",
            type: "string",
            list: true,
            options: [
              { value: "Damien Dekarz", label: "Damien Dekarz" },
              { value: "Christophe Bernard", label: "Christophe Bernard" },
              { value: "Chemin de la Nature", label: "Chemin de la Nature" },
              { value: "Ortie", label: "Ortie" },
              { value: "Photovoltaique", label: "Photovoltaique" },
              { value: "Autoconsommation", label: "Autoconsommation" },
              { value: "Plantes sauvages", label: "Plantes sauvages" },
              { value: "Web", label: "Web" },
              { value: "Astuce du jour", label: "Astuce du jour" },
              { value: "Eau chaude sanitaire", label: "Eau chaude sanitaire" },
            ],
          },
          {
            type: "string",
            name: "relcanonical",
            label: "Custom canonical link",
            required: false,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});

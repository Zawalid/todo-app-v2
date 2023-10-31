import { Client, Databases, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("65411746602fd2b0555b"); 

export const account = new Account(client);
export const databases = new Databases(client);


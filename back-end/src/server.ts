import express from "express";
import { env } from "./config/env";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// TODO: registrar rotas dos módulos (auth, appointments, billing, public-api...)

app.listen(env.port, () => {
  console.log(`API rodando em http://localhost:${env.port}`);
});

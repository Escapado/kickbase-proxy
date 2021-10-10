import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import axiod from "https://deno.land/x/axiod/mod.ts";

const port = 8000;
const app = new Application();

const router = new Router();

router.post("/", async (ctx) => {
  const { token, url, params, type } = await ctx.request.body({ type: "json" })
    .value;
  ctx.response.headers.set("Content-Type", "application/json");
  if (type === "POST") {
    ctx.response.body = await axiod.post(
      url,
      { ...params },
      token
        ? {
            headers: {
              Cookie: `kkstrauth=${token}`,
            },
          }
        : undefined
    );
  } else {
    ctx.response.body = await axiod.get(
      url,
      token
        ? {
            headers: {
              Cookie: `kkstrauth=${token}`,
            },
          }
        : undefined
    );
  }
});

app.use(router.allowedMethods());
app.use((ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set("Access-Control-Allow-Headers", "*");
  return next();
});
app.use(router.routes());

app.addEventListener("listen", () => {
  console.log(`Listening on port: ${port}`);
});

await app.listen({ port });

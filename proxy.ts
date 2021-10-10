import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import axiod from "https://deno.land/x/axiod/mod.ts";

const app = new Application();
const router = new Router();

router.post("/", async (ctx) => {
  const { token, url, params, type } = await ctx.request.body({ type: "json" })
    .value;
  try {
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
    console.log(ctx.response.status);
  } catch (e) {
    console.error("Error encountered", e);
  }
});

app.use(oakCors({ origin: true }));
app.use(router.routes());

await app.listen({ port: 8000 });

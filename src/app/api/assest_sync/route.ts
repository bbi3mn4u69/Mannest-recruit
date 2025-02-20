import { NextResponse } from "next/server";

export async function GET() {
  const requestUrl = "https://669ce22d15704bb0e304842d.mockapi.io/assets";

  for (let i = 0; i <= 3; i++) {
    try {
      const res = await fetch(requestUrl);

      if (!res.ok) {
        if (i === 3) {
          throw new Error("API is not reachable");
        }
        await Promise.all([
          new Promise((resolve) => setTimeout(resolve, 2000)),
        ]);
        continue;
      } else {
        const data = await res.json();
        return NextResponse.json({ message: "success", content: data });
      }
    } catch (e) {
      console.log(e);
    }
  }
  return NextResponse.json({ message: "fail", content: null });
}

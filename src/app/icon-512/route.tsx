import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          fontSize: 380,
        }}
      >
        <div
          style={{
            width: 430,
            height: 430,
            borderRadius: "50%",
            background: "#22c55e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ⚽
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}

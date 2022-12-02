import Card from "./Card";
import dynamic from "next/dynamic";

const CircularProgress = dynamic(() => import("./Progress/CircularProgress"), {
  ssr: false,
});

export default function LabelCard(props: {
  title: string;
  description: string;
  value: number;
}) {
  const colors = [
    "#6bc4abc7",
    "#6b8ac4c7",
    "#a46bc4c7",
    "#c4be6bc7",
    "#a46bc4c7",
  ];
  return (
    <Card
      extraStyles="min-width: 27vw"
      backgroundColor={colors[Math.floor(Math.random() * colors.length)]}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <span style={{ flexBasis: "30%" }}>
          <CircularProgress
            value={props.value}
            showValue
            id={
              "progActivity" +
              props.title.replace(" ", "") +
              Math.random() * 100
            }
            dimension={80}
            lineWidth={4}
            offSet={-90}
            colors={{ stroke: "#fff6", backgroundTrack: "#0001" }}
          />
        </span>
        <div style={{ flexBasis: "70%" }}>
          <h3>{props.title}</h3>
          <p style={{ color: "#fff6" }}>{props.description}</p>
        </div>
      </div>
    </Card>
  );
}

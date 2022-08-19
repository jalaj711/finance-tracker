import Head from "next/head";
import dynamic from "next/dynamic";
import Button from "../components/Button";
import { faPause, faStop } from "@fortawesome/free-solid-svg-icons";

const PerfProgress = dynamic(
  () => import("../components/Progress/performanceProgress"),
  {
    ssr: false,
  }
);

const PerfItem = (props: {
  title: string;
  value: string | number;
  outof: string | number;
  percentage: string | number;
}) => {
  return (
    <>
      <div className="perfItemContainer">
        <span className="perfItemTitle">{props.title}</span>
        <span className="perfItemPercentage">{props.percentage}%</span>
        <span>
          <span className="perfItemAbsoluteValue">{props.value}</span>
          <span className="perfItemAbsoluteOutOf"> / {props.outof}</span>
        </span>
      </div>
      <style jsx>{`
        .perfItemContainer {
          display: flex;
          flex-direction: column;
          padding: 8px;
          text-align: center;
        }

        .perfItemTitle {
          text-transform: uppercase;
          font-size: small;
          color: rgb(150, 150, 150);
        }

        .perfItemPercentage {
          color: white;
          font-size: x-large;
        }

        .perfItemAbsoluteValue {
          color: white;
          font-size: smaller;
        }

        .perfItemAbsoluteOutOf {
          color: rgb(150, 150, 150);
          font-size: x-small;
        }
      `}</style>
    </>
  );
};

function Performance() {
  return (
    <>
      <Head>
        <title>Perform</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="perfProgress">
          <PerfProgress value={77.7} />
          <div className="perfStats">
            <div className="perfDone">35m 46s</div>
            <div style={{ display: "inline-flex" }}>
              <Button icon={faStop} fullRadius outlined>
                Stop
              </Button>
              <Button icon={faPause} fullRadius>
                Pause
              </Button>
            </div>
            <div style={{ display: "inline-flex", marginTop: '12px' }}>
              <PerfItem
                title="today"
                value="35m"
                outof="45m"
                percentage="77.7"
              />
              <PerfItem
                title="weekly"
                value="02h 29m"
                outof="05hrs"
                percentage="50"
              />
              <PerfItem
                title="monthly"
                value="04h 15m"
                outof="20hrs"
                percentage="22.5"
              />
            </div>
          </div>
        </div>
      </main>

      <style jsx>
        {`
          .perfProgress {
            top: 50%;
            left: 50%;
            position: fixed;
            transform: translateY(-50%);
            width: 50vw;
          }

          .perfStats {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-30%, -30%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .perfDone {
            font-size: 56px;
            color: white;
          }
        `}
      </style>
    </>
  );
}

export default Performance;

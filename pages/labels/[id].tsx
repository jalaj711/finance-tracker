import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faAngleRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import TransactionCard from "../../components/TransactionCard";
import Button from "../../components/Button";
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  Tooltip,
} from "recharts";
import colors from "../../utils/colors";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { showGlobalLoader, hideGlobalLoader } from "../../components/GlobalLoader/loaderSlice";
import URLs, { API_BASE } from "../../utils/endpoints";
import { useAppDispatch, useAppSelector } from "../../utils/reduxHooks";
import { TransactionType, LabelType } from "../../utils/types";

function Label() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const [labelStats, setLabelStats] = useState<{
    label: LabelType;
    recents: TransactionType[];
    daily: { day: number; spent: number; count: number }[];
    weekly: { week: number; spent: number; count: number }[];
    monthly: { month: number; spent: number; count: number }[];
    transactions: {
      today: { day: number; spent: number; count: number }[];
      this_week: { week: number; spent: number; count: number }[];
      this_month: { month: number; spent: number; count: number }[];
    };
  } | null>(null);

  useEffect(() => {
    dispatch(showGlobalLoader());
    fetch(API_BASE + URLs.LABELS.STATS + "?label=" + router.query.id, {
      headers: {
        Authorization: "Token " + auth.token,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        res.data.daily.sort((d1: any, d2: any) => (d1.day > d2.day ? 1 : -1));
        res.data.weekly.sort((w1: any, w2: any) => (w1.week > w2.week ? 1 : -1));
        res.data.monthly.sort((m1: any, m2: any) => (m1.month >m2.month? 1 : -1));
        dispatch(hideGlobalLoader());
        setLabelStats(res.data);
      });
  }, [auth, dispatch]);
  return labelStats && (
    <>
      <Head>
        <title>{labelStats.label.name}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="mainWrapper">
          <h1>{labelStats.label.name}</h1>
          <div className="primaryContainer">
            <div className="cardContainer">
              <div className="progressWrapper">
              <div className="stats">
                    <div>
                      <span className="button-like">Spent today:</span>
                      <span className="value button-like">
                        ${labelStats.transactions.today[0] && labelStats.transactions.today[0].spent}
                      </span>
                    </div>
                    <div>
                      <span className="button-like">spent this week:</span>
                      <span className="value button-like">
                        ${labelStats.transactions.this_week[0].spent}
                      </span>
                    </div>
                    <div>
                      <span className="button-like">spent this month:</span>
                      <span className="value button-like">
                        ${labelStats.transactions.this_month[0].spent}
                      </span>
                    </div>
                    <div>
                      <span className="button-like">
                        total transactions this month:
                      </span>
                      <span className="value button-like">
                        {labelStats.transactions.this_month[0].count}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="search">
                <FontAwesomeIcon icon={faSearch} strokeWidth={1} />
                <input placeholder="Search..." />
              </div>
            </div>
          </div>
          <div className="section">
            <h2>Statistics</h2>
            <div className="cardGrid">
              <div>
                <h3>Spends in this week</h3>
                <LineChart
                  width={300}
                  height={200}
                  data={labelStats.daily}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    wrapperStyle={{ borderRadius: "8px" }}
                    contentStyle={{
                      background: "#000",
                      borderRadius: "16px",
                      border: "none",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="spent"
                    stroke={colors.primary}
                  />
                </LineChart>
              </div>

              <div>
                <h3>Spends in this month</h3>
                <LineChart
                  width={300}
                  height={200}
                  data={labelStats.weekly}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip
                    wrapperStyle={{ borderRadius: "8px" }}
                    contentStyle={{
                      background: "#000",
                      borderRadius: "16px",
                      border: "none",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="spent"
                    stroke={colors.primary}
                  />
                </LineChart>
              </div>
              <div>
                <h3>Spends in this year</h3>
                <LineChart
                  width={300}
                  height={200}
                  data={labelStats.monthly}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    wrapperStyle={{ borderRadius: "8px" }}
                    contentStyle={{
                      background: "#000",
                      borderRadius: "16px",
                      border: "none",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="spent"
                    stroke={colors.primary}
                  />
                </LineChart>
              </div>
            </div>
            <div>
              <h2>Recent Transactions</h2>
              {labelStats.recents.length === 0 ? (
                <div className="no-data">
                  <span>
                    Seems like you haven&apos;t added any transactions yet.
                  </span>
                  <Button
                    startIcon={faAdd}
                    small
                    secondary
                    onClick={() => router.push("/add")}
                  >
                    Create one now!
                  </Button>
                </div>
              ) : (
                <div className="horizontalGrid">
                  <div className="horizontalGridWrapper">
                    {labelStats.recents.map((elem) => (
                      <TransactionCard data={elem} key={elem.id} />
                    ))}
                  </div>
                </div>
              )}
              <div style={{ float: "right" }}>
                <Button secondary small endIcon={faAngleRight}onClick={() =>
                    router.push(
                      "/transactions?labels=" + labelStats.label.id
                    )
                  }>
                  View all
                </Button>
              </div>
            </div>
          </div>
        </main>
        <div style={{ width: "100vw", height: "72px" }} />

      <style jsx>
        {`
          main {
            padding: 12px;
          }
          h1 {
            font-weight: 700;
            color: white;
            font-size: 4rem;
            text-align: center;
          }

          .mainWrapper {
            width: 100%;
            align-items: center;
          }

          .mainWrapper h1,
          .mainWrapper .primaryContainer {
            flex-basis: 50%;
            justify-content: center;
            align-self: center;
          }

          .primaryContainer {
            max-width: 500px;
            display: flex;
            flex-direction: column;
          }
          .cardContainer {
            padding: 16px;
            border-radius: 16px;
          }

          .progressWrapper {
            justify-content: space-between;
          }

          .search {
            width: 100%;
            padding: 0px 16px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.05);
            margin-top: 8px;
          }

          .search input {
            margin-left: 8px;
            padding: 12px 8px;
            background: transparent;
            border: none;
            width: 80%;
            color: #fff8;
          }

          .search input:hover,
          .search input:focus {
            outline: none;
          }

          .search svg {
            stroke-width: 1px;
          }

          .mainWrapper,
          .progressWrapper {
            display: flex;
          }
          .progressWrapper {
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .cardGrid {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            justify-content: space-between;
          }

          .cardGrid h3 {
            text-align: center;
            font-size: 12px;
            text-transform: uppercase;
            font-weight: 900;
          }
          .stats {
            width: 100%;
            margin-top: 32px;
          }
          .button-like {
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 900;
            font-size: 12px;
          }

          .value {
            color: rgba(255, 255, 255, 0.7);
            float: right;
          }

          .horizontalGrid {
            max-width: 100vw;
            overflow-x: auto;
          }
          .horizontalGridWrapper {
            width: max-content;
            display: flex;
          }
          h2 {
            margin-left: 12px;
          }
          
          .no-data {
              width: 100%;
              height: 150px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
              text-align: center;
              color: rgba(228, 228, 228, 0.8);
            }

          @media (max-width: 850px) {
            .mainWrapper {
              flex-direction: column;
            }
          }

          @media (max-width: 500px) {
            .mainWrapper {
              margin-top: 32px;
            }
            .progressWrapper > :global(.progressContainer) {
              margin: 6px;
            }

            :global(.progressBar) {
              width: 30px !important;
              border-radius: 8px !important;
            }
            :global(.progressElement) {
              width: 24px !important;
              border-radius: 6px !important;
            }
            .cardContainer {
              padding: 8px;
              border-radius: 8px;
            }
            h1 {
              font-size: 3rem;
            }
          }
        `}
      </style>
    </>
  );
}

export default Label;

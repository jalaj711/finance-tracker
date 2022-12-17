import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faSearch,
  faAdd,
} from "@fortawesome/free-solid-svg-icons";
import WalletCard from "../components/WalletCard";
import TransactionCard from "../components/TransactionCard";
import Button from "../components/Button";
import LabelCard from "../components/LabelCard";
import { LineChart, XAxis, YAxis, Line, Tooltip } from "recharts";
import colors from "../utils/colors";
import Router from "next/router";
import { useAppDispatch, useAppSelector } from "../utils/reduxHooks";
import { useEffect, useState } from "react";
import URLs, { API_BASE } from "../utils/endpoints";
import {
  hideGlobalLoader,
  showGlobalLoader,
} from "../components/GlobalLoader/loaderSlice";
import { TransactionType, WalletType, LabelType } from "../utils/types";
import Navbar from "../components/Navbar";
import { showSnackbarThunk } from "../components/Snackbar/snackbarThunk";

interface DashboardDataType {
  recents: TransactionType[];
  daily: { day: number; spent: number; count: number }[];
  weekly: { week: number; spent: number; count: number }[];
  monthly: { month: number; spent: number; count: number }[];
  transactions: {
    today: { day: number; spent: number; count: number }[];
    this_week: { week: number; spent: number; count: number }[];
    this_month: { month: number; spent: number; count: number }[];
  };
}

function Dashboard() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const userWallets = useAppSelector((state) => state.wallets.wallets);
  const userLabels = useAppSelector((state) => state.labels.labels);
  const [dashboardData, setDashboardData] = useState<DashboardDataType | null>(
    null
  );

  useEffect(() => {
    if (!token) {
      Router.push("/login");
      dispatch(showSnackbarThunk("Please login before accessing this page"));
    }
    dispatch(showGlobalLoader());
    fetch(API_BASE + URLs.USER.DASHBOARD_STATS, {
      headers: {
        Authorization: "Token " + token,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          Router.push("/login");
          dispatch(
            showSnackbarThunk("Please login before accessing this page")
          );
        } else return res.json();
      })
      .then((res) => {
        res.data.daily.sort((d1: any, d2: any) => (d1.day > d2.day ? 1 : -1));
        res.data.weekly.sort((w1: any, w2: any) =>
          w1.week > w2.week ? 1 : -1
        );
        res.data.monthly.sort((m1: any, m2: any) =>
          m1.month > m2.month ? 1 : -1
        );
        setDashboardData(res.data);
        dispatch(hideGlobalLoader());
      });
  }, [dispatch, token]);
  return (
    dashboardData && (
      <>
        <Head>
          <title>Dashboard</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <div className="mainWrapper">
            <h1>Dashboard</h1>
            <div className="primaryContainer">
              <div className="stats">
                <div>
                  <span className="button-like">Spent today:</span>
                  <span className="value button-like">
                    $
                    {dashboardData.transactions.today[0] &&
                      dashboardData.transactions.today[0].spent}
                  </span>
                </div>
                <div>
                  <span className="button-like">spent this week:</span>
                  <span className="value button-like">
                    ${dashboardData.transactions.this_week[0].spent}
                  </span>
                </div>
                <div>
                  <span className="button-like">spent this month:</span>
                  <span className="value button-like">
                    ${dashboardData.transactions.this_month[0].spent}
                  </span>
                </div>
                <div>
                  <span className="button-like">
                    total transactions this month:
                  </span>
                  <span className="value button-like">
                    {dashboardData.transactions.this_month[0].count}
                  </span>
                </div>
              </div>
              <div className="search">
                <FontAwesomeIcon icon={faSearch} strokeWidth={1} />
                <input placeholder="Search..." />
              </div>
            </div>
          </div>
          <div className="section">
            <h2>Recent Transactions</h2>
            {dashboardData.recents.length === 0 ? (
              <div className="no-data">
                <span>
                  Seems like you haven&apos;t added any transactions yet.
                </span>
                <Button
                  startIcon={faAdd}
                  small
                  secondary
                  onClick={() => Router.push("/add")}
                >
                  Create one now!
                </Button>
              </div>
            ) : (
              <div className="horizontalGrid">
                <div className="horizontalGridWrapper">
                  {dashboardData.recents.map((elem) => (
                    <TransactionCard key={elem.id} data={elem} />
                  ))}
                </div>
              </div>
            )}
            <div style={{ float: "right" }}>
              <Button
                secondary
                small
                endIcon={faAngleRight}
                onClick={() => Router.push("/transactions")}
              >
                View all
              </Button>
            </div>
          </div>
          <div className="section">
            <h2>Statistics</h2>
            <div className="cardGrid stats">
              <div>
                <h3>Transactions this week</h3>
                <LineChart
                  width={300}
                  height={200}
                  data={dashboardData.daily}
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
                    dataKey="count"
                    stroke={colors.primary}
                  />
                </LineChart>
              </div>
              <div>
                <h3>Spent this week</h3>
                <LineChart
                  width={300}
                  height={200}
                  data={dashboardData.daily}
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
                <h3>Transactions this month</h3>
                <LineChart
                  width={300}
                  height={200}
                  data={dashboardData.weekly}
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
                    dataKey="count"
                    stroke={colors.primary}
                  />
                </LineChart>
              </div>
              <div>
                <h3>Spent this month</h3>
                <LineChart
                  width={300}
                  height={200}
                  data={dashboardData.weekly}
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
            </div>
          </div>

          <div className="section">
            <h2>Your Wallets</h2>
            {userWallets.length === 0 ? (
              <div className="no-data">
                <span>Seems like you don&apos;t have any wallets yet.</span>
                <Button
                  startIcon={faAdd}
                  small
                  secondary
                  onClick={() => Router.push("/wallets")}
                >
                  Add one
                </Button>
              </div>
            ) : (
              <div className="cardGrid">
                {userWallets.map((elem) => (
                  <WalletCard
                    key={elem.id}
                    data={elem}
                    onClick={() => Router.push("/wallets/" + elem.id)}
                  />
                ))}
              </div>
            )}

            <div style={{ float: "right" }}>
              <Button
                secondary
                small
                endIcon={faAngleRight}
                onClick={() => Router.push("/wallets")}
              >
                View all
              </Button>
            </div>
          </div>
          <div className="section">
            <h2>Your Labels</h2>
            {userLabels.length === 0 ? (
              <div className="no-data">
                <span>Seems like you don&apos;t have any labels yet.</span>
                <Button
                  startIcon={faAdd}
                  small
                  secondary
                  onClick={() => Router.push("/labels")}
                >
                  Add one
                </Button>
              </div>
            ) : (
              <div className="horizontalGrid">
                <div className="horizontalGridWrapper">
                  {userLabels.map((elem) => (
                    <LabelCard
                      key={elem.id}
                      data={elem}
                      onClick={() => Router.push("/labels/" + elem.id)}
                    />
                  ))}
                </div>
              </div>
            )}
            <div style={{ float: "right" }}>
              <Button
                secondary
                small
                endIcon={faAngleRight}
                onClick={() => Router.push("/labels")}
              >
                View all
              </Button>
            </div>
          </div>
        </main>
        <div style={{ width: "100vw", height: "84px" }} />
        <Navbar />

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
              padding: 16px;
              border-radius: 16px;
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

            .cardGrid {
              display: flex;
              flex-wrap: wrap;
              width: 100%;
              justify-content: space-evenly;
            }
            .stats h3 {
              text-align: center;
              font-size: 12px;
              text-transform: uppercase;
              font-weight: 900;
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
              h1 {
                font-size: 3rem;
              }
            }
          `}
        </style>
      </>
    )
  );
}

export default Dashboard;

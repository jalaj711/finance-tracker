import Head from "next/head";
import ProgressBar from "../components/Progress/ProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import WalletCard from "../components/WalletCard";
import TransactionCard from "../components/TransactionCard";
import Button from "../components/Button";
import LabelCard from "../components/LabelCard";

function Wallets() {
  return (
    <>
      <Head>
        <title>My Wallets</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="mainWrapper">
          <h1>My Wallets</h1>
        </div>
        <div className="section">
          <div className="cardGrid">
            <WalletCard
              title="Wallet 1"
              description="Some description for Wallet 1"
              value={70}
            />
            <WalletCard
              title="Wallet 2"
              description="Some description for Wallet 2"
              value={7}
            />
            <WalletCard
              title="Wallet 3"
              description="Some description for Wallet 3"
              value={50}
            />
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

          .mainWrapper h1 {
            flex-basis: 50%;
            justify-content: center;
            align-self: center;
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
          .cardGrid {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            justify-content: space-evenly;
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
          }
        `}
      </style>
    </>
  );
}

export default Wallets;

import React, { useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import History from "../../History/History";
import { InnerLayout } from "../../styles/Layouts";
import Chart from "../Chart/Chart";

function Dashboard() {
  const {
    totalExpenses,
    incomes,
    expenses,
    totalIncome,
    totalBalance,
    getIncomes,
    getExpenses,
  } = useGlobalContext();

  useEffect(() => {
    getIncomes();
    getExpenses();
  }, []);

  // Download CSV handler
  const handleDownloadCSV = async () => {
    try {
      const response = await fetch(
        //"http://localhost:5000/api/v1/download-expenses-csv"
        "https://my-money-production.up.railway.app/api/v1/download-expenses-csv"
      );
      if (!response.ok) throw new Error("Failed to download statement");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "expenses_statement.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error downloading statement");
    }
  };

  return (
    <DashboardStyled>
      <InnerLayout>
        <h1>All Transactions</h1>
        <button
          onClick={handleDownloadCSV}
          style={{
            margin: "1rem 0",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            background: "var(--color-green)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Download Statement (Excel)
        </button>
        <div className="stats-con">
          <div className="chart-con">
            <Chart />
            <div className="amount-con">
              <div className="row">
                <div className="income">
                  <h2>Total Income</h2>
                  <p>₹{totalIncome()}</p>
                </div>
                <div className="expense">
                  <h2>Total Expense</h2>
                  <p>₹{totalExpenses()}</p>
                </div>
              </div>
              <div className="balance">
                <h2>Total Balance</h2>
                <div className="balance-amount">
                  <span className="dollar-sign">₹</span>
                  <span
                    className={totalBalance() < 0 ? "amount-neg" : "amount-pos"}
                  >
                    {totalBalance()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="history-con">
            <History />
            <div className="history-block">
              <div className="history-labels">
                <span>Min</span>
                <span className="center-label">Salary</span>
                <span>Max</span>
              </div>
              <div className="salary-item">
                <p>₹{Math.min(...incomes.map((item) => item.amount))}</p>
                <p>₹{Math.max(...incomes.map((item) => item.amount))}</p>
              </div>
            </div>
            <div className="history-block">
              <div className="history-labels">
                <span>Min</span>
                <span className="center-label">Expense</span>
                <span>Max</span>
              </div>
              <div className="salary-item">
                <p>₹{Math.min(...expenses.map((item) => item.amount))}</p>
                <p>₹{Math.max(...expenses.map((item) => item.amount))}</p>
              </div>
            </div>
          </div>
        </div>
      </InnerLayout>
    </DashboardStyled>
  );
}

const DashboardStyled = styled.div`
  .stats-con {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 2rem;
    @media (max-width: 900px) {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .chart-con {
      grid-column: 1 / 4;
      height: 400px;
      @media (max-width: 900px) {
        height: auto;
      }
      .amount-con {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        margin-top: 2rem;
        .row {
          display: flex;
          gap: 2rem;
          @media (max-width: 900px) {
            flex-direction: column;
            gap: 1rem;
          }
        }
        .income,
        .expense {
          flex: 1;
          background: #fcf6f9;
          border: 2px solid #ffffff;
          box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
          border-radius: 20px;
          padding: 1rem;
          p {
            font-size: 3.5rem;
            font-weight: 700;
          }
        }
        .balance {
          background: #fcf6f9;
          border: 2px solid #ffffff;
          box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
          border-radius: 20px;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
            font-weight: 700;
            color: #222260;
          }
          .balance-amount {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 4rem;
            font-weight: 800;
          }
          .dollar-sign {
            font-size: 4rem;
            color: var(--color-green);
          }
          .amount-pos {
            color: var(--color-green);
            opacity: 0.8;
          }
          .amount-neg {
            color: #e74c3c;
            opacity: 0.8;
          }
        }
      }
    }
    .history-con {
      grid-column: 4 / -1;
      @media (max-width: 900px) {
        grid-column: auto;
        order: 2;
      }
      .history-block {
        margin-bottom: 1.5rem;
      }
      .history-labels {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.2rem;
        margin-bottom: 0.2rem;
        .center-label {
          flex: 1;
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
        }
      }
      .salary-item {
        background: #fcf6f9;
        border: 2px solid #ffffff;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        padding: 1rem;
        border-radius: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        p {
          font-weight: 600;
          font-size: 1.6rem;
        }
      }
    }
  }
  h1,
  button {
    @media (max-width: 900px) {
      display: block;
      width: 100%;
      text-align: center;
      margin-left: auto;
      margin-right: auto;
    }
  }
`;

export default Dashboard;

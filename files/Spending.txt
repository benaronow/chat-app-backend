import { useAppContext } from "../../providers/AppProvider";
import { useSpending } from "./useSpending";

export const Spending = () => {
  const { changeChatOpen } = useAppContext();
  const initialSpending = useSpending();

  return (
    <div className="rounded w-100 h-100 shadow">
      <div
        className="d-flex justify-content-center align-items-center rounded-top p-2"
        style={{ height: "50px" }}
      >
        <button
          className="border-0 bg-transparent p-0 me-2"
          onClick={() => changeChatOpen(true)}
        >
          <img src="/portal-pete.png" height={30} width={30} />
        </button>
        <span className="fs-4 fw-bold w-100 ms-1 text-nowrap">Spending</span>
      </div>
      <div className="rounded-bottom h-100 w-100 d-flex flex-column p-3">
        <div className="d-flex justify-content-between gap-3 w-100">
          <div className="d-flex flex-column">
            <span className="fs-5">Income</span>
            <span className="fs-4 text-success">{initialSpending.income}</span>
          </div>
          <div className="d-flex flex-column">
            <span className="fs-5">Expenses</span>
            <span className="fs-4 text-danger">{initialSpending.expenses}</span>
          </div>
          <div className="d-flex flex-column">
            <span className="fs-5">Net</span>
            <span className="fs-4">{initialSpending.net}</span>
          </div>
        </div>
        <div className="mt-3">
          <span className="fs-5">Overall Budget</span>
          <span className="fs-4">{initialSpending.overallBudget}</span>
        </div>
        <div className="mt-3">
          <span className="fs-5">Recent Transactions</span>
          <ul className="list-unstyled mt-2">
            {initialSpending.recentTransactions.map((transaction) => (
              <li
                key={transaction.id}
                className="d-flex justify-content-between"
              >
                <span>
                  {transaction.date} - {transaction.description}
                </span>
                <span
                  className={
                    transaction.amount.startsWith("-")
                      ? "text-danger"
                      : "text-success"
                  }
                >
                  {transaction.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

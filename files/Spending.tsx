import { useAppContext } from "../../providers/AppProvider";
import { useBreakpoint } from "../../useBreakpoint";
import { useSpending } from "./useSpending";

export const Spending = () => {
  const { changeChatOpen } = useAppContext();
  const initialSpending = useSpending();
  const { baseCompHeight } = useBreakpoint();

  return (
    <div className="rounded w-100 shadow" style={{ height: baseCompHeight }}>
      <div
        className="d-flex justify-content-between align-items-center rounded-top p-3 border-bottom"
        style={{ height: "50px" }}
      >
        <span className="fs-4 fw-bold w-100 text-nowrap">Spending</span>
        <button
          className="border-0 bg-transparent p-0"
          onClick={() => changeChatOpen(true)}
        >
          <img src="/portal-pete.png" height={30} width={30} />
        </button>
      </div>
      <div
        className="rounded-bottom w-100 d-flex flex-column p-3"
        style={{ height: `calc(${baseCompHeight} - 50px)` }}
      >
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
          <span className="fs-4 ms-3">{initialSpending.overallBudget}</span>
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

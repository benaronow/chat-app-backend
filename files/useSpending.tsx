export const useSpending = () => {
  const initialSpending = {
    income: "$0.22",
    expenses: "-$2,844.56",
    net: "-$2,844.34",
    overallBudget: "$0.00",
    recentTransactions: [
      {
        id: 1,
        date: "2025-05-20",
        description: "Cash Withdrawal",
        amount: "-$150.00",
      },
      {
        id: 2,
        date: "2025-05-19",
        description: "Staples",
        amount: "-$3.22",
      },
      {
        id: 3,
        date: "2025-05-18",
        description: "Grocery Store",
        amount: "-$82.45",
      },
      {
        id: 4,
        date: "2025-05-17",
        description: "Uber",
        amount: "-$18.60",
      },
      {
        id: 5,
        date: "2025-05-16",
        description: "Salary",
        amount: "+$2,500.00",
      },
      {
        id: 6,
        date: "2025-05-15",
        description: "Coffee Shop",
        amount: "-$4.75",
      },
      {
        id: 7,
        date: "2025-05-14",
        description: "Amazon Purchase",
        amount: "-$45.99",
      },
      {
        id: 8,
        date: "2025-05-13",
        description: "Electric Bill",
        amount: "-$120.00",
      },
    ],
  };

  return initialSpending;
};

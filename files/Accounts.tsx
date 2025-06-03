import React, { useState } from "react";
import { useAppContext } from "../../providers/AppProvider";
import { useAccounts } from "./useAccounts";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useBreakpoint } from "../../useBreakpoint";

export const Accounts = () => {
  const { changeChatOpen } = useAppContext();
  const initialAccounts = useAccounts;
  const [accounts, setAccounts] = useState(initialAccounts);
  const { baseCompHeight } = useBreakpoint();

  return (
    <div className="rounded w-100 shadow" style={{ height: baseCompHeight }}>
      <div
        className="d-flex justify-content-between align-items-center rounded-top p-3 border-bottom"
        style={{ height: "50px" }}
      >
        <span className="fs-4 fw-bold w-100 text-nowrap">Accounts</span>
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
        {accounts
          .sort((a, b) => a.id - b.id)
          .map((accountType) => (
            <React.Fragment key={accountType.id}>
              <div className="d-flex mb-3 w-100 justify-content-between align-items-center">
                <span>{accountType.type}</span>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    setAccounts((prev) => [
                      ...prev.filter((a) => a.id !== accountType.id),
                      {
                        ...accountType,
                        dropdownOpen: !accountType.dropdownOpen,
                      },
                    ])
                  }
                >
                  {accountType.dropdownOpen ? (
                    <TiArrowSortedUp />
                  ) : (
                    <TiArrowSortedDown />
                  )}
                </button>
              </div>
              {accountType.dropdownOpen &&
                accountType.accounts.map((account) => (
                  <div key={account.id}>
                    <span className="ms-3">
                      {account.name} - ${account.balance.toFixed(2)}
                    </span>
                  </div>
                ))}
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

import { useAppContext } from "../providers/AppProvider";

export const ViewToggle = () => {
  const { visibleComp, changeVisibleComp, changeMessageLog, changeChatOpen } =
    useAppContext();

  return (
    <div
      className="d-flex w-100 justify-content-center align-items-center gap-4 bg-dark text-white text-nowrap"
      style={{ height: "50px", minHeight: "50px" }}
    >
      <label className="d-flex align-items-center form-label mb-0">
        <span className="me-2 fs-6 fw-bold">Accounts</span>
        <input
          type="radio"
          name="visibleComp"
          value="chat"
          checked={visibleComp === "accounts"}
          onChange={() => {
            changeVisibleComp("accounts");
            changeChatOpen(false);
            changeMessageLog("clear");
          }}
          className="form-check-input mt-0"
        />
      </label>
      <label className="d-flex align-items-center form-label mb-0">
        <span className="me-1 fs-6 fw-bold">Spending</span>
        <input
          type="radio"
          name="visibleComp"
          value="context"
          checked={visibleComp === "spending"}
          onChange={() => {
            changeVisibleComp("spending");
            changeChatOpen(false);
            changeMessageLog("clear");
          }}
          className="form-check-input mt-0"
        />
      </label>
    </div>
  );
};

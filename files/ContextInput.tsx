import { useMemo, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { useBreakpoint } from "../useBreakpoint";
import { useAppContext, type Context } from "../providers/AppProvider";
import { GrPowerReset } from "react-icons/gr";
import { FaSave } from "react-icons/fa";

export const ContextInput = () => {
  const { baseCompHeight } = useBreakpoint();
  const { context, changeContext, initialLoaded } = useAppContext();
  const [contextInput, setContextInput] = useState<Context>(context);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContextInput((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleInvestmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContextInput((prev) => ({
      ...prev,
      investmentValue: e.target.value,
    }));
  };

  const handleSubmitContext = () => {
    changeContext(contextInput);
  };

  const handleClearContext = () => {
    setContextInput({});
    changeContext({});
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmitContext();
    }
  };

  const contextFieldMap = useMemo(
    () => [
      {
        label: "Name",
        inputValue: contextInput.name,
        contextValue: context.name,
        onChange: handleNameChange,
        placeholder: "Enter name here...",
      },
      {
        label: "Investment value",
        inputValue: contextInput.investmentValue,
        contextValue: context.investmentValue,
        onChange: handleInvestmentChange,
        placeholder: "Enter investment value here...",
      },
    ],
    [context, contextInput]
  );

  return (
    <div
      className="rounded border w-100"
      style={{ height: `calc(${baseCompHeight})` }}
    >
      <div
        className="d-flex justify-content-center align-items-center bg-secondary-subtle rounded-top p-2"
        style={{ height: "50px" }}
      >
        <span className="fs-4 fw-bold">Context</span>
      </div>
      <div
        className="d-flex flex-column gap-3 align-items-center p-3"
        style={{ height: `calc(${baseCompHeight} - 100px)` }}
      >
        {contextFieldMap.map((field) => (
          <div className="d-flex w-100 align-items-center" key={field.label}>
            <span className="me-3 text-nowrap">{`${field.label}:`}</span>
            <input
              className="form-control"
              value={field.inputValue}
              onChange={field.onChange}
              onKeyDown={handleKeyDown}
              disabled={!initialLoaded}
              placeholder={field.placeholder}
            />
          </div>
        ))}
      </div>
      <div
        className="rounded-bottom bg-secondary-subtle w-100 d-flex justify-content-center p-2 gap-2"
        style={{ height: "50px" }}
      >
        <button
          type="button"
          className="btn btn-secondary d-flex align-items-center fs-5"
          onClick={handleClearContext}
          disabled={
            !initialLoaded ||
            contextFieldMap.every((field) => !field.inputValue)
          }
        >
          <GrPowerReset />
        </button>
        <button
          type="button"
          className="btn btn-primary d-flex align-items-center"
          onClick={handleSubmitContext}
          disabled={
            !initialLoaded ||
            contextFieldMap.every(
              (field) => field.inputValue === field.contextValue
            )
          }
        >
          <FaSave />
        </button>
      </div>
    </div>
  );
};

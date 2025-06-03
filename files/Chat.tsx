import {
  useEffect,
  useMemo,
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { useBreakpoint } from "../useBreakpoint";
import { useAppContext } from "../providers/AppProvider";
import axios from "axios";
import { IoClose, IoSend, IoSettingsSharp } from "react-icons/io5";
import { GrPowerReset } from "react-icons/gr";

interface Props {
  ref?: React.Ref<HTMLDivElement>;
}

export const Chat = ({ ref }: Props) => {
  const { baseCompHeight } = useBreakpoint();
  const {
    model,
    input,
    changeInput,
    messageLog,
    changeMessageLog,
    initialLoaded,
    visibleComp,
    changeChatOpen,
    instructions,
  } = useAppContext();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const mostRecentMessage = useMemo(
    () => messageLog[messageLog.length - 1]?.content,
    [messageLog]
  );

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messageLog.length, mostRecentMessage]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    changeInput(e.target.value);
  };

  const handleSubmit = async () => {
    changeMessageLog("add", { role: "user", content: input });
    changeMessageLog("add", { role: "assistant", content: "Thinking..." });
    changeInput("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/chat`,
        {
          model,
          messages: [...messageLog, { role: "user", content: input }],
          instructions,
          filename:
            visibleComp === "accounts" ? "Accounts.tsx" : "Spending.tsx",
        }
      );
      changeMessageLog("setLast", {
        role: "assistant",
        content: response.data.reply,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div
      className="rounded w-100 shadow"
      style={{ height: baseCompHeight }}
      ref={ref}
    >
      <div
        className="d-flex gap-2 align-items-center bg-primary-subtle rounded-top p-2"
        style={{ height: "50px" }}
      >
        <span className="fs-4 fw-bold w-100 ms-1 text-nowrap">Chat</span>
        <button
          className="btn btn-secondary d-flex align-items-center fs-4"
          data-bs-toggle="modal"
          data-bs-target="#settings-dialog"
        >
          <IoSettingsSharp />
        </button>
        <button
          className="btn btn-danger d-flex align-items-center fs-4"
          onClick={() => changeChatOpen(false)}
        >
          <IoClose />
        </button>
      </div>
      <div
        className="d-flex justify-content-center align-items-center w-100"
        style={{ height: `calc(${baseCompHeight} - 100px)` }}
      >
        {initialLoaded ? (
          <>
            <div
              className="d-flex flex-column justify-content-end p-2"
              style={{ height: `calc(${baseCompHeight} - 100px)` }}
            >
              <img src="/portal-pete.png" height={50} width={50} />
            </div>
            <div
              className="d-flex flex-column gap-3 rounded-top overflow-y-scroll py-3 pe-3 w-100"
              style={{ height: `calc(${baseCompHeight} - 100px)` }}
              ref={containerRef}
            >
              <div
                style={{
                  height: `calc(${baseCompHeight} - 100px - 2rem)`,
                  minHeight: `calc(${baseCompHeight} - 100px - 2rem)`,
                }}
              />
              {messageLog.map((message, index) => (
                <div
                  key={index}
                  className={`bg-${
                    message.role === "user" ? "primary" : "secondary"
                  } text-white px-3 py-2 rounded align-self-${
                    message.role === "user" ? "end" : "start"
                  }`}
                  style={{ maxWidth: "75%" }}
                >
                  {message.content}
                </div>
              ))}
            </div>
          </>
        ) : (
          <span className="fs-5 fw-bold">Portal Pete is loading...</span>
        )}
      </div>
      <div
        className="rounded-bottom bg-secondary-subtle w-100 d-flex p-2 gap-2"
        style={{ height: "50px" }}
      >
        <button
          type="button"
          className="btn btn-secondary d-flex align-items-center fs-5"
          onClick={() => changeMessageLog("clear")}
          disabled={!initialLoaded || messageLog.length <= 1}
        >
          <GrPowerReset />
        </button>
        <input
          className="w-100 form-control"
          value={input}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          placeholder="Type your message here..."
          disabled={!initialLoaded}
        />
        <button
          type="button"
          className="btn btn-primary d-flex align-items-center"
          onClick={handleSubmit}
          disabled={!initialLoaded}
        >
          <IoSend />
        </button>
      </div>
    </div>
  );
};

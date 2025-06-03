import type { ChangeEvent } from "react";
import { useAppContext, type Model } from "../providers/AppProvider";
import { IoClose } from "react-icons/io5";

export const SettingsDialog = () => {
  const { model, changeModel, instructions, changeInstructions } =
    useAppContext();

  const handleModelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    changeModel(e.target.value as Model);
  };

  const handleInstructionsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    changeInstructions(e.target.value);
  };

  return (
    <div className="modal fade" role="dialog" id="settings-dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between align-items-center bg-secondary-subtle">
            <h5 className="modal-title" id="exampleModalLabel">
              Settings
            </h5>
            <button
              className="btn btn-danger d-flex align-items-center fs-4"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <IoClose />
            </button>
          </div>
          <div className="modal-body d-flex flex-column">
            <span>Model:</span>
            <select
              className="w-100 form-select"
              onChange={handleModelChange}
              defaultValue={model}
            >
              <option value="gpt" label="GPT 4.1 via OpenAI">
                GPT 4.1 via OpenAI
              </option>
              <option
                value="claude"
                label="Claude Sonnet 3.5 + Haiku 3.5 via Bedrock"
              >
                Claude Sonnet 3.5 + Haiku 3.5 via Bedrock
              </option>
              <option value="deepseek" label="Deepseek R1 via Bedrock">
                Deepseek R1 via Bedrock
              </option>
            </select>
            <span className="mt-3">Instructions:</span>
            <textarea
              className="w-100 form-control"
              rows={10}
              placeholder="Enter your instructions here..."
              value={instructions}
              onChange={handleInstructionsChange}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

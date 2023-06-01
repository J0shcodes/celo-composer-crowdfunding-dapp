import { useState } from "react";
import { useCelo } from "@celo/react-celo";
import { AbiItem } from "web3-utils";

import crowdFundingAbi from "../../crowdfunding.abi";

type ModalProps = {
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const CreateCampaignModal = ({ onClose }: ModalProps) => {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [goal, setGoal] = useState("");

  const { kit, address } = useCelo();

  const contractAddress = "0x3f9ee235e10948B45dd4B3c52FE97401bcbC9eF7";

  const createCampaign = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const startTimeArray = startTime.split(":");
    const endTimeArray = endTime.split(":");

    const startTimeInSeconds =
      parseInt(startTimeArray[0], 10) * 60 * 60 +
      parseInt(startTimeArray[1], 10) * 60;
    const endTimeInSeconds =
      parseInt(endTimeArray[0], 10) * 60 * 60 +
      parseInt(endTimeArray[1], 10) * 60;

    const timeInSeconds = endTimeInSeconds - startTimeInSeconds;

    console.log(startTimeInSeconds, endTimeInSeconds, timeInSeconds);

    const contract = new kit.connection.web3.eth.Contract(
      crowdFundingAbi as AbiItem[],
      contractAddress
    );

    await contract.methods
      .createCampaign(name, goal, timeInSeconds, description, imageUrl)
      .send({ from: address });
  };

  return (
    <div className="fixed flex justify-center items-center bg-[rgba(0,0,0,0.5)] z-50 top-0 left-0 bottom-0 right-0 w-full h-full">
      <div className="bg-white p-4 rounded">
        <div className="flex justify-between w-[400px]">
          <h2 className="text-2xl font-medium">Create Auction</h2>
          <div
            className="text-[28px] font-medium cursor-pointer"
            onClick={onClose}
          >
            &times;
          </div>
        </div>
        <form className="mt-4" onSubmit={createCampaign}>
          <div>
            <div className="w-full mb-3">
              <input
                type="text"
                className="border border-solid border-black p-2 w-full rounded"
                placeholder="Enter name of campaign"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-full mb-3">
              <input
                type="text"
                className="border border-solid border-black p-2 w-full rounded"
                placeholder="Enter image url"
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div className="w-full mb-3">
              <input
                type="text"
                className="border border-solid border-black p-2 w-full rounded"
                placeholder="Enter description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="w-full mb-3">
              <label>Enter campaign start time</label>
              <input
                type="time"
                className="border border-solid border-black p-2 w-full rounded"
                placeholder="Enter campaign end time"
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="w-full mb-3">
              <label>Enter campaign end time</label>
              <input
                type="time"
                className="border border-solid border-black p-2 w-full rounded"
                placeholder="Enter campaign end time"
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            <div className="w-full mb-3">
              <input
                type="text"
                className="border border-solid border-black p-2 w-full rounded"
                placeholder="Enter campaign goal"
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>
          </div>
          <div className="text-center mt-4">
            <button
              type="submit"
              className="bg-green-500 text-white rounded-md p-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignModal;

import { useState } from "react";
import { useCelo } from "@celo/react-celo";
import { BigNumber } from "bignumber.js";

import crowdFundingAbi from "../../crowdfunding.abi";
import {AbiItem} from "web3-utils"


type ContributeModalProps = {
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  index: number | undefined
}


const ContributeToCampaign = ({onClose, index} : ContributeModalProps) => {
  const [amount, setAmount] = useState("")

  const {address, kit} = useCelo();

  const contractAddress = "0x3f9ee235e10948B45dd4B3c52FE97401bcbC9eF7";

  const donate = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const contract = new kit.connection.web3.eth.Contract(crowdFundingAbi as AbiItem[], contractAddress);

    await contract.methods.donate(index).send({from: address, value: amount});
  }
  
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
        <form className="mt-4" onSubmit={donate}>
          <div>
            <div className="w-full mb-3">
              <input
                type="text"
                className="border border-solid border-black p-2 w-full rounded"
                placeholder="Enter donation Amount"
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="text-center mt-4">
            <button
              type="submit"
              className="bg-green-500 text-white rounded-md p-2"
            >
              Contribute
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributeToCampaign;

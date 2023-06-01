import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCelo } from "@celo/react-celo";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { BigNumber } from "bignumber.js";

import CreateCampaignModal from "./modals/createCampaign";

export default function Header() {
  const [userBalance, setUserBalance] = useState("");
  const [openCreatCampaignModal, setOpenCreatCampaignModal] = useState(false);

  let { address, kit, connect, disconnect } = useCelo();

  const onClose = () => {
    setOpenCreatCampaignModal(false);
  }

  const getUserBalance = useCallback(async () => {
    const celoToken = await kit.contracts.getGoldToken();
    const userBalance = await celoToken.balanceOf(address!);
    const celoTokenBalance = new BigNumber(userBalance)
      .shiftedBy(-18)
      .toFixed(2);
    setUserBalance(celoTokenBalance);
  }, [address, kit.contracts]);

  useEffect(() => {
    if (address) {
      getUserBalance();
    }
  }, [getUserBalance, address]);

  return (
    <div className="flex justify-between p-4">
      <h2 className="font-bold text-xl">Cel-Funding</h2>
      {address ? (
        <div className="flex justify-between w-[330px]">
          <div className="flex flex-col justify-center items-center">
            {userBalance ? `${userBalance}celo` : "0celo"}
          </div>
          <button
            className="bg-purple-500 text-white p-2 rounded-md"
            onClick={() => setOpenCreatCampaignModal(true)}
          >
            Create Campaign
          </button>
          <button
            className="bg-red-500 text-white rounded-md p-2"
            onClick={disconnect}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          className="bg-blue-500 text-white rounded-md p-3.5"
          onClick={connect}
        >
          Connect Wallet
        </button>
      )}
      {openCreatCampaignModal ? (
        <CreateCampaignModal onClose={onClose}/>
      ) : null}
    </div>
  );
}

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useCelo } from "@celo/react-celo";
import { AbiItem } from "web3-utils";

import ContributeToCampaign from "@/components/modals/contribute";
import crowdFundingAbi from "../crowdfunding.abi";

export default function Home() {
  const [openContributeForm, setOpenContributeForm] = useState(false);
  const [campaignIndex, setCampaignIndex] = useState<number>();
  const [campaigns, setCampaigns] = useState<any[]>();

  const { address, kit } = useCelo();

  const contractAddress = "0x3f9ee235e10948B45dd4B3c52FE97401bcbC9eF7";

  let deadlines: string[] = [];

  if (campaigns) {
    campaigns.map((campaign) => {
      const dateFormat = new Date(+campaign.deadline * 1000);
      const dealine: string = `${dateFormat.getDate()} ${dateFormat.toLocaleString(
        "default",
        { month: "short" }
      )} ${dateFormat.getFullYear()} ${dateFormat.getHours()}:${dateFormat.getMinutes()}:${dateFormat.getSeconds()}`;

      deadlines.push(dealine);
    });
  }

  const onClose = () => {
    setOpenContributeForm(false);
  };

  function contributeForm(index: number) {
    setCampaignIndex(index);
    setOpenContributeForm(true);
  }

  const getCampaigns = useCallback(async () => {
    const contract = new kit.connection.web3.eth.Contract(
      crowdFundingAbi as AbiItem[],
      contractAddress
    );

    const campaigns: [] | undefined = await contract.methods
      .getCampaigns()
      .call();

    setCampaigns(campaigns);
  }, [kit.connection.web3.eth.Contract]);

  useEffect(() => {
    getCampaigns();
  }, [getCampaigns]);

  async function withdrawFunds(index: number) {
    const contract = new kit.connection.web3.eth.Contract(
      crowdFundingAbi as AbiItem[],
      contractAddress
    );

    await contract.methods.completeCampaign(index).call();
  }

  return (
    <div className="relative">
      <div className="">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-10">
          {campaigns
            ? campaigns.map((campaign, index) => (
                <div
                  className="shadow-xl rounded-md relative h-fit"
                  key={index}
                >
                  <div className="w-full">
                    <Image
                      src="https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt=""
                      width={350}
                      height={350}
                      className="w-full object-contain relative"
                    />
                  </div>
                  <div className="p-3">
                    <div>
                      <h3 className="font-bold text-lg mb-2">
                        {campaign.name}
                      </h3>
                      <p className="">{campaign.description}</p>
                    </div>
                    <div className="text-sm mt-5">
                      dealine: {deadlines[index]}
                    </div>
                    <div className="mt-5">
                      <div className="flex justify-between">
                        <div>
                          <p>Goal: {campaign.goal} Celo</p>
                        </div>
                        <div>
                          <p>Raised: {campaign.raised} Celo</p>
                        </div>
                      </div>
                      <div className="text-sm">
                        {/* <p>{auctionDurations[index]}</p> */}
                      </div>

                      {address === campaign.creator ? (
                        <div className="flex justify-between">
                          <button
                            className="bg-green-500 text-white p-2 rounded mt-4 w-[40%]"
                            onClick={() => contributeForm(0)}
                          >
                            Donate
                          </button>
                          <button
                            className="bg-red-500 text-white p-2 rounded mt-4 w-[40%]"
                            onClick={() => withdrawFunds(index)}
                          >
                            Withdraw Funds
                          </button>{" "}
                        </div>
                      ) : (
                        <div className="">
                          {" "}
                          <button
                            className="bg-green-500 text-white p-2 rounded mt-4 w-full"
                            onClick={() => contributeForm(index)}
                          >
                            Donate
                          </button>{" "}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
      {openContributeForm ? (
        <ContributeToCampaign onClose={onClose} index={campaignIndex} />
      ) : null}
    </div>
  );
}

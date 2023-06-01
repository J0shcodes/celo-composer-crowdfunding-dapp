// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Crowdfunding {
    // Struct to represent a campaign
    struct Campaign {
        address payable creator;
        string name;
        string description;
        string image;
        uint256 goal;
        uint256 raised;
        uint256 deadline;
        bool completed;
    }

    // Maps a campaign ID to a nested mapping of addresses to donations
    mapping(uint256 => mapping(address => uint256)) public donations;

    // Array to hold all campaigns
    Campaign[] public campaigns;

    // Event to signal the creation of a new campaign
    event NewCampaign(
        uint256 campaignId,
        string name,
        address creator,
        uint256 goal,
        uint256 deadline
    );

    // Function to create a new campaign
    function createCampaign(
        string memory _name,
        uint256 _goal,
        uint256 duration,
        string memory _description,
        string memory _image
    ) public {
        uint256 deadline = block.timestamp + duration;
        campaigns.push(
            Campaign(
                payable(msg.sender),
                _name,
                _description,
                _image,
                _goal,
                0,
                deadline,
                false
            )
        );
        uint256 campaignId = campaigns.length - 1;
        emit NewCampaign(campaignId, _name, msg.sender, _goal, deadline);
    }

    // Function to donate to a campaign
    function donate(uint256 campaignId) public payable {
        Campaign storage campaign = campaigns[campaignId];
        require(!campaign.completed, "Campaign has already completed");
        require(
            block.timestamp < campaign.deadline,
            "Campaign deadline has passed"
        );
        donations[campaignId][msg.sender] += msg.value;
        campaign.raised += msg.value;
    }

    // Function to check the amount raised by a campaign
    function getAmountRaised(uint256 campaignId) public view returns (uint256) {
        Campaign storage campaign = campaigns[campaignId];
        return campaign.raised;
    }

    // Function to check if a campaign has reached its goal
    function hasReachedGoal(uint256 campaignId) public view returns (bool) {
        Campaign storage campaign = campaigns[campaignId];
        return campaign.raised >= campaign.goal;
    }

    // Function to complete a campaign and transfer funds to the creator
    function completeCampaign(uint256 campaignId) public {
        Campaign storage campaign = campaigns[campaignId];
        require(!campaign.completed, "Campaign has already completed");
        require(
            hasReachedGoal(campaignId),
            "Campaign has not reached its goal"
        );
        campaign.completed = true;
        campaign.creator.transfer(campaign.raised);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }
}

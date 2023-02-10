import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Staking from "../Staking/Staking.component";
import { Card } from "@chakra-ui/react";
import Farming from "../Farming/Farming.component";

import React from "react";

const StakingAndFarming = () => {
  return (
    <div
      className="staking"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "85vh",
      }}
    >
      <Card
        align="center"
        width={"500px"}
        boxShadow="lg"
        background="rgba(30,28,32,0.6)"
        backdropFilter="saturate(180%) blur(10px)"
      >
        <Tabs
          variant="soft-rounded"
          colorScheme="purple"
          isFitted
          height={"100%"}
          width="100%"
          paddingTop={"30px"}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TabList width={"80%"} opacity="inherit">
              <Tab color={"white"}>STAKING</Tab>
              <Tab color={"white"}>FARMING</Tab>
            </TabList>
          </div>
          <TabPanels>
            <TabPanel padding={0}>
              <Staking />
            </TabPanel>
            <TabPanel>
              <Farming />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Card>
    </div>
  );
};

export default StakingAndFarming;

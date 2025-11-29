import { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardBody,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import {
  UserGroupIcon,
  BuildingStorefrontIcon,
  BanknotesIcon,
} from "@heroicons/react/24/solid";
import { 
  DemografiCharts, 
  ApbdesCharts,
} from "./components";

export function InfografisContent() {
  const [activeTab, setActiveTab] = useState("demografi");

  const tabs = [
   
    {
      label: "Demografi",
      value: "demografi",
      icon: UserGroupIcon,
      desc: "Data kependudukan dan demografi",
    },
    {
      label: "APBDes",
      value: "apbdes",
      icon: BanknotesIcon,
      desc: "Laporan keuangan desa",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className=" text-blue-800 py-10">
          <div className="px-20 max-w-3xl">
            <Typography variant="h1" className="text-4xl lg:text-5xl font-bold ">
              Infografis Desa Krebet
            </Typography>
            
          </div>
      </section>

      {/* Tabs Section */}
      <section className="">
        <div className="container mx-auto px-2">
          <Tabs value={activeTab} className="w-full">
            {/* Tabs Header */}
            <Card className="mb-2">
              <CardBody className="p-0">
                <TabsHeader
                  className="bg-transparent"
                  indicatorProps={{
                    className: "bg-blue-600 shadow-md",
                  }}
                >
                  {tabs.map(({ label, value, icon: Icon }) => (
                    <Tab
                      key={value}
                      value={value}
                      onClick={() => setActiveTab(value)}
                      className={`py-4 ${
                        activeTab === value ? "text-white" : "text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        <span className="hidden sm:inline">{label}</span>
                      </div>
                    </Tab>
                  ))}
                </TabsHeader>
              </CardBody>
            </Card>

            {/* Tabs Body */}
            <TabsBody
              animate={{
                initial: { y: 250 },
                mount: { y: 0 },
                unmount: { y: 250 },
              }}
            >
             

              {/* Demografi Tab */}
              <TabPanel value="demografi" className="p-0">
                <DemografiCharts />
              </TabPanel>

              {/* APBDes Tab */}
              <TabPanel value="apbdes" className="p-0">
                <ApbdesCharts />
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

export default InfografisContent;
"use client";

import React, { Suspense, useEffect, useState } from "react";
import {
  getPricingPlanAction,
  getUserSubscriptions,
} from "@/actions/subscription-action";
import {
  DatabaseZapIcon,
  PencilLineIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
// Example icons

import { RiMoneyDollarCircleLine } from "react-icons/ri";

import {
  SubscriptionStatusType,
  TypePricingPlan,
  TypeSubscription,
} from "@/drizzle/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Modal from "@/components/modal";

import { BillingSetting } from "./subscription/billing-setting";
import { ModelSettings } from "./model-ai/models";

// Tabs Array for Workspace
const workspaceTabs = [
  {
    id: "modelProvider",
    label: "Model Provider",
    icon: <SettingsIcon size={18} strokeWidth={1.5} />,
  },
  {
    id: "members",
    label: "Members",
    icon: <UsersIcon size={18} strokeWidth={1.25} />,
  },
  {
    id: "billing",
    label: "Billing",
    icon: <RiMoneyDollarCircleLine size={18} />,
  },
  {
    id: "dataSource",
    label: "Data Source",
    icon: <DatabaseZapIcon size={18} strokeWidth={1.25} />,
  },
  // { id: 'apiExtension', label: 'API Extension', icon: <SettingsIcon size={18} /> },
  {
    id: "customization",
    label: "Customization",
    icon: <PencilLineIcon size={20} strokeWidth={1.25} />,
  },
];

// Tabs Array for Account
const accountTabs = [
  { id: "myAccount", label: "My Account", icon: <UserIcon size={18} /> },
  // { id: 'integrations', label: 'Integrations', icon: <SettingsIcon size={18} /> },
  {
    id: "others",
    label: "Others",
    icon: <SettingsIcon size={18} strokeWidth={1.25} />,
  },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const SettingPopup = ({ isOpen, onClose }: Props) => {
  const [activeTab, setActiveTab] = useState("modelProvider");
  const [allPlans, setAllPlans] = useState<TypePricingPlan[]>([]);
  const [userSubscriptions, setUserSubscriptions] = useState<
    TypeSubscription[] | null
  >(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const subsData = await getUserSubscriptions();
  //       setUserSubscriptions(subsData);
  //       const plansData = await getPricingPlanAction();
  //       setAllPlans(plansData);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const sortedSubscriptions = userSubscriptions?.sort((a, b) => {
    if (a.status === "active" && b.status !== "active") {
      return -1;
    }

    if (a.status === "paused" && b.status === "cancelled") {
      return -1;
    }

    return 0;
  });

  // Function to render content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "modelProvider":
        return (
          <div className="flex flex-col gap-4 py-4">
            <ModelSettings />
          </div>
        );
      case "members":
        return (
          <div className="flex flex-col gap-4 py-4">
            <p>Manage workspace members.</p>
          </div>
        );
      case "myAccount":
        return (
          <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue="Divyesh Radadiya"
                className="col-span-3"
              />
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                defaultValue="divyeshradadiya21@gmail.com"
                className="col-span-3"
              />
            </div>
          </div>
        );
      case "integrations":
        return <p className="text-sm">Manage integrations here.</p>;
      case "language":
        return <p className="text-sm">Select your preferred language.</p>;
      case "billing":
        return (
          <div>
            <BillingSetting />
            hi
          </div>
        );
      default:
        return <p className="text-sm">No content available for this tab.</p>;
    }
  };

  return (
    <>
      <Modal
        isShow={isOpen}
        onClose={() => onClose()}
        className="flex h-full min-h-[100vh] w-[1000px] py-1 text-sm"
        closableIcon
      >
        {/* Sidebar */}
        <div className="w-[20%] border-r p-4 pl-0 pt-2">
          <h1 className="mb-2 pl-2 text-xl text-gray-700">Settings</h1>

          {/* Workspace Section */}
          <h2 className="text-md mt-2 pl-2 font-semibold">Workspace</h2>
          <Separator className="my-1" />
          <ul className="mb-6 space-y-2">
            {workspaceTabs.map((tab) => (
              <li key={tab.id}>
                <button
                  className={`flex w-full items-center gap-1 rounded-[5px] p-2 py-1.5 text-left ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600"
                      : "bg-white text-gray-700 hover:bg-slate-100"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Account Section */}
          <h2 className="text-md mb-2 pl-2 font-semibold">Personal</h2>
          <Separator />
          <ul className="space-y-2">
            {accountTabs.map((tab) => (
              <li key={tab.id}>
                <button
                  className={`flex w-full items-center gap-1 rounded-[8px] p-1.5 text-left ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600"
                      : "bg-white text-gray-700 hover:bg-slate-100"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          <div className="p-2 pl-0 font-sans text-lg font-[400] text-gray-700 shadow-sm">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings
          </div>

          {/* Scrollable Content */}
          <section className="flex-1 overflow-y-auto">
            {renderContent()}
          </section>

          {/* Footer / Save button */}
          <div className="border-t p-4">
            <Button className="bg-blue-600 hover:bg-blue-700" type="submit">
              Save changes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

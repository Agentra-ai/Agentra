import Link from "next/link";
import { CitrusIcon, HomeIcon, SettingsIcon } from "lucide-react";

import { SidebarNav } from "./sidebar-nav";
import { UserMenu } from "./user-menu";
import { getUserDetails } from "@/actions/user";

export async function Sidebar() {
  const user = await getUserDetails();
  if (!user) return null;

  return (
    <aside className="bg-surface-100/70 m-5 mr-0 hidden flex-col gap-6 rounded-2xl px-3 pb-3 pt-5 md:flex">
      <div className="ml-4 flex size-10 items-center text-primary">
        <Link href="/dashboard">
          <CitrusIcon size={24} strokeWidth={1.5} />
        </Link>
      </div>

      <SidebarNav aria-label="Primary navigation">
        <SidebarNav.Item icon={<HomeIcon size={16} />} href="/dashboard">
          Dashboard
        </SidebarNav.Item>

        <SidebarNav aria-label="Secondary navigation">
          <SidebarNav.Item
            icon={<SettingsIcon size={16} />}
            href="/dashboard/billing"
          >
            Billing
          </SidebarNav.Item>
        </SidebarNav>
      </SidebarNav>

      <div className="mt-auto flex flex-col justify-stretch gap-3">
        <UserMenu user={user} />
      </div>
    </aside>
  );
}

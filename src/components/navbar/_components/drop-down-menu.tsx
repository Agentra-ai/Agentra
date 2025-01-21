import Link from "next/link"
import {
  BarChart,
  Code,
  DollarSign,
  Headphones,
  PaintBucket,
  Settings,
  UserPlus,
} from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

interface DropDownMenuProps {
  onClose: () => void
}

const DropdownMenu: React.FC<DropDownMenuProps> = ({ onClose }) => {
  const handleLinkClick = () => {
    onClose()
  }

  const accordionData = [
    {
      value: "item-1",
      title: "Use Cases",
      links: [
        {
          href: "/team-alignment",
          icon: UserPlus,
          text: "Team alignment",
          color: "text-orange-400",
        },
        {
          href: "/sales",
          icon: DollarSign,
          text: "Sales",
          color: "text-green-400",
        },
        {
          href: "/engineering",
          icon: Code,
          text: "Engineering",
          color: "text-indigo-400",
        },
        {
          href: "/design",
          icon: PaintBucket,
          text: "Design",
          color: "text-blue-400",
        },
        {
          href: "/marketing",
          icon: BarChart,
          text: "Marketing",
          color: "text-rose-400",
        },
        {
          href: "/product-management",
          icon: Settings,
          text: "Product Management",
          color: "text-grey-400",
        },
        {
          href: "/support",
          icon: Headphones,
          text: "Support",
          color: "text-amber-400",
        },
      ],
    },
    {
      value: "item-2",
      title: "For Business",
      links: [
        {
          href: "/team-alignment",
          icon: UserPlus,
          text: "Team alignment",
          color: "text-orange-400",
        },
        {
          href: "/sales",
          icon: DollarSign,
          text: "Sales",
          color: "text-green-400",
        },
        {
          href: "/engineering",
          icon: Code,
          text: "Engineering",
          color: "text-indigo-400",
        },
        {
          href: "/design",
          icon: PaintBucket,
          text: "Design",
          color: "text-blue-400",
        },
        {
          href: "/marketing",
          icon: BarChart,
          text: "Marketing",
          color: "text-rose-400",
        },
        {
          href: "/product-management",
          icon: Settings,
          text: "Product Management",
          color: "text-grey-400",
        },
        {
          href: "/support",
          icon: Headphones,
          text: "Support",
          color: "text-amber-400",
        },
      ],
    },
    {
      value: "item-3",
      title: "Resources",
      links: [
        {
          href: "/team-alignment",
          icon: UserPlus,
          text: "Team alignment",
          color: "text-orange-400",
        },
        {
          href: "/sales",
          icon: DollarSign,
          text: "Sales",
          color: "text-green-400",
        },
        {
          href: "/engineering",
          icon: Code,
          text: "Engineering",
          color: "text-indigo-400",
        },
        {
          href: "/design",
          icon: PaintBucket,
          text: "Design",
          color: "text-blue-400",
        },
        {
          href: "/marketing",
          icon: BarChart,
          text: "Marketing",
          color: "text-rose-400",
        },
        {
          href: "/product-management",
          icon: Settings,
          text: "Product Management",
          color: "text-grey-400",
        },
        {
          href: "/support",
          icon: Headphones,
          text: "Support",
          color: "text-amber-400",
        },
      ],
    },
    {
      value: "item-4",
      title: "Company",
      links: [
        {
          href: "/team-alignment",
          icon: UserPlus,
          text: "Team alignment",
          color: "text-orange-400",
        },
        {
          href: "/sales",
          icon: DollarSign,
          text: "Sales",
          color: "text-green-400",
        },
        {
          href: "/engineering",
          icon: Code,
          text: "Engineering",
          color: "text-indigo-400",
        },
        {
          href: "/design",
          icon: PaintBucket,
          text: "Design",
          color: "text-blue-400",
        },
        {
          href: "/marketing",
          icon: BarChart,
          text: "Marketing",
          color: "text-rose-400",
        },
        {
          href: "/product-management",
          icon: Settings,
          text: "Product Management",
          color: "text-grey-400",
        },
        {
          href: "/support",
          icon: Headphones,
          text: "Support",
          color: "text-amber-400",
        },
      ],
    },
  ]

  return (
    <div className="absolute right-0 h-screen w-screen items-center justify-center bg-white px-4 xl:hidden">
      <Accordion
        defaultValue="item-1"
        className="pl-2"
        type="single"
        collapsible
      >
        {accordionData.map((item) => (
          <>
            <AccordionItem
              key={item.value}
              className="mt-6 border-b"
              value={item.value}
            >
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent className="space-y-2">
                {item.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex"
                    onClick={handleLinkClick}
                  >
                    <div>
                      <link.icon className={`mr-4 h-6 w-6 ${link.color}`} />
                    </div>
                    <div>{link.text}</div>
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </>
        ))}
        <Accordion
          defaultValue="item-1"
          className="pl-2"
          type="single"
          collapsible
        >
          <AccordionItem className="mt-6 border-b" value="Pricing">
            <AccordionTrigger>{"Pricing"}</AccordionTrigger>
            <AccordionContent className="space-y-2">
              Most Affortable
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Link
          href={"/contact"}
          className="flex flex-1 items-center justify-between border-b py-4"
          onClick={handleLinkClick}
        >
          Request a demo
        </Link>
      </Accordion>

      <div className="pt-12">
        <div className="flex flex-col space-y-4 px-4">
          <Link href={"/auth/register"}>
            <Button className="w-full">Get WorkWave free</Button>
          </Link>
          <Link href={"/sign-in"}>
            <Button variant={"outline"} className="w-full">
              Log in
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DropdownMenu

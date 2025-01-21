import React from "react"
import Image from "next/image"

const apps = [
  {
    id: 1,
    title: "Customer Service Bot",
    description:
      "Manage customer service scenarios with conversation variables and dialogue count. Build a customer service chatbot that can handle various customer queries, provide instant responses, and improve customer satisfaction by offering 24/7 support.",
    category: "Customer Service",
    image: "🤖", // Emoji related to title
  },
  {
    id: 2,
    title: "Memory Assistant",
    description:
      "Inspired by OpenAI's personalized memory, this assistant uses prompts from the open-source project mem0ai. It helps users remember important information, set reminders, and manage their daily tasks efficiently.",
    category: "Assistant",
    image: "🧠", // Emoji related to title
  },
  {
    id: 3,
    title: "Interview Prep Bot",
    description:
      "Generates mock interview questions by gathering information from the internet. Demonstrates IF/ELSE and parallel run. This bot helps users prepare for interviews by simulating real interview scenarios and providing feedback on their responses.",
    category: "Interview",
    image: "🎤", // Emoji related to title
  },
  {
    id: 4,
    title: "Sales Agent",
    description:
      "Automate sales processes and interactions with potential customers using AI. This bot can handle lead generation, follow-ups, and customer engagement, helping sales teams close deals faster and more efficiently.",
    category: "Sales",
    image: "💼", // Emoji related to title
  },
  {
    id: 5,
    title: "Tutor Bot",
    description:
      "Provides educational assistance and tutoring in various subjects. This bot can help students with homework, explain complex concepts, and offer personalized learning experiences to improve their academic performance.",
    category: "Education",
    image: "📚", // Emoji related to title
  },
  {
    id: 6,
    title: "HR Assistant",
    description:
      "Helps with HR-related tasks such as onboarding, employee queries, and more. This bot can streamline HR processes, manage employee records, and provide instant support to employees, enhancing overall HR efficiency.",
    category: "HR",
    image: "👥", // Emoji related to title
  },
  {
    id: 7,
    title: "Programming Assistant",
    description:
      "Assists with coding tasks, debugging, and code generation. This bot can help developers write code faster, find and fix bugs, and generate code snippets based on specific requirements, improving overall productivity.",
    category: "Programming",
    image: "💻", // Emoji related to title
  },
  {
    id: 8,
    title: "Workflow Automation Bot",
    description:
      "Automates repetitive tasks and workflows to increase productivity. This bot can handle tasks such as data entry, report generation, and process automation, allowing users to focus on more strategic activities.",
    category: "Workflow",
    image: "🔄", // Emoji related to title
  },
  {
    id: 9,
    title: "Marketing Agent",
    description:
      "Assists with marketing tasks such as campaign management, content creation, and analytics. This bot can help marketers plan and execute campaigns, create engaging content, and analyze performance metrics to optimize marketing strategies.",
    category: "Marketing",
    image: "📈", // Emoji related to title
  },
  {
    id: 10,
    title: "Finance Assistant",
    description:
      "Helps with financial tasks such as budgeting, expense tracking, and financial planning. This bot can assist users in managing their finances, creating budgets, tracking expenses, and planning for future financial goals.",
    category: "Finance",
    image: "💰", // Emoji related to title
  },
  {
    id: 11,
    title: "Legal Advisor Bot",
    description:
      "Provides legal advice and assistance with legal documentation and compliance. This bot can help users understand legal terms, draft legal documents, and ensure compliance with relevant laws and regulations.",
    category: "Legal",
    image: "⚖️", // Emoji related to title
  },
  {
    id: 12,
    title: "Project Management Bot",
    description:
      "Assists with project management tasks such as task assignment, progress tracking, and deadline management. This bot can help project managers organize tasks, monitor project progress, and ensure timely completion of projects.",
    category: "Project Management",
    image: "📅", // Emoji related to title
  },
]

const ExploreApps = () => {
  return (
    <div className="flex h-[calc(100vh-60px)] flex-col bg-gray-100">
      {/* Header Section */}
      <div className="flex flex-col px-12 py-6">
        <h1 className="mb-2 text-2xl font-semibold text-blue-700">
          Explore Apps by Agentra.ai
        </h1>
        <p className="mb-4 border-b pb-2 text-sm text-gray-600">
          Use these template apps instantly or customize your own apps based on
          the templates.
        </p>

        {/* Category Navigation */}
        <div className="flex gap-6 text-[14px] text-gray-600">
          <button className="font-medium text-blue-700">Recommended</button>
          <button>Agent</button>
          <button>Assistant</button>
          <button>HR</button>
          <button>Programming</button>
          <button>Workflow</button>
          <button>Writing</button>
        </div>
      </div>

      {/* Apps Section - Only this part scrolls */}
      <div className="h-[calc(100vh-120px)] flex-1 overflow-y-auto px-12 py-6 pt-3">
        <div className="grid grid-cols-2 gap-6">
          {apps.map((app) => (
            <div
              key={app.id}
              className="min-h-[160px] rounded-[8px] bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-2 flex items-center justify-between text-[12px]">
                {/* Add image before the title */}
                <div className="flex items-center">
                  {/* Image */}
                  <span className="mr-4 text-2xl">{app.image}</span>
                  {/* <Image
                      src={
                        app.image
                      }
                      alt={""}
                      className="mr-4 h-10 w-10 rounded-[8px] bg-yellow-200"
                      width={20}
                      height={20}
                    /> */}
                  {/* Title */}
                  <h2 className="text-[14px] font-semibold text-gray-800 ">
                    {app.title}
                  </h2>
                </div>
                <span className="text-gray-600">{app.category}</span>
              </div>
              <p className="mt-2 text-[12px] text-gray-600">
                {app.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExploreApps

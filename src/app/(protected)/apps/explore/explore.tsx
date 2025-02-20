'use client'

import React from "react"
import Image from "next/image"
import {useState} from "react"

const apps = [
  {
    id: 1,
    title: "Customer Service Bot",
    description:
      "Manage customer service scenarios with conversation variables and dialogue count. Build a customer service chatbot that can handle various customer queries, provide instant responses, and improve customer satisfaction by offering 24/7 support.",
    category: "Agent", // Changed to "Agent"
    image: "🤖",
  },
  {
    id: 2,
    title: "Memory Assistant",
    description:
      "Inspired by OpenAI's personalized memory, this assistant uses prompts from the open-source project mem0ai. It helps users remember important information, set reminders, and manage their daily tasks efficiently.",
    category: "Assistant", // Matches navigation
    image: "🧠",
  },
  {
    id: 3,
    title: "Interview Prep Bot",
    description:
      "Generates mock interview questions by gathering information from the internet. Demonstrates IF/ELSE and parallel run. This bot helps users prepare for interviews by simulating real interview scenarios and providing feedback on their responses.",
    category: "Assistant", // Changed to "Assistant"
    image: "🎤",
  },
  {
    id: 4,
    title: "Sales Agent",
    description:
      "Automate sales processes and interactions with potential customers using AI. This bot can handle lead generation, follow-ups, and customer engagement, helping sales teams close deals faster and more efficiently.",
    category: "Agent", // Changed to "Agent"
    image: "💼",
  },
  {
    id: 5,
    title: "Tutor Bot",
    description:
      "Provides educational assistance and tutoring in various subjects. This bot can help students with homework, explain complex concepts, and offer personalized learning experiences to improve their academic performance.",
    category: "Assistant", // Changed to "Assistant"
    image: "📚",
  },
  {
    id: 6,
    title: "HR Assistant",
    description:
      "Helps with HR-related tasks such as onboarding, employee queries, and more. This bot can streamline HR processes, manage employee records, and provide instant support to employees, enhancing overall HR efficiency.",
    category: "HR", // Matches navigation
    image: "👥",
  },
  {
    id: 7,
    title: "Programming Assistant",
    description:
      "Assists with coding tasks, debugging, and code generation. This bot can help developers write code faster, find and fix bugs, and generate code snippets based on specific requirements, improving overall productivity.",
    category: "Programming", // Matches navigation
    image: "💻",
  },
  {
    id: 8,
    title: "Workflow Automation Bot",
    description:
      "Automates repetitive tasks and workflows to increase productivity. This bot can handle tasks such as data entry, report generation, and process automation, allowing users to focus on more strategic activities.",
    category: "Workflow", // Matches navigation
    image: "🔄",
  },
  {
    id: 9,
    title: "Marketing Agent",
    description:
      "Assists with marketing tasks such as campaign management, content creation, and analytics. This bot can help marketers plan and execute campaigns, create engaging content, and analyze performance metrics to optimize marketing strategies.",
    category: "Agent", // Changed to "Agent"
    image: "📈",
  },
  {
    id: 10,
    title: "Finance Assistant",
    description:
      "Helps with financial tasks such as budgeting, expense tracking, and financial planning. This bot can assist users in managing their finances, creating budgets, tracking expenses, and planning for future financial goals.",
    category: "Assistant", // Changed to "Assistant"
    image: "💰",
  },
  {
    id: 11,
    title: "Legal Advisor Bot",
    description:
      "Provides legal advice and assistance with legal documentation and compliance. This bot can help users understand legal terms, draft legal documents, and ensure compliance with relevant laws and regulations.",
    category: "Writing", // Changed to "Writing"
    image: "⚖️",
  },
  {
    id: 12,
    title: "Project Management Bot",
    description:
      "Assists with project management tasks such as task assignment, progress tracking, and deadline management. This bot can help project managers organize tasks, monitor project progress, and ensure timely completion of projects.",
    category: "Workflow", // Changed to "Workflow"
    image: "📅",
  },
];


const ExploreApps = () => {
  const [selectedCategory, setSelectedCategory] = useState("Recommended");

  const categoryColors: { [key: string]: string } = {
    Recommended: "bg-gray-100",
    Agent: "bg-blue-100",
    Assistant: "bg-green-100",
    HR: "bg-purple-100",
    Programming: "bg-yellow-100",
    Workflow: "bg-pink-100",
    Writing: "bg-indigo-100",
  };

  const filteredApps =
    selectedCategory === "Recommended"
      ? apps
      : apps.filter((app) => app.category === selectedCategory);

  return (
    <div className="flex h-[calc(100vh-60px)] flex-col bg-gray-100">
      <div className="flex flex-col px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-gray-50 to-blue-50 mx-12 my-2 rounded-lg">
        <h1 className="mb-2 text-xl font-semibold text-blue-700">
          Explore pre-built Apps for your business
        </h1>
        <p className="mb-4 border-b pb-2 text-sm text-gray-600">
          Use these template apps instantly or customize your own apps based on
          the templates.
        </p>

        {/* Category Navigation */}
        <div className="flex gap-2">
          {[
            { name: "Recommended" },
            { name: "Agent" },
            { name: "Assistant" },
            { name: "HR" },
            { name: "Programming" },
            { name: "Workflow" },
            { name: "Writing" },
          ].map(({ name }) => (
            <button
              key={name}
              onClick={() => setSelectedCategory(name)}
              className={`rounded-full px-4 py-2 text-xs hover:bg-gray-50 bg-white ${
                selectedCategory === name ? "!bg-blue-600 text-white" : ""
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Apps Section - Only this part scrolls */}
      <div className="h-[calc(100vh-120px)] flex-1 overflow-y-auto px-12 py-6 pt-3">
        <div className="grid grid-cols-2 gap-6">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="min-h-[160px] rounded-[8px] bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-2 flex items-center justify-between text-[12px]">
                {/* Add image before the title */}
                <div className="flex items-center">
                  {/* Image with dynamic background color */}
                  <span
                    className={`mr-2 text-lg p-1 px-1.5 rounded-md ${
                      categoryColors[app.category] || "bg-gray-100"
                    }`}
                  >
                    {app.image}
                  </span>
                  {/* Title */}
                  <h2 className="text-[14px] font-semibold text-gray-800">
                    {app.title}
                  </h2>
                </div>
                <span className="text-gray-600">{app.category}</span>
              </div>
              <p className="mt-2 text-[12px] text-gray-600">
                {app.description}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Use Template →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreApps;
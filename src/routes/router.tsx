import { Suspense } from "react"
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom"

import LoadingIcon from "@/components/loading"
import MagicLinkSignInPage from "@/app/(auth)/signin/magic-link-signin/page"
import SignInPage from "@/app/(auth)/signin/page"
import PasswordReset from "@/app/(auth)/signin/password-reset/page"
import SignUpPage from "@/app/(auth)/signup/page"
import ReverifyEmailPage from "@/app/(auth)/signup/reverify-email/page"
import ConfigurationPage from "@/app/(protected)/app/[id]/configuration/configuration"
import Customization from "@/app/(protected)/app/[id]/customization/page"
import LogsHistory from "@/app/(protected)/app/[id]/logs/page"
import Monitoring from "@/app/(protected)/app/[id]/monitoring/page"
import CreateAppDocument from "@/app/(protected)/apps/documents/create/page"
import AppDocuments from "@/app/(protected)/apps/documents/documents"
import Explore from "@/app/(protected)/apps/explore/page"
import LiveAgents from "@/app/(protected)/apps/liveagents/page"
import Studio from "@/app/(protected)/apps/studio/page"
import Tools from "@/app/(protected)/apps/tools/page"
import AiBoard from "@/app/(protected)/boards/aiboard/page"
import CalenderBoard from "@/app/(protected)/boards/calender/page"
import Dashboard from "@/app/(protected)/boards/dashboard/page"
import KanbanBoard from "@/app/(protected)/boards/kanban/page"
import TeamBoard from "@/app/(protected)/boards/team/page"
import Documents from "@/app/(protected)/docs/[id]/documents/page"
import DocsAppSettings from "@/app/(protected)/docs/[id]/settings/page"
import DocsTesting from "@/app/(protected)/docs/[id]/testing/page"
import AskMe from "@/app/(protected)/docshub/askme/page"
import DocsHubDocument from "@/app/(protected)/docshub/documents/page"

import { AppConstantRoutes } from "./paths"

// const LayoutWithAuth = lazy(() => import("@components/LayoutWithAuth"))

export const getDefaultRoute = (role?: string[]) => {
  console.log(role)
  // todo: redirect according to role
  return AppConstantRoutes.paths.apps.explore
}

const handleDefaultRoute = () => {
  // if (authLocal) {
  //     const destination = getDefaultRoute(authLocal.userRoles)
  //     return <Navigate to={destination} replace />
  // } else {
  //     return <Navigate to={AppConstantRoutes.paths.auth.login} replace />
  // }
  return <Navigate to={AppConstantRoutes.paths.auth.signIn} replace />
}

export const router = createBrowserRouter([
  {
    path: "*",
    element: handleDefaultRoute(),
  },
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingIcon />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        path: AppConstantRoutes.paths.auth.default,
        children: [
          {
            path: AppConstantRoutes.paths.auth.signIn,
            element: <SignInPage />,
          },
          {
            path: AppConstantRoutes.paths.auth.signIn,
            element: <SignUpPage />,
          },
        ],
      },
      {
        path: AppConstantRoutes.paths.app.default,
        children: [
          {
            path: AppConstantRoutes.paths.app.configuration,
            element: <ConfigurationPage />,
          },
          {
            path: AppConstantRoutes.paths.app.customization,
            element: <Customization />,
          },
          {
            path: AppConstantRoutes.paths.app.logs,
            element: <LogsHistory />,
          },
          {
            path: AppConstantRoutes.paths.app.monitoring,
            element: <Monitoring />,
          },
        ],
      },
      {
        path: AppConstantRoutes.paths.apps.default,
        children: [
          {
            path: AppConstantRoutes.paths.apps.documents,
            children: [
              {
                path: "",
                element: <AppDocuments />,
              },
              {
                path: AppConstantRoutes.paths.apps.createDocument,
                element: <CreateAppDocument />,
              },
            ],
          },
          {
            path: AppConstantRoutes.paths.apps.explore,
            element: <Explore />,
          },
          {
            path: AppConstantRoutes.paths.apps.liveAgents,
            element: <LiveAgents />,
          },
          {
            path: AppConstantRoutes.paths.apps.studio,
            element: <Studio />,
          },
          {
            path: AppConstantRoutes.paths.apps.tools,
            element: <Tools />,
          },
        ],
      },
      {
        path: AppConstantRoutes.paths.boards.default,
        children: [
          //   {
          //     path: "",
          //     element: <Board />,
          //   },
          {
            path: AppConstantRoutes.paths.boards.aiBoard,
            element: <AiBoard />,
          },
          {
            path: AppConstantRoutes.paths.boards.calendar,
            element: <CalenderBoard />,
          },
          {
            path: AppConstantRoutes.paths.boards.dashboard,
            element: <Dashboard />,
          },
          {
            path: AppConstantRoutes.paths.boards.kanban,
            element: <KanbanBoard />,
          },
          {
            path: AppConstantRoutes.paths.boards.team,
            element: <TeamBoard />,
          },
        ],
      },
      //   {
      //     path: AppConstantRoutes.paths.chatbot,
      //     element: <Chatbot />,
      //   },
      //   {
      //     path: AppConstantRoutes.paths.dashboard.default,
      //     children: [
      //       {
      //         path: "",
      //         element: <Dashboard />,
      //       },
      //       {
      //         path: AppConstantRoutes.paths.dashboard.account,
      //         element: <AccountPage />,
      //       },
      //       {
      //         path: AppConstantRoutes.paths.dashboard.settings,
      //         element: <Settings />,
      //       },
      //     ],
      //   },
      {
        path: AppConstantRoutes.paths.docs.default,
        children: [
          {
            path: AppConstantRoutes.paths.docs.documents,
            element: <Documents />,
          },
          {
            path: AppConstantRoutes.paths.docs.settings,
            element: <DocsAppSettings />,
          },
          {
            path: AppConstantRoutes.paths.docs.testing,
            element: <DocsTesting />,
          },
        ],
      },
      {
        path: AppConstantRoutes.paths.docsHub.default,
        children: [
          {
            path: AppConstantRoutes.paths.docsHub.askMe,
            element: <AskMe />,
          },
          {
            path: AppConstantRoutes.paths.docsHub.documents,
            element: <DocsHubDocument />,
          },
        ],
      },
      //   {
      //     path: AppConstantRoutes.paths.faq,
      //     element: <FAQ />,
      //   },
      //   {
      //     path: AppConstantRoutes.paths.features,
      //     element: <Features />,
      //   },
      //   {
      //     path: AppConstantRoutes.paths.integrations,
      //     element: <Integrations />,
      //   },
      //   {
      //     path: AppConstantRoutes.paths.pricing,
      //     element: <Pricing />,
      //   },
      //   {
      //     path: AppConstantRoutes.paths.privacy,
      //     element: <Privacy />,
      //   },
      {
        path: AppConstantRoutes.paths.signin.default,
        children: [
          {
            path: "",
            element: <SignInPage />,
          },
          {
            path: AppConstantRoutes.paths.signin.magicLinkSignin,
            element: <MagicLinkSignInPage />,
          },
          {
            path: AppConstantRoutes.paths.signin.passwordReset,
            element: <PasswordReset />,
          },
          //   {
          //     path: AppConstantRoutes.paths.signin.passwordUpdate,
          //     element: <PasswordUpdate />,
          //   },
        ],
      },
      {
        path: AppConstantRoutes.paths.signup.default,
        children: [
          {
            path: "",
            element: <SignUpPage />,
          },
          {
            path: AppConstantRoutes.paths.signup.reverifyEmail,
            element: <ReverifyEmailPage />,
          },
          //   {
          //     path: AppConstantRoutes.paths.signup.verifyEmail,
          //     element: <VerifyEmailPage />,
          //   },
        ],
      },
    ],
  },
])

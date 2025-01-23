import { signIn } from "@/auth"

export const AppConstantRoutes = {
  paths: {
    get auth() {
      return {
        get default() {
          return "/auth"
        },
        get signIn() {
          return `${this.default}/signIn`
        },
        get signup() {
          return `${this.default}/signup`
        },
        get magicLinkSignin() {
          return `${this.default}/magic-link-signin`
        },
        get passwordReset() {
          return `${this.default}/password-reset`
        },
        get passwordUpdate() {
          return `${this.default}/password-update`
        },
      }
    },
    get app() {
      return {
        get default() {
          return "/app"
        },
        get configuration() {
          return `${this.default}/:id/configuration`
        },
        get customization() {
          return `${this.default}/:id/customization`
        },
        get logs() {
          return `${this.default}/:id/logs`
        },
        get monitoring() {
          return `${this.default}/:id/monitoring`
        },
      }
    },
    get apps() {
      return {
        get default() {
          return "/apps"
        },
        get documents() {
          return `${this.default}/documents`
        },
        get createDocument() {
          return `${this.documents}/create`
        },
        get explore() {
          return `${this.default}/explore`
        },
        get liveAgents() {
          return `${this.default}/liveagents`
        },
        get studio() {
          return `${this.default}/studio`
        },
        get tools() {
          return `${this.default}/tools`
        },
      }
    },
    get boards() {
      return {
        get default() {
          return "/boards"
        },
        get aiBoard() {
          return `${this.default}/aiboard`
        },
        get calendar() {
          return `${this.default}/calendar`
        },
        get dashboard() {
          return `${this.default}/dashboard`
        },
        get kanban() {
          return `${this.default}/kanban`
        },
        get team() {
          return `${this.default}/team`
        },
      }
    },
    get chatbot() {
      return "/chatbot/:token"
    },
    get dashboard() {
      return {
        get default() {
          return "/dashboard"
        },
        get account() {
          return `${this.default}/account`
        },
        get settings() {
          return `${this.default}/settings`
        },
      }
    },
    get docs() {
      return {
        get default() {
          return "/docs"
        },
        get documents() {
          return `${this.default}/:id/documents`
        },
        get documentFile() {
          return `${this.default}/:docsId/documents/:fileId`
        },
        get settings() {
          return `${this.default}/:docsId/settings`
        },
        get testing() {
          return `${this.default}/:docsId/testing`
        },
      }
    },
    get docsHub() {
      return {
        get default() {
          return "/docshub"
        },
        get askMe() {
          return `${this.default}/askme`
        },
        get documents() {
          return `${this.default}/documents`
        },
      }
    },
    get signin() {
      return {
        get default() {
          return "/signin"
        },
        get magicLinkSignin() {
          return `${this.default}/magic-link-signin`
        },
        get passwordReset() {
          return `${this.default}/password-reset`
        },
        get passwordUpdate() {
          return `${this.default}/password-update`
        },
      }
    },
    get signup() {
      return {
        get default() {
          return "/signup"
        },
        get reverifyEmail() {
          return `${this.default}/reverify-email`
        },
        get verifyEmail() {
          return `${this.default}/verify-email`
        },
      }
    },
    get tos() {
      return "/tos"
    },
    get faq() {
      return "/faq"
    },
    get features() {
      return "/features"
    },
    get integrations() {
      return "/integrations"
    },
    get pricing() {
      return "/pricing"
    },
    get privacy() {
      return "/privacy"
    },
    get api() {
      return {
        get appDocs() {
          return {
            get deleteDocs() {
              return "/api/app-docs/delete-docs"
            },
            get deleteFiles() {
              return "/api/app-docs/delete-files"
            },
            get getDocs() {
              return "/api/app-docs/get-docs"
            },
            get getFiles() {
              return "/api/app-docs/get-files"
            },
          }
        },
        get app() {
          return {
            get createApp() {
              return "/api/app/create-app"
            },
            get deleteApp() {
              return "/api/app/delete-app"
            },
            get getApps() {
              return "/api/app/get-apps"
            },
          }
        },
        get chat() {
          return {
            get default() {
              return "/api/chat"
            },
            get liveChat() {
              return `${this.default}/live-chat`
            },
          }
        },
        get conversation() {
          return {
            get createNewChat() {
              return "/api/conversation/create-new-chat"
            },
            get getChats() {
              return "/api/conversation/get-chats"
            },
          }
        },
        get workspaceDetails() {
          return "/api/workspace/workspace-details"
        },
      }
    },
  },
}

interface LemonSqueezyInstance {
  Url: {
    Open: (url: string) => void
  }
}

declare global {
  interface Window {
    LemonSqueezy: LemonSqueezyInstance
  }
}

export {}

"use client"

import { useAuthStore } from "@/store/useAuthStore"

import auth from "@/lib/auth"

const getAuthDetails = async () => {
  try {
    const session = await auth()

    if (!session || !session.user.email) return null

    const userDetails = await session.user
    console.log("getAuthDetails", userDetails)

    const setUserDetails = useAuthStore((state) => state.setUserDetails)
    setUserDetails(userDetails)
    // return userDetails || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting user details")
  }
}

export default getAuthDetails

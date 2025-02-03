// import { NextApiRequest, NextApiResponse } from 'next'
// import { createConversation } from '@/actions/chat/create-chat-action'

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === 'POST') {
//     const { conversationId } = req.body

//     try {
//       await createConversation(conversationId)
//       res.status(200).json({ message: 'Conversation created successfully' })
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to create conversation' })
//     }
//   } else {
//     res.status(405).json({ error: 'Method not allowed' })
//   }
// }

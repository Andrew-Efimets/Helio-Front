import { useMessageStore } from '@/stores/messages'
import { useChatStore } from '@/stores/chats'
import { useNotificationStore } from '@/stores/notifications'
import router from '@/router'

export function useChatSocket() {
  const messageStore = useMessageStore()
  const chatStore = useChatStore()
  const notify = useNotificationStore()

  let currentChannel: any = null

  const leaveChannel = (chatId: string | number) => {
    if (chatId) {
      window.Echo.leave(`chats.${chatId}`)
    }
  }

  const subscribeToChat = (
    chatId: string | number,
    userId: number,
    routeChatId: any,
    onNewMessage: () => void,
  ) => {
    currentChannel = window.Echo.private(`chats.${chatId}`)

    currentChannel
      .listen('.message.created', (e: any) => {
        if (Number(e.message.chat_id) === Number(chatId)) {
          messageStore.addEchoMessage(e.message)
          onNewMessage()
          if (Number(e.message.user_id) !== userId) {
            messageStore.markAsRead(String(chatId))
          }
        }
      })
      .listen('.message.updated', (e: any) => {
        messageStore.updateEchoMessage(e.message)
      })
      .listen('.message.read', (e: { readAt: string }) => {
        messageStore.messages.forEach((m) => {
          if (Number(m.user_id) === Number(userId) && !m.read_at) {
            m.read_at = e.readAt
          }
        })
      })
      .listen('.member.added', (e: any) => {
        if (Number(e.initiatorId) === Number(userId)) {
          return
        }
        if (Number(e.newMember.id) !== Number(userId)) {
          if (chatStore.chat) {
            chatStore.chat.participants.push(e.newMember)
          }
          notify.show(`${e.newMember.name} присоединился(-ась) к группе`, 'info')
        } else {
          notify.show(`Вы присоединились к группе`, 'success')
        }
      })
      .listen('.member.deleted', (e: any) => {
        if (Number(e.initiatorId) === Number(userId)) {
          return
        }
        if (Number(e.deletedId) !== Number(userId)) {
          if (chatStore.chat) {
            chatStore.chat.participants = chatStore.chat.participants.filter(
              (p) => Number(p.id) !== Number(e.deletedId),
            )
          }
          notify.show(`${e.deletedName} покинул(а) группу`, 'info')
        } else {
          chatStore.chat = null
          window.Echo.leave(`chats.${e.chatId}`)
        }
        chatStore.fetchAllChats(undefined, true)
      })
      .listen('.chat.terminated', (e: any) => {
        if (e.type === 'group_deleted') {
          notify.show(`Группа была удалена администратором`, 'error')
        } else if (e.userId && Number(e.userId) !== Number(userId)) {
          chatStore.chat.participants = chatStore.chat.participants.filter((p) => p.id !== e.userId)
          notify.show(`${e.userName} покинул(а) чат`, 'info')
          return
        }

        window.Echo.leave(`chats.${e.chatId}`)
        if (Number(routeChatId) === Number(e.chatId)) {
          router.push({ name: 'chats' })
          chatStore.chat = null
        }
        chatStore.fetchAllChats(undefined, true)
      })
  }

  return {
    subscribeToChat,
    leaveChannel,
  }
}

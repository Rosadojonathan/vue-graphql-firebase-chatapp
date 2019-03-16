import firebaseApp from '../firebase';

const CHAT_CHANNEL = 'CHAT_CHANNEL';

const resolvers = {
  Query: {
    async chats (root, args, context) {
      const chats = []
      const snapshot = await firebaseApp.collection('chats').get()
      await snapshot.docs.map(doc =>  chats.push({id: doc.id, ...doc.data()}))
      return chats.reverse()
    }
  },
  Mutation: {
    async sendMessage (root, {from, message }, { pubsub }) {
      const chat = { from, message }
      const chatJustAdded =  await firebaseApp.collection('chats').add(chat)
      const firebaseChat = await {id: chatJustAdded.id, from, message}
      pubsub.publish('CHAT_CHANNEL', { messageSent: firebaseChat })
      return firebaseChat;
    }
  },

  Subscription: {
    messageSent: {
      subscribe: (root, args, { pubsub }) => {
        return pubsub.asyncIterator(CHAT_CHANNEL)
      }
    }
  }
}

module.exports = resolvers;
import messageServices from "../Services/messageServices.js";

const subscribers = []; //stores any new messages sent upon listening

const fetchMessages = async() => {
    const data = await messageServices.getMessages();

    if(data && data.length < 1){
        return [];
    }
    const messages = data.map( message => {
        let msgObj = {
            id: message._id.toString(),
            text: message.text,
            senderName: message.senderName,
            receiverName: message.receiverName,
        }

        return msgObj;
    });
    return messages;
}

const messages = await fetchMessages();
//to push new users to the subscribers array
const onMessagesUpdates = (fn) => subscribers.push(fn);

const resolvers = {
    //add all the resolver functions here
    Query: { //gets all messages
        messages: async () => {
            return messages;
         } //returns the messages array
    },

    Mutation: { //post new message and returns id
        postMessage: async (parent, { senderName, receiverName, text }) => {
            let msgObj = {
                senderName,
                receiverName,
                text,
            }
            const data = await messageServices.postMessage(msgObj);
            const id = data._id.toString();
            
            messages.push({id, senderName, receiverName, text : data.text});
            subscribers.forEach((fn) => fn());
            return id; //return the id
        },
    },

    Subscription: {
        messages: {
          subscribe: async (parent, args, { pubsub }) => {
            //create random number as the channel to publish messages to
            const channel = Math.random().toString(36).slice(2, 15);

            //push the user to the subscriber array with onMessagesUpdates function and 
            //publish updated messages array to the channel as the callback
            onMessagesUpdates(() => pubsub.publish(channel, { messages }));
    
            //publish all messages immediately once a user subscribed
            setTimeout(() => pubsub.publish(channel, { messages }), 0);
    
            //returns the asyncIterator
            return pubsub.asyncIterator(channel);
          },
        },
    },
}

export default resolvers;
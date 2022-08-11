import messageServices from "../Services/messageServices.js";
// import { GooglePubSub } from '@axelspringer/graphql-google-pubsub';
// const pubsub = new GooglePubSub();
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

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

const SOMETHING_CHANGED_TOPIC = 'something_changed';
const fetch_messages = await fetchMessages();
//to push new users to the subscribers array
const onMessagesUpdates = (fn) => subscribers.push(fn);

const resolvers = {
    //add all the resolver functions here
    Query: { //gets all messages
        messages: async () => {
            pubsub.publish(SOMETHING_CHANGED_TOPIC, { messages: fetch_messages});
            return fetch_messages;
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
            
            fetch_messages.push({id, senderName, receiverName, text : data.text});
            pubsub.publish(SOMETHING_CHANGED_TOPIC, { messages: fetch_messages});
            
            return id; //return the id
        },
    },

    Subscription: {
        messages: {
            subscribe: () => { 
                return pubsub.asyncIterator(SOMETHING_CHANGED_TOPIC)
            },
        },
    },
}

export default resolvers;
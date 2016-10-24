let express = require('express');
let graphqlHTTP = require('express-graphql');
let { buildSchema } = require('graphql');

//graphQL stuff
let schema = buildSchema('\
    input MessageInput {\
        content: String\
        author: String\
    }\
    \
    type Message {\
        content: String\
        author: String\
    }\
    \
    type RandomNum {\
        min: Int!\
        max: Int!\
        singleNum: Int\
        multipleNums(numNums: Int!): [Int]\
    }\
    \
    type Query {\
        hello: String\
        randomNum(min: Int!, max: Int!): RandomNum\
        getMessage(id: ID!): Message\
        getAllMessages: [Message]\
    }\
    \
    type Mutation {\
        addMessage(message: MessageInput): ID\
        updateMessage(id: ID!, message: MessageInput): String\
        deleteMessage(id: ID!): String\
    }\
');

let root = {
    hello: 'Hello world!',
    randomNum: ({min, max}) => {
        return new RandomNum(min, max);
    },
    getMessage: getMessage,
    getAllMessages: getAllMessages,
    addMessage: addMessage,
    updateMessage: updateMessage,
    deleteMessage: deleteMessage
};
//end graphQL stuff


class RandomNum {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }

    singleNum() {
        return Math.floor(Math.random() * (this.max + 1 - this.min) + this.min);
    }

    multipleNums({numNums}) {
        let rands = [];
        let i;
        for (i = 0; i < numNums; i++) {
            rands.push(this.singleNum())
        }
        return rands;
    }
}

let messages = [{ content: 'It\'s raining tacos', author: 'tacos' }];
function getMessage({id}) {
    if (messages[id]) {
        return messages[id];
    } else {
        throw new Error( 'Message ' + id + ' does not exist.');
    }
}
function getAllMessages() {
    return messages;
}
function addMessage({message}) {
    messages.push(message);
    return messages.length - 1;
};
function updateMessage({id, message}) {
    if (messages[id]) {
        messages[id].content = message.content;
        messages[id].author = message.author
        return 'Message ' + id + ' updated.';
    } else {
        throw new Error( 'Message ' + id + ' does not exist.');
    }
}
function deleteMessage({id}) {
    if (messages[id]) {
        messages.splice(id, 1);
        return 'Message ' + id + ' deleted.';
    } else {
        throw new Error( 'Message ' + id + ' does not exist.');
    }
}



//routing stuff
let app = express();
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});
app.use(express.static('src'));
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000);
console.log('Running GraphQL at localhost:4000/graphql');
let mutationData = {
    query: 'mutation Mutation($message: MessageInput) {\
        addMessage(message: $message)\
    }',
    variables: {
        message: { 
            content: 'Test message', 
            author: 'test' 
        } 
    }
};

let mutationXhr = new XMLHttpRequest();
//mutationXhr.responseType = 'json';
mutationXhr.open('POST', '/graphql');
mutationXhr.setRequestHeader('Content-Type', 'application/json');
mutationXhr.setRequestHeader('Accept', 'application/json');
mutationXhr.onload = () => {
    let elm = document.createElement('div');
    elm.innerText = mutationXhr.response;
    document.body.appendChild(elm); 
};
mutationXhr.send(JSON.stringify(mutationData));



let queryData = {
    query: 'query Query($min: Int!, $max: Int!, $numNums: Int!) {\
        hello\
        randomNum(min: $min, max: $max) {\
            min\
            max\
            singleNum\
            multipleNums(numNums: $numNums)\
        }\
        getAllMessages{\
            content\
            author\
        }\
    }', 
    variables: { 
        min: 5, 
        max: 10, 
        numNums: 5
    }
};

let queryXhr = new XMLHttpRequest();
//xhr.responseType = 'json';
queryXhr.open('POST', '/graphql');
queryXhr.setRequestHeader('Content-Type', 'application/json');
queryXhr.setRequestHeader('Accept', 'application/json');
queryXhr.onload = () => {
    let elm = document.createElement('div');
    elm.innerText = queryXhr.response;
    document.body.appendChild(elm); 
};
queryXhr.send(JSON.stringify(queryData));
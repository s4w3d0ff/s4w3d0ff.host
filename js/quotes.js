var quotes = [
    'The disappearance of a sense of responsibility is the most far-reaching consequence of submission to authority.<br><span style="float:right;">--Stanley Milgram</span>',
    'The best way to become boring is to say everything.<br><span style="float:right;">--Voltaire</span>'
];

function getQuote(){
    document.getElementById("quote").innerHTML = quotes[~~(Math.random() * quotes.length)];
};

var quotes = [
    'The disappearance of a sense of responsibility is the most far-reaching consequence of submission to authority.<br><span style="float:right;">--Stanley Milgram</span>',
    'The best way to become boring is to say everything.<br><span style="float:right;">--Voltaire</span>',
	'The quieter you become the more you are able to hear.<br><span style="float:right;">--Rumi</span>',
	'Silence is only frightening to people who are compulsively verbalizing.<br><span style="float:right;">--William S. Burroughs</span>',
	'It may be that we are puppets-puppets controlled by the strings of society. But at least we are puppets with perception, with awareness. And perhaps our awareness is the first step to our liberation.<br><span style="float:right;">--Stanley Milgram</span>'
];

function getQuote(){
    document.getElementById("quote").innerHTML = quotes[~~(Math.random() * quotes.length)];
};

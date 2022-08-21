var cards = [];

function initDeck(){
    for(var cardNum = 1; cardNum < 14; cardNum++){
        for(var i = 0; i < 4; i++){
            var suit = i;
            switch(i){
                case 0:
                    suit = "\u2665";
                    break;
                case 1:
                    suit = "\u2660";
                    break;
                case 2:
                    suit = "\u2663";
                    break;
                case 3:
                    suit = "\u2666";
                    break;
            }
            cards.push({suit : suit, value : cardNum});
        }
    }
    layout();
}

function layout(){
    var docFrag = document.createDocumentFragment();

    for(var i = 0; i < cards.length; i++){
        var card = document.createElement("div");
        card.className += " card";
        card.setAttribute("data-number", cards[i].value);

        card.setAttribute("data-suit", cards[i].suit);
        docFrag.appendChild(card);
        document.body.appendChild(docFrag);
        card.style.left = 60+ i*4 +"px";
        card.style.top = 60+ i*4 +"px";
        card.style.webkitAnimationDuration = (cards.length/4)-(i*.1) + "s";

    }
}

initDeck();
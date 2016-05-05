var points = 0,                                    
    myAnswers = JSON.parse(localStorage.getItem("myAnswers")) || [],    
    nextQuestion = localStorage.getItem("nextQuestion") || 0,
    prevQuestion = localStorage.getItem("prevQuestion") || 0,
    allQuestions,
    request;
if (window.XMLHttpRequest){
    request = new XMLHttpRequest();
} else {
    request = new ActiveXObject ("Microsoft, XMLHTTP");
}
request.open('GET', '/questions.json');
//callback:assincrono funciona assim vc pede pra ele executar algo e fala: quando vc terminar, chama essa funcao a funcao eh chamada callback.
//nesse caso: faca uma requisicao em uma url (no seu caso, do arquivo), e quando terminar de obter o conteudo, execute o meu callback que vai renderizar as questoes

request.onreadystatechange = function(){
    
    if (request.readyState===4 && 
        request.status===200){
        
        allQuestions = JSON.parse (request.responseText);

        var questionSort = allQuestions[nextQuestion];
        putQuestion(questionSort);   
        
  }
}
request.send();

       

function validate(){
    
    event.preventDefault();
    var user = document.getElementById("user").value;
    var pwd = document.getElementById("password").value;
    var formQuest = document.getElementById("allForm");
    var validationForm = document.getElementById("validation");
    if (user && pwd){
        
        validationForm.classList.add("hide");
        formQuest.classList.remove("hide");
        putQuestion();
        return false;
    }
}




function putQuestion(questionSorted) {
    if(questionSorted){
   /* mudo o valor da questao para a questao sorteada*/ 
    var question=document.getElementById("question");
    question.value=questionSorted.question;
    fadIn(question);
    /*coloco as alternativas para os respectivos valores*/
    var rsp1=document.getElementById('rsp1').nextSibling
    rsp1.textContent=questionSorted.choices[0];   
    fadIn(rsp1);
    var rsp2=document.getElementById('rsp2').nextSibling
    rsp2.textContent=questionSorted.choices[1];   
    fadIn(rsp2);
    var rsp3=document.getElementById('rsp3').nextSibling
    rsp3.textContent=questionSorted.choices[2];   
    fadIn(rsp3);
    var rsp4=document.getElementById('rsp4').nextSibling
    rsp4.textContent=questionSorted.choices[3];   
    fadIn(rsp4);
}}


function fadIn(element) {
    var op = 0.1;  // initial opacity
    //element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 25);
}


function prev(){
    event.preventDefault();
    nextQuestion-=1;
    localStorage.setItem("nextQuestion", nextQuestion);
    var myQuest=allQuestions[nextQuestion];
    putQuestion(myQuest);
    checkBut(nextQuestion);
    return false;
}


function checkBut(question){
    var value = myAnswers[question],
        radios = document.getElementsByName("resp");
    
    radios[value].checked="checked";
    for (var i=0; i<radios.length; i++){
        if (radios[i].checked){
            myAnswers[question]=radios[i].value;
            localStorage.setItem("myAnswers", JSON.stringify(myAnswers));
        } 
    }
}

function next(){
    event.preventDefault();    
       /*verifica se a resposta já foi dada alguma vez
       e marca a resposta se esta ja foi dada */  
    if (myAnswers[nextQuestion+1]){
        nextQuestion++;
        var myQuest=allQuestions[nextQuestion];
        putQuestion(myQuest);
        checkBut(nextQuestion);
            if (nextQuestion==(allQuestions.length-1)){
                    checkAnswer();
                    return false;
            }
    } /*caso não tenha sido dada, marca a nova resposta*/ 
        else { 
    
        var myAns='none',
        radios = document.getElementsByName("resp");
    
        for (var i=0; i<radios.length; i++){
            if (radios[i].checked){
                myAns=radios[i].value;
            } 
        }

        if (myAns==='none'){
          alert("YOU NEED TO CHOOSE AN ANSWER!");
            return false;
        } else {
            myAnswers[nextQuestion]=myAns;
            localStorage.setItem("myAnswers", JSON.stringify(myAnswers));
        }
        
          /*checa as respostas ao final - no ultimo next click*/  
        if (nextQuestion==(allQuestions.length-1)){
                checkAnswer();
                return false;
        }            
        nextQuestion++;
        localStorage.setItem("nextQuestion", nextQuestion);
            var nextQues=allQuestions[nextQuestion];
            putQuestion(nextQues);
    }    
}



function checkAnswer(){
 var myAns = JSON.parse(localStorage.getItem("myAnswers"));
 var rights = [];
    for (var i=0, x=allQuestions.length; i<x;i++){
        rights.push(allQuestions[i].correctAnswer);        
    } 
 
    for (var j=0, y=allQuestions.length; j<y;j++){
        if (rights[j]==myAns[j]){
            points++;
        }
    }
    document.write("<h1>you have finished this quiz with a total of : "+points+" points!<h1>");    
    localStorage.clear();
    }
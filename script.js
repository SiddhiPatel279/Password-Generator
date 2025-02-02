const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase")
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck =document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


// intially
let password="";
let passwordLength=10;
let checkCount=0;
handleSlider(); //--> work of this function is to reflect the password Length on the UI
// Set strength circle color to grey
setIndicator("#ccc")


// set password length
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength
    //or kuch bhi karna chahiye ? - HW
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min)) + "% 100%" //This is(widht% height%)
}

function setIndicator(color){ //--> Jo indicator hai strength vala usmein ye input parameter vala color and shadow  set karta hai
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}  

function getRndInteger(min,max){ //--> min and max ke range mein ek random integer set karta hai
    return Math.floor(Math.random()*(max-min))+min; // Math.floor(Math.random()*(max-min) this gives ranges from 0 -> max-min
}// we want from min  -> max so :0+min -> max-min+min which is eual to min->max 

function generateRandomNumber(){ //--> 0 se 9 ke range mein ek random number deta hai
    return getRndInteger(0,9)
}

function generateLowerCase(){ //--? 97 se 123 ke ASCII value se ek character lake deta hai
    return String.fromCharCode(getRndInteger(97,123)) // Converts from ASCII value to character 
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91)) // Converts from ASCII value to character 
}

function generateSymbol(){ // -> ek random integer generate karke symbol ke list mein se value lata hai us integer ka
    const randNum=getRndInteger(0,symbols.length)
    return symbols.charAt(randNum);
}

function calcStrength(){
     let hasUpper = false;
     let hasLower = false;
     let hasNum = false;
     let hasSym = false;
     if (uppercaseCheck.checked) hasUpper = true;
     if (lowercaseCheck.checked) hasLower = true;
     if (numbersCheck.checked) hasNum = true;
     if (symbolsCheck.checked) hasSym = true;

     if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
     } else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
     ){
        setIndicator("#0ff0");
     } else{
        setIndicator("#f00");
     }
}
// since write text operation is async function so for that we create async function
async function copyContent(){ 
    try{
        await navigator.clipboard.writeText(passwordDisplay.value)       // await because we want jab tak ye khatam na ho tab tak ham aage na badhe
        copyMsg.innerText = "Copied" //jaise promise resolve hoga bolega copied  
    }
    catch(e){
        copyMsg.innerText = "Failed"
    }
    //To make copy vala span visible
    copyMsg.classList.add("active")

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);

}

function shufflePassword(array){
    // Fisher Yates Method - to shuffle
    for (let i=array.length - 1;i>0;i--){
        const j=Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach( (checkbox) =>{
        if(checkbox.checked)
            checkCount++;
    });

    // Special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange)
})


inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider(); //to change the UI
})


copyBtn.addEventListener("click",() => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click',() => {
    //none of the checkbox are selected

    if(checkCount == 0)
        return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // Let's start the journey to find new password
    console.log("Starting the journey");
    // remove old password
    password = ""

    // Let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("Compulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();
});
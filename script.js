//     accessKey:"AWSAccessKeyId=AKIAJOV5RN7PJ4EB2NHQ",
//     .com assTag:"AssociateTag=anguwongdood-20",
//.de assTag: "AssociateTag=anguwongdood-21",
//.jp assTag: "AssociateTag=anguswong105-22"
//.cn assTag: "AssociateTag=anguswong-23"
//.ca assTag: "AssociateTag=anguswongport-20"
// var SAKey = "F4NP/ayIOAwhhW3iYckiHN9T1rgs/loE3z/yQ6jw";

// ebay                           
// DEVID:
// 150b4dbd-7cc1-4b0d-8521-df53fcf5bd9f
// AppID:
// AngusWon-948f-4cf1-836c-9b2979a7f6ac
// CertID:
// f493a9e2-b4ee-44b4-9bb5-c4f78282ad83

// Oanda
//36a5e23c39b830be0fdfc4c7d0381ffa-7b0fa2a136018b8db0654151e10a5dca


var amazonRequest = {};
var oanda = {};
var ebayRequest = {};
var easypost = {};


easypost.key = "PsOHuRJIvdYWGJFDkOZDAQ";
// amazonRequest.url =  "http://webservices.amazon."+TLD+"/onca/xml";
ebayRequest.url = "http://open.api.ebay.com/shopping";
oanda.url = "https://api-fxpractice.oanda.com/v1/";
easypost.url = "https://api.easypost.com/v2/shipments";
var FXgetter = loadFX();
$(document).ready(function(){
    
    FXsymbol();
})

function loadFX(){
    var FXarray = [];
    return {
        getFX: function(){
            return FXarray;
        },
        setFX: function(key){
            FXarray = key;
            return FXarray;
        }
    };

}

var FXpair = getPair();
function getPair(){
    var thePair ="";
    return{
        getPair: function(){
            return thePair;
        },
        setPair: function(currOne, currTwo){
            for (var i = 0; i < FXgetter.getFX().length; i++ ){
                if(FXgetter.getFX().indexOf(currOne+"_"+currTwo) > -1){
                    thePair = currOne+"_"+currTwo;
                    return {
                        currency:thePair,
                        counter:0
                    };
                } else if (FXgetter.getFX().indexOf(currTwo+"_"+currOne) > -1){
                    thePair = currTwo+"_"+currOne;
                    return{
                        currency:thePair,
                        counter:1
                    };
                } else {
                    thePair = "WTICO_USD";
                    return{
                        currency:thePair,
                        counter:2
                    };
                }
            }
        }
    }
}


$(".indices").on("change",function(){
    console.log($(".indices").val());
    // FXrate();
});
var userRate = $('.currency').val().toUpperCase();
var rateInit = {
    com:'USD',
    de:'EUR',
    ca:'CAD',
    co:{
        jp:'JPY',
        uk:'GBP'
    }
}

var boxes = checkedBox();
function checkedBox (){
    var checkedArray = [];
    return{
        setBoxes:function(checkbox){
            checkedArray = [];
            var a = $(checkbox).length;
            for (var i = 1; i <= a; i++){
                if($(checkbox+i).prop('checked')){
                    checkedArray.push($(checkbox+i+':checked').val());
                }
            }
            // checkedArray.splice(null);
            return checkedArray;
        }
    }
}

$(".submitsearch").on("submit",function (evnt){
    evnt.preventDefault();
    $("#stores").empty();
    ebayRequest.url = "http://open.api.ebay.com/shopping"
    oanda.url = "https://api-fxpractice.oanda.com/v1/"
    TLDarray = boxes.setBoxes('.checkbox');
    var firstCounter = 1;
    for (var m = 0; m < TLDarray.length; m++){
        amazonSearches(TLDarray[m], firstCounter);
    }
    var width = 1/TLDarray.length*100;
    var widthPercent = width+'%'
    // console.log(widthPercent);
    $('.store').css({
        'width':widthPercent
    })
    var currOne = eval("rateInit."+"com");
    var currTwo = $('.currency').val().toUpperCase();
    var theCurrency = FXgetter.getFX();
    var userPair = FXpair.setPair(currOne, currTwo);
    var USPair = FXpair.setPair("USD", currTwo);
    if($('.ebay').prop('checked')){
        ebayRequest.encode();
    }

});

function amazonSearches(TLD,firstCounter) {
    amazonRequest.url =  "https://webservices.amazon."+TLD+"/onca/xml"
    var currOne = eval("rateInit."+TLD)
    var currTwo = $('.currency').val().toUpperCase();
    var theCurrency = FXgetter.getFX();
    var userPair = FXpair.setPair(currOne, currTwo);
    var USPair = FXpair.setPair("USD", currTwo);
    rateConvert.setConvert(userPair.currency, userPair.counter);
    amazonRequest.encode(TLD,userPair.currency,firstCounter)
    window.onscroll = function(ev){
        if((window.innerHeight + window.scrollY) >= $(document).height()){
            firstCounter++;
            
            amazonRequest.encode(TLD,userPair.currency,firstCounter);
        }
    }

}

function FXsymbol(){
    var FXarray=[];
    $.ajax({
        url:oanda.url+'instruments',        
        type:"GET",
        dataType:"json",
        data:{
            accountId:'341013'
        },
        headers:{
            Authorization: "Bearer 36a5e23c39b830be0fdfc4c7d0381ffa-7b0fa2a136018b8db0654151e10a5dca"            
        },
        success:function(resp){
            for(var i=0; i<resp.instruments.length;i++){
                FXarray.push(resp.instruments[i].instrument);
            }
            FXgetter.setFX(FXarray);
        }
    });

           
      
}

var rateConvert = FXrate();
function FXrate () {
    var conversion = {};
    var rate = 0;
    return{
        setConvert:function(currencyOne, countOne){
            $.ajax({
                url:oanda.url+'prices',
                type:"GET",
                dataType:"json",
                data: {
                    instruments: currencyOne

                },
                headers:{
                    Authorization: "Bearer 36a5e23c39b830be0fdfc4c7d0381ffa-7b0fa2a136018b8db0654151e10a5dca"            
                }
            }).done(function(resp){
                console.log(resp);
                var rate2 = resp.prices[0].ask;
                if (countOne === 0){
                    rate = rate2;
                    conversion[currencyOne] = rate;
                } else if (countOne === 1){
                    rate = 1/rate2;
                    conversion[currencyOne] = rate;
                } else {
                    rate = 1;
                    conversion[currencyOne] = rate;              
                }
            })
            return conversion;                             
        },
        getConvert:function(){
            return conversion;
        }
    }

}

ebayRequest.encode = function(){

    var searchAZ = $(".indices").val();
    var keywordAZ = $(".itemsearch").val();
    
    
    var sep = "&";
    
    var qString = {
        appid: "appid=AngusWon-948f-4cf1-836c-9b2979a7f6ac",
        callname: "callname=FindPopularItems",
        callbackname:"callbackname=function",
        requestencoding: "requestencoding=XML",
        version: "version=517",
        serviceversion: "service-version=1.12.0",
        keywords: "QueryKeywords="+keywordAZ,
        siteid: "siteid=0",
        outputselector: "outputSelectorType=PictureURLLarge"
    }
    var string = qString.appid + sep + qString.callname + sep + qString.callbackname + sep + qString.requestencoding + sep + qString.version + sep + qString.keywords + sep + qString.serviceversion + sep + qString.outputselector + sep + qString.siteid;

    var xml = ebayRequest.url + "?" + string;

    


    $.ajax({
        url:"amazonparse.php",
        type:"POST",
        dataType:"json",
        data:{
            id: xml
            
        },
        success: function(res){
            console.log(res);
            for (var i = 0; i < 10; i++){
                var currency = "USD";
                var title = (res.ItemArray.Item[i].Title);
                var price = res.ItemArray.Item[i].ConvertedCurrentPrice
                var link = (res.ItemArray.Item[i].ViewItemURLForNaturalSearch);
                var shop = "Ebay";
                var picture = (res.ItemArray.Item[i].GalleryURL);
                var convprice = Math.round(price*currencyChange*100)/100;
                productDisplay(shop,title,price,convprice,currency,$('.currency').val().toUpperCase(),link,picture,TLD);
            };
                
        }
        
    })

    
};


amazonRequest.encode = function(TLD,currPair,firstCounter){
    var searchAZ = $(".indices").val();
    var keyword = $(".itemsearch").val();
    var keywordAZ = keyword.replace(/ /g,"%20");
    console.log($.now());
    
    
    var date = new Date();
    var years = date.getUTCFullYear();
    var months = date.getUTCMonth()+1;
    if (months < 10){
        months = "0"+months;
    };
    var days = date.getUTCDate();
    if (days < 10) {
        days = "0"+days;
    };
    var hours = date.getUTCHours();
    if (hours <10){
        hours = "0" + hours;
    }
    var minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = "0"+ minutes;
    };
    var seconds = date.getSeconds();
    if (seconds < 10) {
        seconds = "0"+ seconds;
    };
    var timeStamp = years+"-"+months+"-"+days+"T"+hours+"%3A"+minutes+"%3A"+seconds+"Z";

    var sep = "&"
    var qString = {
        service:"Service=AWSECommerceService",
        availability:"Availability=Available",
        condition:"Condition=All",
        itempage:"ItemPage="+firstCounter,
        responsegroup:"ResponseGroup=ItemAttributes%2COffers%2CImages",
        operation:"Operation=ItemSearch",
        accessKey:{
            com:"AWSAccessKeyId=AKIAJOV5RN7PJ4EB2NHQ",
            co:{
                uk:"AWSAccessKeyId=AKIAJRQLAJXRD7Z5L2CA"
            }
        },
        assTag:{
            // com:"AssociateTag=anguwongdood-20",
            com:"AssociateTag=8558-6951-2531",
            de:"AssociateTag=anguswongdood-21",
            co:{
                jp:"AssociateTag=anguswong105-22",
                uk:"AssociateTag=anguswongport-21"
            },
            ca:"AssociateTag=anguswongport-20",
            cn:"AssociateTag=anguswong-23"
        },
        sIndex:"SearchIndex="+searchAZ,
        keyword:"Keywords="+keywordAZ,
        timestamp:"Timestamp="+timeStamp,
        sort: "Sort=titlerank"
    };

    console.log(eval("qString.assTag."+TLD))
    var SAKey = {
        com:"F4NP/ayIOAwhhW3iYckiHN9T1rgs/loE3z/yQ6jw",
        co:{
            uk:"m9dOx2+53meAjQ3BwXmDseekmxJWcPez0MtstYMo"
        }
    };

    var authString = eval("qString.accessKey.com") + sep + eval("qString.assTag.com") + sep + qString.availability + sep + qString.itempage + sep + qString.keyword + sep + qString.operation + sep + qString.responsegroup + sep + qString.sIndex + sep + qString.service + sep + qString.timestamp;

    // console.log(authString);
    
    var test_string =
        "GET\n" +
        "webservices.amazon."+TLD+"\n" +
        "/onca/xml\n" +
        authString;
    // console.log(eval("SAKey."+TLD));

    var signature2 = CryptoJS.HmacSHA256(test_string, eval("SAKey.com"));
    var authKey = signature2.toString(CryptoJS.enc.Base64);
    var newAuthKey = encodeURIComponent(authKey);
    var dataFull = authString + sep + "Signature=" + newAuthKey;


    console.log(amazonRequest.url+"?"+dataFull);

    var xml = amazonRequest.url+"?"+dataFull;
    amazonRequest.call(xml,TLD,currPair,firstCounter)
}

amazonRequest.call = function(dataSent,TLD,currPair,firstCounter){
    var TLD2 = "";
    if (TLD == 'co.jp' || TLD == 'co.uk'){
        TLD2 = TLD.replace('.','')
    } else {
        TLD2 = TLD;
    }

    if(firstCounter === 1){
        var $div = $("<div>").attr('id','amazon'+TLD2).addClass('store');
        var $h1 = $("<h1>").text('Listings from Amazon'+'.'+TLD);
        $div.append($h1);
        $('#stores').append($div);
        $div.hide();

    }
    console.log(firstCounter);
    var $ul = $("<ul>").addClass('listpage'+firstCounter);
    $('#amazon'+TLD2).append($ul);
    

    $.ajax({
        url:"amazonparse.php",
        type:"POST",
        dataType:"json",
        data: {
            id: dataSent
        },
        success: function(response){
            console.log(response);           
            for (var i = 0; i<10; i++){
                if(response.Items.Item[i].OfferSummary.LowestNewPrice){


                    var title = (response.Items.Item[i].ItemAttributes.Title);
                    // console.log(title); 
                    var price = (response.Items.Item[i].OfferSummary.LowestNewPrice.Amount);
                    if(TLD !== "co.jp"){
                        price = price/100;
                    }
                    // console.log(price);
                    var currency = (response.Items.Item[i].OfferSummary.LowestNewPrice.CurrencyCode);
                    
                    var link = (response.Items.Item[i].DetailPageURL);
                    var picture = "";
                    if(TLD == "com"){
                        picture = (response.Items.Item[i].LargeImage.URL);
                    }else if(TLD == "co.jp" || TLD == "de"){
                        if(response.Items.Item[i].ImageSets.ImageSet.length > 1){
                            picture = (response.Items.Item[i].ImageSets.ImageSet[0].LargeImage.URL);
                        } else {
                            picture = (response.Items.Item[i].ImageSets.ImageSet.LargeImage.URL);
                        }
                    }
                    var convprice = Math.round(Number(price*rateConvert.getConvert()[currPair])*100)/100;

                    productDisplay("amazon",title,price,convprice,currency,$('.currency').val().toUpperCase(),link,picture,TLD2,firstCounter);
                } else {
                    console.log("skip");                
                }
                
            }
        }
    });
    if(firstCounter === 1){
        $div.fadeIn(800);
    }
}


function productDisplay(shop,title,price,convprice,currency,convcurrency,link,picture,TLD,firstCounter){

    var $listitem = $("<li>");
    var $title = $("<a>");
    $title.text(title);
    $title.attr("href",link)
    var $price = $("<p>");
    $price.text(currency + " " + price + "    " + convcurrency + " " + convprice).addClass("pricing");
    var $image = $("<img>");
    $image.attr("src",picture).addClass("hidden");
    $listitem.append($title,$price,$image);
    $("#"+shop+TLD+" .listpage"+firstCounter).append($listitem).hide().fadeIn(800);
    // $(this).attr('style','background-image: url('+picture+')')
    // $("#"+shop).removeClass("hidden");
    $("li").on("mouseover", function(){
        $(this).find("img").removeClass("hidden");
    })
    $("a").on("mouseover",function(){
        $(this).find("a").addClass("redlink");
    })
    
    $("li").on("mouseout",function(){
        $(this).find("img").addClass("hidden");
    })
    $("a").on("mouseout",function(){
        $(this).find("a").removeClass("redlink");
    })
    
}



$("input").on("mouseover",function(){
    $(this).addClass("buttonhover");
})

$("input").on("mouseout",function(){
    $(this).removeClass("buttonhover");
})

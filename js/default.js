var app = {
    current: 0,
    page: null,
    timeout: 1000,
    pages: [
        {   name: "name", passed: false   },
        {   name: "location", passed: false   },
        {   name: "social", passed: false   },
        {   name: "cats", passed: false   },
        {   name: "finish", passed: false   }
    ],
    setButtons: () => {
        app.pages.forEach((item, index) => {
            var button = $("#number-button" + parseInt(index + 1) +  " > span");
            button.removeClass("number-button-checked, number-button-unchecked, number-button-current");
            if (app.pages[index].passed && index != app.current) button.addClass("number-button-checked");
            if (index == app.current) button.addClass("number-button-current");
            if (index != app.current && !app.pages[index].passed) button.addClass("number-button-unchecked");
        });
    },
    loadPage: (number) => {
        if ((number == 0) || (app.pages[number - 1].passed && 0 < number && number < app.pages.length)){
            app.current = number;
            loadHTML(app.page, app.pages[number].name, () => {
                app.setButtons();
                initPage();
                eval('initPage' + parseInt(app.current + 1) + '();');
            });
        }
    },
    loadNextPage: () => {
        app.loadPage(app.current + 1);
    },
    loadPreviousPage: () => {
        app.loadPage(app.current - 1);
    },
    restart: () => {
        app.pages.forEach((item) => item.passed = false);
        app.inputData = {
            name: null,
            mail: null,
            country: null,
            city: null,
            socialNetworks: {
                "facebook": null,
                "vkontakte": null,
                "twitter": null,
                "odnoklassniki": null
            },
            imageName: null
        };
    }
};
window.onload = () => {
    app.page = document.getElementsByClassName("page")[0];
    app.restart();
    app.loadPage(0);
};

function initPage (){
    $(".number-button").click(function () {
        app.loadPage(this.id.split("number-button")[1] - 1);
    });
    $("#order-button1").click(() => {
        app.loadPreviousPage();
    });
    $("#order-button2").click(() => {
        if (app.current == 0 && $(".name").val() != '' && $(".mail").val().indexOf('@') != -1){
            app.inputData.name = $(".name").val();
            app.inputData.mail = $(".mail").val();
            app.pages[app.current].passed = true;
        } else if (app.current == 1 && $("#country").val() != '' && $("#city").val() != '') {
            app.inputData.country = $("#country").val();
            app.inputData.city = $("#city").val();
            app.pages[app.current].passed = true;
        } else if (app.current == 2) app.pages[app.current].passed = true;
        app.loadNextPage();
    });
}

function initPage1 () {
    if (app.inputData.name) $(".name").val(app.inputData.name);
    if (app.inputData.mail) $(".mail").val(app.inputData.mail);
    document.getElementsByClassName("mail")[0].oninput = (event) => {
        if ($(event.target).val().indexOf('@') == -1) {
            $(event.target).addClass("wrong-input");
            $(".mail-block > span").fadeIn(200);
        } else {
            $(event.target).removeClass("wrong-input");
            $(".mail-block > span").hide();
        }
    };
}

function initPage2 () {
    if (app.inputData.country) $("#country").val(app.inputData.country);
    if (app.inputData.city) $("#city").val(app.inputData.city);
    document.getElementById("country").oninput = () => loadList("countries", "country");
    document.getElementById("country").focusout = () => {
        app.inputData.country = $("#country").val();
        $("#country").addClass("datalist-checked");
    };
    document.getElementById("city").oninput = () => loadList("cities", "city");
    document.getElementById("city").focusout = () => $("#city").addClass("datalist-checked");
}

function initPage3 () {
    for (socNet in app.inputData.socialNetworks){
        if (app.inputData.socialNetworks.hasOwnProperty(socNet) && app.inputData.socialNetworks[socNet]){
            $("#url-" + socNet).val(app.inputData.socialNetworks[socNet]);
            $("#url-" + socNet).fadeIn(200);
            $("#" + socNet).attr("checked", "checked");
        }
    }
    $(".soc-block > label > input").change(function () {
        if (this.checked) $("#url-" + this.id).fadeIn(200);
        else {
            $("#url-" + this.id).fadeOut(200);
            $("#url-" + this.id).val('');
            app.inputData.socialNetworks[this.id] = null;
        }
    });
    var socials = document.getElementsByClassName("socnet-url");
    for (var i = 0; i < socials.length; i++){
        socials[i].oninput = (event) => {
            app.inputData.socialNetworks[event.target.id.split("-")[1]] = $('#' + event.target.id).val();
        }
    }
}

function initPage4 () {
    if (app.inputData.imageName){
        $(".img-pet").each(function () {
            var src = this.src.match(/cat1\.jpg|cat2\.jpg|cat3\.jpg|dog4\.jpg/);
            if (src == app.inputData.imageName) $(this).addClass("img-checked");
        });
    }
    $(".img-pet").click((event) => {
        $(".img-pet").each(function () {
            $(this).removeClass("img-checked");
        });
        $("#" + event.target.id).addClass("img-checked");
        if (event.target.id.match(/cat/)){
            $(".wrong").fadeOut(200);
            app.inputData.imageName = event.target.id + '.jpg';
        } else {
            $(".wrong").fadeIn(200);
            app.inputData.imageName = null;
        }
    });
    $("#finish").click(() => {
        if (app.current == 3 && app.inputData.imageName != null) app.pages[app.current].passed = true;
        app.loadNextPage();
    });
}

function initPage5 () {
    $(".page").addClass("finish");
    $(".res-name").html(app.inputData.name);
    $(".res-mail").html(app.inputData.mail);
    if (app.inputData.city && app.inputData.country) $(".res-location").html(app.inputData.city + ', ' + app.inputData.country);
    else if (app.inputData.city && !app.inputData.country) $(".res-location").html(app.inputData.city);
    else if (!app.inputData.city && app.inputData.country) $(".res-location").html(app.inputData.country);
    var socials = app.inputData.socialNetworks;
    var htmlString = '';
    for (socNet in socials){
        if (socials.hasOwnProperty(socNet) && socials[socNet] != null){
            htmlString += "<div class='soc-name'>" + socNet + ": <span>" + socials[socNet] + "</span></div>";
        }
    }
    $(".res-social").html(htmlString);
    $(".img-finish").attr("src", "img/" + app.inputData.imageName);
    $(".retry").click(() => {
        $(".page").removeClass("finish");
        app.restart();
        app.loadPage(0);
    });
}

function loadHTML(parent, name, callback){
    var request = new XMLHttpRequest();
    request.open("POST", "html/" + name + '.html', true);
    request.send();
    request.onreadystatechange = () => {
        if(request.readyState == 4) {
            if(request.status != 200) document.body.innerHTML = "Could not retrieve data";
            parent.innerHTML = request.responseText;
            if (typeof callback == 'function') callback();
        }
    }
}

function loadList(listId, inputId){
    var dataList = document.getElementById(listId);
    var input = document.getElementById(inputId);
    var request = new XMLHttpRequest();
    request.open('GET', 'json/' + listId + '.json', true);
    request.send();
    request.onreadystatechange = function(response) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                var jsonOptions = JSON.parse(request.responseText);
                app[listId] = jsonOptions;
                if (listId == 'countries') $("#countries > option").each(function () {$(this).remove();});
                if (listId == 'cities') $("#cities > option").each(function () {$(this).remove();});
                for (prop in jsonOptions){
                    if (jsonOptions.hasOwnProperty(prop)){
                        if (listId == 'countries'){
                            var option = document.createElement('option');
                            option.value = jsonOptions[prop];
                            dataList.appendChild(option);
                        } else if (listId == "cities"){
                            for (country in app['countries']){
                                if (app['countries'][country] == app.inputData.country && country == jsonOptions[prop].country){
                                    var option = document.createElement('option');
                                    option.value = jsonOptions[prop]['name'];
                                    dataList.appendChild(option);
                                }
                            }
                        }
                    }
                }
            } else input.placeholder = "Couldn't load countries :(";
        }
    };
}
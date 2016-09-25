var app = {
    current: 0,
    page: null,
    pages: [
        {   name: "name", passed: false   },
        {   name: "location", passed: false   },
        {   name: "social", passed: false   },
        {   name: "cats", passed: false   },
        {   name: "finish", passed: false   }
    ],
    countries: null,
    cities: null,
    setButtons: () => {
        app.pages.forEach((item, index) => {
            var button = $("#number-button" + parseInt(index + 1) +  " > span");
            button.removeClass("number-button-checked, number-button-unchecked, number-button-current");
            if (app.pages[index].passed && index != app.current) button.addClass("number-button-checked");
            if (index == app.current) button.addClass("number-button-current");
            if (index != app.current && !app.pages[index].passed) button.addClass("number-button-unchecked");
        });
    },
    loadJSON: (fileName) => {
        var request = new XMLHttpRequest();
        request.open('GET', 'json/' + fileName + '.json', true);
        request.send();
        request.onreadystatechange = function(response) {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    var jsonOptions = JSON.parse(request.responseText);
                    app[fileName] = jsonOptions;
                }
            }
        };
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
    try {
        app.loadJSON("countries");
        app.loadJSON("cities");
    } finally {
        app.page = document.getElementsByClassName("page")[0];
        app.restart();
        app.loadPage(0);
    }
};

function initPage (){
    $(".number-button").click(function () {
        app.loadPage(this.id.split("number-button")[1] - 1);
    });
    $("#order-button1").click(() => {
        app.loadPreviousPage();
    });
    $("#order-button2").click(() => {
        if (app.current == 0){
            if ($(".name").val() != '' && $(".mail").val().match(/^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/)) {
                app.inputData.name = $(".name").val();
                app.inputData.mail = $(".mail").val();
                app.pages[app.current].passed = true;
            } else {
                if ($(".name").val() == '' && $(".mail").val() == ''){
                    alert("Введите имя и адрес электронной почты !");
                } else if ($(".name").val() != '' && $(".mail").val() == ''){
                    alert("Введите  адрес электронной почты !");
                } else if ($(".name").val() != '' && !$(".mail").val().match(/^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/)) {
                    alert("Введите  адрес электронной почты НОРМАЛЬНО !");
                } else if ($(".name").val() == '' && $(".mail").val() != '' && $(".mail").val().indexOf('@') != -1) {
                    alert("Введите имя !");
                }
            }
        } else if (app.current == 1) {
            if ($("#country").val() != '' && $("#city").val() != ''){
                app.inputData.country = $("#country").val();
                app.inputData.city = $("#city").val();
                app.pages[app.current].passed = true;
            } else if ($("#country").val() == '' && $("#city").val() != '') {
                alert("Введите страну !");
            } else if ($("#country").val() != '' && $("#city").val() == '') {
                alert("Введите город !");
            } else {
                alert("Введите страну и город !");
            }
        } else if (app.current == 2) app.pages[app.current].passed = true;
        app.loadNextPage();
    });
}

function initPage1 () {
    if (app.inputData.name) $(".name").val(app.inputData.name);
    if (app.inputData.mail) $(".mail").val(app.inputData.mail);
    document.getElementsByClassName("mail")[0].oninput = (event) => {
        if (!$(event.target).val().match(/^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/)){
            $(event.target).addClass("wrong-input");
            $(".mail-block > span").fadeIn(200);
        } else {
            $(event.target).removeClass("wrong-input");
            $(".mail-block > span").hide();
        }
    };
}

function initPage2 () {
    var countryInput = document.getElementById("country");
    var cityInput = document.getElementById("city");
    if (app.inputData.country) $("#country").val(app.inputData.country);
    if (app.inputData.city) $("#city").val(app.inputData.city);
    countryInput.oninput = () => {
        for (country in app.countries){
            if (app.countries.hasOwnProperty(country) && $("#country").val() == app.countries[country]){
                cityInput.focus();
                return;
            }
        }
        loadList("countries");
    };
    countryInput.focusout = () => {
        app.inputData.country = $("#country").val();
        $("#country").addClass("datalist-checked");
    };
    cityInput.oninput = () => {
        for (city in app.cities){
            if (app.cities.hasOwnProperty(city) && $("#city").val() == app.cities[city].name){
                cityInput.focusout();
                return;
            }
        }
        loadList("cities");
    };
    cityInput.focusout = () => $("#city").addClass("datalist-checked");
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
        if (app.inputData.imageName != null) {
            app.pages[app.current].passed = true;
        } else {
            alert("Докажите что вы не робот !)");
        }
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

function loadList(listName){
    var dataList = document.getElementById(listName);
    var option;
    if (listName == 'countries' && app.countries) {
        $("#countries > option").each(function () {$(this).remove();});
        for (country in app.countries){
            if (app.countries.hasOwnProperty(country)){
                option = document.createElement('option');
                option.value = app.countries[country];
                dataList.appendChild(option);
            }
        }
    }
    if (listName == 'cities' && app.cities && app.countries) {
        $("#cities > option").each(function () {$(this).remove();});
        for (country in app.countries){
            if (app.countries.hasOwnProperty(country) && app.countries[country] == app.inputData.country){
                for (city in app.cities){
                    if (app.cities.hasOwnProperty(city) && app.cities[city].country == country){
                        var option = document.createElement('option');
                        option.value = app.cities[city].name;
                        dataList.appendChild(option);
                    }
                }
            }
        }
    }
}
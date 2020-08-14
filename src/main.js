const level_t = [1.5, 1.0, 0.4];        // Времянной массив смены карт

let level = 0;                          // Выбранный уровень сложности
let game_array = [];                    // Массив проявления карт
let user_inpt_n = 0;                    // Вводимая игроком карта
let is_game_render = true;              // Отображает ли сейчас игра комбинацию
let ausio_dom = [];                     // Массив звуковых эффектов
let time = 0.0;                         // Время
let time_id = null;                     // Идентефикатор таймера

// Загружаем звуки в игру
for(let i=0; i<4; i++){
    ausio_dom[i] = new Audio("sounds/"+String(i)+".mp3");
}

// Запускаем Vue.js
let main_con = new Vue({
    el: '#content',                     // Подключаем к верхнему уровню
    data: {
        visible : true,                 // Общее фоновое размытие
        visible_start: true,            // Главное меню
        visible_end: false,             // Конечное меню
        message_show : false,           // Отображение сообщения
        message_content: "",            // Текст Сообщения
        time: "00:00",                  // Время
        raund : 0,                      // Раунд
        card : [false, false, false, false] // Свечение карт в массиве по индексу
    }
});

//Тело таймера
//Конвертируем секунды в приемлемый вид и передаём Vue
function main_timer() {
    time++;
    let min = Math.floor(time / 60);
    var sec = time % 60;
    main_con.time = [
        min.toString().padStart(2, '0'),
        sec.toString().padStart(2, '0')
    ].join(':');
}

//Событие нажатия клавиши сложности в главном меню
function press_start_game(lev) {
    is_game_render = true;
    main_con.visible = false;
    main_con.visible_start = false;
    main_con.visible_end = false;
    level = lev;
    game_array = [];
    time = 0;
    setTimeout(generate_array, 1000);
    time_id = setInterval(main_timer, 1000);
}

//Возврат в главное меню
function press_restart() {
    main_con.visible = true;
    main_con.visible_start = true;
    main_con.visible_end = false;
}

//Событие клика игроком по карте
function press_card(card) {
    if(is_game_render === false){
        if(game_array[user_inpt_n] === card){
            show_card(card);
            user_inpt_n++;
            const round = game_array.length;
            if(user_inpt_n === round){
                switch (round) {
                    case 3 : {show_messange("Уже 3, не плохо!")} break;
                    case 6 : {show_messange("Игра становиться напрежённой")} break;
                    case 9 : {show_messange("9 - это уже много!")} break;
                    case 12 :{show_messange("Комментарии излишни...")} break;
                }
                is_game_render = true;
                setTimeout(generate_array, 1000 * level_t[level] * 2);
            }
        }else{
            clearTimeout(time_id);
            main_con.raund = game_array.length;
            main_con.visible = true;
            main_con.visible_end = true;
        }
    }
}

// Добавить слуайную карту в колоду
function generate_array(){
    is_game_render = true;
    game_array.push(get_round_card());
    render_for_user(0);
}

// Показать комбинацию карт
function render_for_user(state) {
    show_card(game_array[state]);
    state++;
    if (state < game_array.length) {
        setTimeout(
            render_for_user,
            1000 * level_t[level],
            state
        )
    }else{
        setTimeout(function () {
            user_inpt_n = 0;
            is_game_render = false
        }, level_t[level]);
    }
}

// Отправить сообщение игроку
function show_messange(value) {
    main_con.message_show = true;
    main_con.message_content = value;
    setTimeout(function () {
        main_con.message_show = false;
    }, 1000)
}

// Показть карту игроку
function show_card(card) {
    ausio_dom[card].currentTime = 0.0;
    ausio_dom[card].play(0);
    Vue.set(main_con.card, card, true);
    let time_h = is_game_render ? level_t[level] - 0.2 : 0.3;
    setTimeout(hide_card, 1000 * time_h, card)
}

// Скрыть карту игроку
function hide_card(card) {
    Vue.set(main_con.card, card, false);
}

// Создать случайную карту
function get_round_card() {
    return Math.floor(Math.random() * (3 + 1));
}
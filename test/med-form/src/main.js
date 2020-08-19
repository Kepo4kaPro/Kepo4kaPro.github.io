let main_con;
// Маски ввода
const masks = {
    phone : "+7 (___)___-__-__",       // Телефом
    index : "______",                  // Индекс
    seril : "____ ______"              // Серия номер
};

document.addEventListener('DOMContentLoaded', function (){
    main_con = new Vue({
        el: '#container',                     // Подключаем к верхнему уровню
        data: {
            card_actve : [true, false, false, false], // Активное окно
            value : {
                name : '',
                birthday : '',
                phone : '',
                gender : 'Мужской',
                group_klient : {
                    problem : false,
                    type : 'ОМС'
                },
                target_doct: '',
                is_sub_sms : false,
                index : '',
                county : '',
                flatness : '',
                city: '',
                outside: '',
                home: '',
                docum_type : '',
                seril : '',
                date_out : '',
                org_out : ''
            },
            today : 1
        },
        methods:{
            //Сообщение об успешном заполнении формы
            show_data(){
                alert('Please check console');
                let names = this.value.name.split(' ');
                if(!names[1]) names[1] = '';
                console.log("------------Основное------------");
                console.log('Фамилия: '+names[0]);
                console.log('Имя: '+names[1]);
                console.log('Отчество: '+names[2]);
                console.log('Дата рождения: '+this.value.birthday);
                console.log('Номер телефона: '+this.value.phone.replace(/\D/g, ""));
                console.log('Пол: '+this.value.gender);
                let str_p = this.value.group_klient.problem ? ' Проблемные' : '';
                console.log('Группа клиентов: '+this.value.group_klient.type+str_p);
                console.log('Лечащий врач: '+this.value.target_doct);
                console.log('Не отправлять СМС: '+this.value.is_sub_sms);
                console.log("-------------Адрес--------------");
                console.log('Индекс: '+this.value.index);
                console.log('Страна: '+this.value.county);
                console.log('Область: '+this.value.flatness);
                console.log('Город: '+this.value.city);
                console.log('Улица: '+this.value.outside);
                console.log('Дом: '+this.value.home);
                console.log("------------Паспорт-------------");
                console.log('Тип документа: '+this.value.docum_type);
                let serials = this.value.seril.split(' ');
                if(!serials[1]) serials[1] = '';
                console.log('Серия: '+serials[0]);
                console.log('Номер: '+serials[1]);
                console.log('Кем выдан : '+this.value.org_out);
                console.log('Дата выдачи: '+this.value.date_out);

            },
            //Меняем страницу
            chenge_page(page){
                for(let i=0; i<this.card_actve.length; i++){
                    Vue.set(this.card_actve, i, false)
                }
                Vue.set(this.card_actve, page -1, true)
            },
            //Если потерян фоку
            check_blur_mask(elem){
                if(this.value[elem] === masks[elem]) this.value[elem] = ''
            },
            //Если элемент выбран
            check_mask(elem){
                this.value[elem] = this.change_to_mask(window.event, this.value[elem], masks[elem]);
            },
            //Переместить курсор в позицию
            set_cursor_pos(el, pos){
                el.focus();
                el.setSelectionRange(pos, pos);
            },
            //Самая простая маска ввода
            change_to_mask(object, value, masked){
                let i = 0,
                    mask = masked.replace(/\D/g, ""),
                    val = value.replace(/\D/g, ""),
                    max_char = masked.match(/[_]/g).length + mask.length;
                if(val.length > max_char) (val = val.slice(0,max_char));
                if(mask.length >= val.length) (val = mask);
                masked = masked.replace(/[_\d]/g, function (a) {
                    return val.charAt(i++) || "_"
                });
                i = masked.lastIndexOf(val.substr(-1));
                i < masked.length && masked !== this.defaultValue ? i++ : i = masked.indexOf("_");
                this.$nextTick(() => this.set_cursor_pos(object.target, i));
                return masked
            }
        },
        created: function () {
            //Задаём максимальную дату равную сегодняшнему дню
            let date = new Date();
            this.today = [
                date.getFullYear().toString(),
                (date.getMonth() + 1).toString().padStart(2, '0'),
                date.getDate().toString().padStart(2, '0')
            ].join('-');
        }
    });
});
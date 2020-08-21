function toglle_class(id) {
    let dom = document.querySelector("#container-"+String(id));
    if(dom && !dom.classList.contains('disable'))
    dom.classList.toggle("active");
}
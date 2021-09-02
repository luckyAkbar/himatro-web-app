var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
	showDivs2(slideIndex += n);
}

function showDivs(n) {
	var i;
	var z=0;
	var x = document.getElementsByClassName("mySlides");
	if (slideIndex > x.length) {slideIndex = 1}
	if (slideIndex < 1) {slideIndex = x.length} ;
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}
	x[slideIndex-1].style.display = "block";
	slideIndex++;
	setTimeout(showDivs, 5000);
}

function showDivs2(n) {
	var i;
	var z=0;
	var x = document.getElementsByClassName("mySlides");
	if (slideIndex > x.length) {slideIndex = 1}
	if (slideIndex < 1) {slideIndex = x.length} ;
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}
	x[slideIndex-1].style.display = "block";
}

window.addEventListener("scroll", function(){
				var header = document.querySelector("header");
				header.classList.toggle("joss", window.scrollY > 40);
			})

var lastScrollTop = 0;
				navbar = document.querySelector("header");
			window.addEventListener("scroll", function(){
				var scrollTop = window.pageYOffset || document
					.documentElement.scrollTop;
				if (scrollTop > lastScrollTop){
					navbar.style.top="-100%";
				}
				else {
					navbar.style.top="0"
				}
				lastScrollTop = scrollTop;
			})
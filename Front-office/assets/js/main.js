/**
* Template Name: eNno
* Template URL: https://bootstrapmade.com/enno-free-simple-bootstrap-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";


var ocorrenciasLista =  [
    {
      "designacao": "ID-10134/ Estacionamento irregular",
      "utilizador": "Luis Pinheiro",
      "estado": "Pendente",
      "latitude": 41.451196,
      "longitude": -8.292259,
      "segurancas": "",
      "foto": "../assets/images/products/Carro-mal-estacionado.jpg"
    },
    {
      "designacao": "ID-10332/ Estacionamento em lugar reservado",
      "utilizador": "Manuel Joaquim",
      "estado": "Em análise",
      "latitude": 41.450439,
      "longitude": -8.293911,
      "segurancas": "",
      "foto": "../assets/images/products/Carro-mal-estacionado.jpg"
    },
    {
      "designacao": "ID-10034/ Estacionamento a restringir via de circulação",
      "utilizador": "Jorge Tinoco",
      "estado": "Resolvido",
      "latitude": 41.453545,
      "longitude": -8.289702,
      "segurancas": "Leonel",
      "foto": "../assets/images/products/Carro-mal-estacionado.jpg"
    },
    {
      "designacao": "ID-11234/ Estacionamento irregular",
      "utilizador": "Manuel Martins",
      "estado": "Resolvido",
      "latitude": 41.452931,
      "longitude": -8.289654,
      "segurancas": "",
      "foto": "../assets/images/products/Carro-mal-estacionado.jpg"
    },
    {
      "designacao": "ID-10245/ Estacionamento em lugar reservado a colaboradores",
      "utilizador": "Rodrigo Pereira",
      "estado": "Resolvido",
      "latitude": 41.45088,
      "longitude": -8.293599,
      "segurancas": "",
      "foto": "../assets/images/products/Carro-mal-estacionado.jpg"
    }
  ]

  //localStorage.setItem("ocorrenciasLista", JSON.stringify(ocorrenciasLista))

const ocorrenciasLista_fromLocalStorage = localStorage.getItem("ocorrenciasLista");
 
if (ocorrenciasLista_fromLocalStorage) {

  const parsedOcorrencias = JSON.parse(ocorrenciasLista_fromLocalStorage);

}
 
  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);


  
  

if (!localStorage.getItem("utilizadores")) {
  let utilizadores = [
    { email: "carol302004@gmail.com", pontos: 500 },
    { email: "mendescantunes@gmail.com", pontos: 500 },
    { email: "carolinaantunesmendes04@gmail.com", pontos: 500 }
  ];
  localStorage.setItem("utilizadores", JSON.stringify(utilizadores));
}


  document.addEventListener('DOMContentLoaded', () => {
  const pontosSpan = document.getElementById('pontos-atuais');
  const areaPontos = document.getElementById('area-pontos');

  // Agora as variáveis são declaradas aqui dentro, para garantir escopo certo
  const utilizadorLogado = localStorage.getItem("utilizadorLogado") || null;
  let utilizadores = JSON.parse(localStorage.getItem("utilizadores")) || [];

  // Procurar o utilizador atual
  let utilizadorAtual = utilizadorLogado
    ? utilizadores.find(u => u.email === utilizadorLogado)
    : null;

  // Se o utilizador não existir na lista, cria com 0 pontos
  if (utilizadorLogado && !utilizadorAtual) {
    utilizadorAtual = { email: utilizadorLogado, pontos: 0 };
    utilizadores.push(utilizadorAtual);
    localStorage.setItem("utilizadores", JSON.stringify(utilizadores));
  }

  // Usar pontos do utilizador atual, ou 0
  let pontos = utilizadorAtual ? utilizadorAtual.pontos : 0;

  const produtos = [
    { nome: "10 Senhas Cantina UMINHO", custo: 100 },
    { nome: "10 viagens dos Autocarros da AAUMINHO", custo: 200 },
    { nome: "Pulseira Enterro da Gata'25", custo: 500 }
  ];

  function atualizarPontos() {
    pontosSpan.textContent = pontos;

    if (!utilizadorLogado) return; // Sem utilizador, não atualiza

    // Atualizar pontos na lista e guardar localStorage
    const index = utilizadores.findIndex(u => u.email === utilizadorLogado);
    if (index !== -1) {
      utilizadores[index].pontos = pontos;
      localStorage.setItem("utilizadores", JSON.stringify(utilizadores));
    }
  }

  function tentarTrocar(index) {
    const produto = produtos[index];

    if (pontos >= produto.custo) {
      pontos -= produto.custo;
      atualizarPontos();

      const mensagem = document.createElement("div");
      mensagem.className = "recompensa-mensagem";
      mensagem.textContent = `Recompensa adquirida! Verifica no portal académico.`;

      document.body.appendChild(mensagem);

      setTimeout(() => {
        mensagem.classList.add("visivel");
      }, 100);

      setTimeout(() => {
        mensagem.remove();
      }, 3000);
    } else {
      alert(`Não tens pontos suficientes para trocar por ${produto.nome}.`);
    }
  }

  const botoes = document.querySelectorAll('.produto button');
  botoes.forEach((botao, index) => {
    botao.addEventListener('click', () => tentarTrocar(index));
  });

  // Mostrar área de pontos apenas se o utilizador estiver autenticado
  if (utilizadorLogado) {
    areaPontos.style.display = "block";

    // Se precisar redirecionar após login
    localStorage.setItem("utilizadorcomlogin", "true");
    // window.location.href = "Pontuacao.html"; // Se quiser manter o redirecionamento, descomente aqui
  }

  atualizarPontos();
});

})();
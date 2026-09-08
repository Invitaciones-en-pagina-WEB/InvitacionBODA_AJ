/*
=========================================================
   CONFIGURACIÓN DE LA INVITACIÓN
=========================================================

Este objeto contiene todos los datos principales de la boda.

La idea de usar POO es separar:
1. Los datos.
2. La lógica.
3. La interfaz.

Así puedes modificar la información sin tocar toda la aplicación.
*/

class WeddingConfig {
  constructor() {
    this.couple = {
      names: "Ale & Leo",
      initials: "A & L"
    };

    /*
      Fecha de la boda.
      Formato recomendado:
      YYYY-MM-DDTHH:MM:SS
    */
    this.event = {
      date: "2026-12-04T16:00:00",
      displayDate: "04 • 12 • 2026",
      day: "Viernes",
      time: "5:00 PM",

      // CAMBIAR AQUÍ:
      place: "Margó Muxbal",
      address: "Antigua, Carretera a El Salvador, San Jorge Muxbal",

      // CAMBIAR AQUÍ:
      googleMaps: "https://maps.app.goo.gl/ZGS9pt6ViEB1Czfk9?g_st=iw",
      waze: "https://waze.com/ul/h9fxdv4qqy"
    };

    this.dressCode = {
      women:
        "Vestido formal o semi formal en tonos dentro de la paleta sugerida.",

      men:
        "Traje formal o semi formal combinando tonos neutros y verdes.",

      note:
        "Por favor evita utilizar blanco o tonos demasiado similares al vestido de la novia.",

      colors: [
        "#ADB697",
        "#737D69",
        "#535F37",
        "#4A5439",
        "#373C26",
        "#2C331E"
      ]
    };

    this.gifts = {
      bank: "[BANCO]",
      holder: "[NOMBRE]",
      account: "[NÚMERO DE CUENTA]",
      type: "[TIPO DE CUENTA]"
    };
  }
}


/*
=========================================================
   CLASE PARA LA CUENTA REGRESIVA
=========================================================
*/
class Countdown {
  constructor(targetDate) {
    this.targetDate = new Date(targetDate);

    this.elements = {
      days: document.getElementById("days"),
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds")
    };

    this.interval = null;
  }

  start() {
    this.update();

    this.interval = setInterval(() => {
      this.update();
    }, 1000);
  }

  update() {
    const now = new Date();
    const difference = this.targetDate - now;

    if (difference <= 0) {
      this.finish();
      return;
    }

    const time = this.calculateTime(difference);
    this.render(time);
  }

  calculateTime(difference) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    return {
      days: Math.floor(difference / day),
      hours: Math.floor((difference % day) / hour),
      minutes: Math.floor((difference % hour) / minute),
      seconds: Math.floor((difference % minute) / second)
    };
  }

  render(time) {
    this.elements.days.textContent = String(time.days).padStart(2, "0");
    this.elements.hours.textContent = String(time.hours).padStart(2, "0");
    this.elements.minutes.textContent = String(time.minutes).padStart(2, "0");
    this.elements.seconds.textContent = String(time.seconds).padStart(2, "0");
  }

  finish() {
    clearInterval(this.interval);

    this.render({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });
  }
}


/*
=========================================================
   CLASE PARA ANIMACIONES AL HACER SCROLL
=========================================================
*/
class ScrollAnimations {
  constructor(selector = ".reveal") {
    this.elements = document.querySelectorAll(selector);
  }

  init() {
    const options = {
      threshold: 0.15
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    this.elements.forEach((element) => {
      this.observer.observe(element);
    });
  }
}


/*
=========================================================
   CLASE PARA GENERAR LA PALETA DE COLORES
=========================================================
*/
class ColorPalette {
  constructor(containerId, colors) {
    this.container = document.getElementById(containerId);
    this.colors = colors;
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = "";

    this.colors.forEach((color) => {
      const colorElement = document.createElement("span");

      colorElement.classList.add("palette__color");
      colorElement.style.backgroundColor = color;
      colorElement.setAttribute("aria-label", `Color ${color}`);

      this.container.appendChild(colorElement);
    });
  }
}


/*
=========================================================
   CLASE PRINCIPAL DE LA INVITACIÓN
=========================================================
*/
class WeddingInvitation {
  constructor(config) {
    this.config = config;

    this.countdown = new Countdown(this.config.event.date);

    this.animations = new ScrollAnimations();

    this.palette = new ColorPalette(
      "colorPalette",
      this.config.dressCode.colors
    );
  }

  init() {
    this.renderContent();
    this.palette.render();
    this.countdown.start();
    this.animations.init();
  }

  renderContent() {
    this.setText("coupleNames", this.config.couple.names);
    this.setText("initials", this.config.couple.initials);

    this.setText("heroDate", this.config.event.displayDate);

    this.setText("eventDay", this.config.event.day);
    this.setText("eventTime", `Hora: ${this.config.event.time}`);
    this.setText("eventPlace", this.config.event.place);
    this.setText("eventAddress", this.config.event.address);

    this.setLink("mapsButton", this.config.event.googleMaps);
    this.setLink("wazeButton", this.config.event.waze);

    this.setText("womenDress", this.config.dressCode.women);
    this.setText("menDress", this.config.dressCode.men);
    this.setText("paletteNote", this.config.dressCode.note);

    this.setText("bankName", this.config.gifts.bank);
    this.setText("bankHolder", this.config.gifts.holder);
    this.setText("bankAccount", this.config.gifts.account);
    this.setText("bankType", this.config.gifts.type);
  }

  setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  }

  setLink(id, href) {
    const element = document.getElementById(id);

    if (element) {
      element.href = href;
    }
  }
}


/*
=========================================================
   INICIALIZACIÓN
=========================================================
*/
document.addEventListener("DOMContentLoaded", () => {
  const config = new WeddingConfig();
  const invitation = new WeddingInvitation(config);

  invitation.init();
});

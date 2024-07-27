/*

(function fairyDustCursor() {
 
    var possibleColors = ["#D61C59", "#E7D84B", "#1B8798"]
    var width = window.innerWidth;
    var height = window.innerHeight;
    var cursor = { x: width / 2, y: width / 2 };
    var particles = [];
 
    function init() {
      bindEvents();
      loop();
    }
 
    // Bind events that are needed
    function bindEvents() {
      document.addEventListener('mousemove', onMouseMove);
      window.addEventListener('resize', onWindowResize);
    }
 
    function onWindowResize(e) {
      width = window.innerWidth;
      height = window.innerHeight;
    }
 
    function onMouseMove(e) {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
 
      addParticle(cursor.x, cursor.y, possibleColors[Math.floor(Math.random() * possibleColors.length)]);
    }
 
    function addParticle(x, y, color) {
      var particle = new Particle();
      particle.init(x, y, color);
      particles.push(particle);
    }
 
    function updateParticles() {
 
      // Updated
      for (var i = 0; i < particles.length; i++) {
        particles[i].update();
      }
 
      // Remove dead particles
      for (var i = particles.length - 1; i >= 0; i--) {
        if (particles[i].lifeSpan < 0) {
          particles[i].die();
          particles.splice(i, 1);
        }
      }
 
    }
 
    function loop() {
      requestAnimationFrame(loop);
      updateParticles();
    }

    function Particle() {
 
        this.character = "*";
        this.lifeSpan = 120; //ms
        this.initialStyles = {
          "position": "fixed",
          "display": "inline-block",
          "top": "0px",
          "left": "0px",
          "pointerEvents": "none",
          "touch-action": "none",
          "z-index": "10000000",
          "fontSize": "25px",
          "will-change": "transform"
        };
   
        // Init, and set properties
        this.init = function (x, y, color) {
   
          this.velocity = {
            x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
            y: 1
          };
   
          this.position = { x: x + 10, y: y + 10 };
          this.initialStyles.color = color;
   
          this.element = document.createElement('span');
          this.element.innerHTML = this.character;
          applyProperties(this.element, this.initialStyles);
          this.update();
   
          document.querySelector('.js-cursor-container').appendChild(this.element);
        };
   
        this.update = function () {
          this.position.x += this.velocity.x;
          this.position.y += this.velocity.y;
          this.lifeSpan--;
   
          this.element.style.transform = "translate3d(" + this.position.x + "px," + this.position.y + "px, 0) scale(" + (this.lifeSpan / 120) + ")";
        }
   
        this.die = function () {
          this.element.parentNode.removeChild(this.element);
        }
   
      }

      function applyProperties(target, properties) {
        for (var key in properties) {
          target.style[key] = properties[key];
        }
      }
   
      if (!('ontouchstart' in window || navigator.msMaxTouchPoints)) init();
    })();
*/


  "use strict";
 
  // Initial Setup
  var canvas = document.querySelector("canvas");
  var c = canvas.getContext("2d");

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  // Variables
  var mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2 - 80,
  };

  var colors = ["#00bdff", "#4d39ce", "#088eff"];

  // Event Listeners
  addEventListener("mousemove", function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  addEventListener("resize", function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
  });

  // Utility Functions
  function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Objects
  function Particle(x, y, radius, color) {
    var _this = this;

    var distance = randomIntFromRange(50, 120);
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.radians = Math.random() * Math.PI * 2;
    this.velocity = 0.05;
    this.distanceFromCenter = {
      x: distance,
      y: distance,
    };
    this.prevDistanceFromCenter = {
      x: distance,
      y: distance,
    };
    this.lastMouse = { x: x, y: y };

    this.update = function () {
      var lastPoint = { x: _this.x, y: _this.y };
      // Move points over time
      _this.radians += _this.velocity;

      // Drag effect
      _this.lastMouse.x += (mouse.x - _this.lastMouse.x) * 0.05;
      _this.lastMouse.y += (mouse.y - _this.lastMouse.y) * 0.05;

      // Circular Motion
      _this.distanceFromCenter.x =
        _this.prevDistanceFromCenter.x + Math.sin(_this.radians) * 100;
      _this.distanceFromCenter.y =
        _this.prevDistanceFromCenter.x + Math.sin(_this.radians) * 100;

      _this.x =
        _this.lastMouse.x +
        Math.cos(_this.radians) * _this.distanceFromCenter.x;
      _this.y =
        _this.lastMouse.y +
        Math.sin(_this.radians) * _this.distanceFromCenter.y;

      _this.draw(lastPoint);
    };

    this.draw = function (lastPoint) {
      c.beginPath();
      c.strokeStyle = _this.color;
      c.lineWidth = _this.radius;
      c.moveTo(lastPoint.x, lastPoint.y);
      c.lineTo(_this.x, _this.y);
      c.stroke();
      c.closePath();
    };
  }

  // Implementation
  var particles = undefined;
  function init() {
    particles = [];

    for (var i = 0; i < 50; i++) {
      var radius = Math.random() * 2 + 1;
      particles.push(
        new Particle(
          canvas.width / 2,
          canvas.height / 2,
          radius,
          randomColor(colors)
        )
      );
    }
  }

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = "rgba(255, 255, 255, 0.05)";
    c.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(function (particle) {
      particle.update();
    });
  }

  init();
  animate();


    (function () {
      // Sketch of the day: to add a new daily sketch, copy its image into
      // assets/sketches/ and add one entry at the TOP of this list.
      // The first entry is featured large; the rest fill the archive grid.
      var sketches = [
        { src: "assets/img116.jpg", title: "Crow, scaled feathers", date: "2026-10-16", dateLabel: "October 16, 2026", alt: "Detailed marker sketch of a purple crow with scale-like feather patterns, drawn across a sketchbook spread" },
        { src: "assets/img117.jpg", title: "Crow", date: "2026-10-15", dateLabel: "October 15, 2026", alt: "Marker sketch of a crow in purple and magenta" },
        { src: "assets/img118.jpg", title: "Rooster", date: "2026-10-14", dateLabel: "October 14, 2026", alt: "Marker sketch of a rooster in teal and black with a pink comb" },
        { src: "assets/img119.jpg", title: "Kingfisher", date: "2026-10-13", dateLabel: "October 13, 2026", alt: "Marker sketch of a kingfisher in yellow, orange, teal, and magenta" }
      ];

      var feature = document.getElementById("sketch-feature");
      var grid = document.getElementById("sketch-grid");
      if (!feature || !grid || !sketches.length) return;

      function sketchButton(item) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "gallery-item";
        button.setAttribute("data-lightbox-group", "sketches");
        var img = document.createElement("img");
        img.src = item.src;
        img.alt = item.alt;
        img.loading = "lazy";
        button.appendChild(img);
        return button;
      }

      var latest = sketches[0];
      var featureFigure = document.createElement("figure");
      featureFigure.className = "sketch-feature-figure";
      featureFigure.appendChild(sketchButton(latest));
      var featureCopy = document.createElement("div");
      featureCopy.className = "sketch-feature-copy";
      featureCopy.innerHTML = '<p class="project-meta">Latest sketch</p><h3></h3><p class="sketch-date"><time></time></p><p>Marker on paper.</p>';
      featureCopy.querySelector("h3").textContent = latest.title;
      var featureTime = featureCopy.querySelector("time");
      featureTime.setAttribute("datetime", latest.date);
      featureTime.textContent = latest.dateLabel;
      feature.appendChild(featureFigure);
      feature.appendChild(featureCopy);

      sketches.slice(1).forEach(function (item) {
        var card = document.createElement("figure");
        card.className = "sketch-card";
        card.appendChild(sketchButton(item));
        var caption = document.createElement("figcaption");
        var title = document.createElement("span");
        title.className = "sketch-card-title";
        title.textContent = item.title;
        var time = document.createElement("time");
        time.setAttribute("datetime", item.date);
        time.textContent = item.dateLabel;
        caption.appendChild(title);
        caption.appendChild(time);
        card.appendChild(caption);
        grid.appendChild(card);
      });
    }());
  

    (function () {
      var aliases = {
        "": "home",
        home: "home",
        portfolio: "portfolio",
        work: "portfolio",
        process: "portfolio",
        watch: "portfolio",
        about: "about",
        research: "research",
        press: "press",
        sketch: "sketch",
        contact: "contact"
      };
      var titles = {
        home: "Victoria Rose Most — Stop-Motion Puppet Maker",
        portfolio: "Portfolio — Victoria Rose Most",
        about: "About — Victoria Rose Most",
        research: "Research — Victoria Rose Most",
        press: "Press — Victoria Rose Most",
        sketch: "Sketch of the Day — Victoria Rose Most",
        contact: "Contact — Victoria Rose Most"
      };

      function showPage() {
        var route = window.location.hash.slice(1).split("/")[0];
        var page = aliases[route] || "home";
        var views = document.querySelectorAll(".page-view");
        var links = document.querySelectorAll(".topbar nav a[href^='#']");

        views.forEach(function (view) {
          view.hidden = view.getAttribute("data-page") !== page;
        });
        links.forEach(function (link) {
          var linkPage = aliases[link.getAttribute("href").slice(1)] || "home";
          if (linkPage === page) link.setAttribute("aria-current", "page");
          else link.removeAttribute("aria-current");
        });

        document.title = titles[page];
        document.body.setAttribute("data-page", page);

        var portfolioSection = window.location.hash.slice(1).split("/")[1] || "puppets";
        var validPortfolioSections = { "puppets": true, "non-puppet": true, "paintings": true, "video": true, "other": true };
        if (!validPortfolioSections[portfolioSection]) portfolioSection = "puppets";
        document.querySelectorAll("[data-portfolio-panel]").forEach(function (panel) {
          var panelName = panel.getAttribute("data-portfolio-panel");
          var showOther = portfolioSection === "other" && (panelName === "non-puppet" || panelName === "paintings");
          panel.hidden = panelName !== portfolioSection && !showOther;
        });
        document.querySelectorAll("[data-portfolio-link]").forEach(function (link) {
          var linkName = link.getAttribute("data-portfolio-link");
          var current = linkName === portfolioSection || (linkName === "other" && (portfolioSection === "non-puppet" || portfolioSection === "paintings"));
          if (current) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });

        window.requestAnimationFrame(function () {
          var legacyTarget = route === "work" || route === "process" || route === "watch";
          var target = legacyTarget ? document.getElementById(route) : null;
          if (target) target.scrollIntoView();
          else window.scrollTo(0, 0);
        });
      }

      var film = document.getElementById("ray-ban-film");
      var soundControl = document.querySelector(".sound-control");
      if (film && soundControl) {
        soundControl.addEventListener("click", function () {
          var soundIsOn = soundControl.getAttribute("aria-pressed") === "true";
          var nextMuted = soundIsOn ? "1" : "0";
          film.src = "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FLifeAtMeta%2Fvideos%2F639020882390122%2F&show_text=false&autoplay=true&mute=" + (nextMuted === "1" ? "true" : "false") + "&width=620";
          soundControl.setAttribute("aria-pressed", soundIsOn ? "false" : "true");
          soundControl.textContent = soundIsOn ? "Turn sound on" : "Mute";
          film.title = "Ray-Ban Meta Glasses and the People Who Made It Happen — " + (soundIsOn ? "playing muted" : "sound on");
        });
      }

      var lightbox = document.getElementById("image-lightbox");
      var lightboxImage = lightbox ? lightbox.querySelector("img") : null;
      var lightboxItems = [];
      var lightboxIndex = 0;
      var lastLightboxTrigger = null;

      function showLightboxImage(index) {
        if (!lightboxItems.length || !lightboxImage) return;
        lightboxIndex = (index + lightboxItems.length) % lightboxItems.length;
        var image = lightboxItems[lightboxIndex].querySelector("img");
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
      }
      function closeLightbox() {
        if (!lightbox) return;
        lightbox.hidden = true;
        document.body.style.overflow = "";
        if (lastLightboxTrigger) lastLightboxTrigger.focus();
      }
      document.querySelectorAll(".gallery-item").forEach(function (item) {
        item.addEventListener("click", function () {
          var group = item.getAttribute("data-lightbox-group");
          lightboxItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item[data-lightbox-group="' + group + '"]'));
          lightboxIndex = lightboxItems.indexOf(item);
          lastLightboxTrigger = item;
          showLightboxImage(lightboxIndex);
          lightbox.hidden = false;
          document.body.style.overflow = "hidden";
          lightbox.querySelector("[data-lightbox-close]").focus();
        });
      });
      if (lightbox) {
        lightbox.querySelector("[data-lightbox-close]").addEventListener("click", closeLightbox);
        lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", function () { showLightboxImage(lightboxIndex - 1); });
        lightbox.querySelector("[data-lightbox-next]").addEventListener("click", function () { showLightboxImage(lightboxIndex + 1); });
        lightbox.addEventListener("click", function (event) { if (event.target === lightbox || event.target.classList.contains("lightbox-stage")) closeLightbox(); });
      }
      document.addEventListener("keydown", function (event) {
        if (!lightbox || lightbox.hidden) return;
        if (event.key === "Escape") closeLightbox();
        if (event.key === "ArrowLeft") showLightboxImage(lightboxIndex - 1);
        if (event.key === "ArrowRight") showLightboxImage(lightboxIndex + 1);
      });

      window.addEventListener("hashchange", showPage);
      showPage();
    }());
  
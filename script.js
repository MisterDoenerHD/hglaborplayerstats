// Funktion, die die Statistiken im Canvas zeichnet
function drawStats(data) {
    // Spielerstatistiken anzeigen
    const playerStats = document.getElementById("playerStats");
    playerStats.innerHTML = `
      <p><span class="label">Spieler ID:</span> ${data.playerId}</p>
      <p><span class="label">XP:</span> ${data.xp}</p>
      <p><span class="label">Kills:</span> ${data.kills}</p>
      <p><span class="label">Deaths:</span> ${data.deaths}</p>
      <p><span class="label">Aktuelle Killstreak:</span> ${data.currentKillStreak}</p>
      <p><span class="label">Höchste Killstreak:</span> ${data.highestKillStreak}</p>
      <p><span class="label">Bounty:</span> ${data.bounty}</p>
    `;

    // Heldenstatistiken dynamisch erstellen
    const heroStatsContainer = document.getElementById("heroStatsContainer");
    heroStatsContainer.innerHTML = ''; // Leere den Container

    const heroes = Object.keys(data.heroes);
    heroes.forEach(hero => {
        const heroBox = document.createElement("div");
        heroBox.classList.add("hero-box");

        const heroName = document.createElement("div");
        heroName.classList.add("hero-name");
        heroName.textContent = hero.charAt(0).toUpperCase() + hero.slice(1);

        heroBox.appendChild(heroName);

        // Stil für das eingeklappt/ausgeklappt Symbol (Pfeil hinzufügen)
        const arrowIcon = document.createElement("span");
        arrowIcon.textContent = " ▼";
        arrowIcon.classList.add("arrow-icon");
        heroName.appendChild(arrowIcon);

        // Event-Listener für das Aufklappen der Heldenstatistik
        heroName.addEventListener("click", function() {
            heroBox.classList.toggle("open");

            // Drehen des Pfeils basierend auf dem Zustand der Box
            if (heroBox.classList.contains("open")) {
                arrowIcon.textContent = " ▲";  // Pfeil nach oben
            } else {
                arrowIcon.textContent = " ▼";  // Pfeil nach unten
            }
        });

        const abilities = data.heroes[hero];
        Object.keys(abilities).forEach(ability => {
            const abilityElement = document.createElement("div");
            abilityElement.classList.add("hero-ability");
            abilityElement.textContent = ability.replace(/_/g, ' ');

            heroBox.appendChild(abilityElement);

            const details = abilities[ability];
            Object.keys(details).forEach(detail => {
                const detailElement = document.createElement("div");
                detailElement.classList.add("hero-ability-detail");
                detailElement.innerHTML = `${detail.replace(/_/g, ' ')}: <span>${details[detail].experiencePoints} XP</span>`;

                heroBox.appendChild(detailElement);
            });
        });

        heroStatsContainer.appendChild(heroBox);
    });

    // Das Form zum Abrufen der Daten ausblenden
    document.getElementById("fetchForm").style.display = 'none';
    // Das Container mit den Statistiken anzeigen
    document.getElementById("statsContainer").style.display = 'block';
}

// Daten abrufen
document.getElementById("fetchData").addEventListener("click", function() {
    const gamemode = document.getElementById("gamemode").value;
    const playerId = document.getElementById("playerId").value.trim();

    if (!gamemode || !playerId) {
        alert("Bitte Gamemode und Player ID angeben.");
        return;
    }

    const url = `https://api.hglabor.de/stats/${encodeURIComponent(gamemode)}/${encodeURIComponent(playerId)}`;

    fetch(url, {
        method: "GET",
        mode: "cors"
    })
    .then(response => response.json())
    .then(data => {
        drawStats(data);  // Aufruf der überarbeiteten Funktion
    })
    .catch(error => {
        console.error("API-Fehler:", error);
        alert("Fehler beim Abrufen der Daten.");
    });
});

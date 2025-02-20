// Funktion, um den Minecraft-Namen in eine UUID umzuwandeln
async function getUUID(playerIdentifier) {
    const url = `https://api.ashcon.app/mojang/v2/user/${playerIdentifier}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.uuid; // Gibt die UUID des Spielers zurück
    } catch (error) {
        console.error("Fehler beim Abrufen der UUID:", error);
        return playerIdentifier; // Falls es ein Fehler gibt, wird der ursprüngliche Wert zurückgegeben
    }
}

// Funktion, die die Statistiken im Canvas zeichnet
function drawStats(data) {
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

    const heroStatsContainer = document.getElementById("heroStatsContainer");
    heroStatsContainer.innerHTML = '';
    
    const heroes = Object.keys(data.heroes);
    heroes.forEach(hero => {
        const heroBox = document.createElement("div");
        heroBox.classList.add("hero-box");
        
        const heroName = document.createElement("div");
        heroName.classList.add("hero-name");
        heroName.textContent = hero.charAt(0).toUpperCase() + hero.slice(1);
        
        heroBox.appendChild(heroName);
        
        const arrowIcon = document.createElement("span");
        arrowIcon.textContent = " ▼";
        arrowIcon.classList.add("arrow-icon");
        heroName.appendChild(arrowIcon);
        
        heroName.addEventListener("click", function() {
            heroBox.classList.toggle("open");
            arrowIcon.textContent = heroBox.classList.contains("open") ? " ▲" : " ▼";
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

    document.getElementById("fetchForm").style.display = 'none';
    document.getElementById("statsContainer").style.display = 'block';
}

// Daten abrufen
document.getElementById("fetchData").addEventListener("click", async function() {
    const gamemode = document.getElementById("gamemode").value;
    let playerIdentifier = document.getElementById("playerId").value.trim();

    if (!gamemode || !playerIdentifier) {
        alert("Bitte Gamemode und Player ID/Namen angeben.");
        return;
    }

    const playerUUID = await getUUID(playerIdentifier);
    const url = `https://api.hglabor.de/stats/${encodeURIComponent(gamemode)}/${encodeURIComponent(playerUUID)}`;

    fetch(url, {
        method: "GET",
        mode: "cors"
    })
    .then(response => response.json())
    .then(data => {
        drawStats(data);
    })
    .catch(error => {
        console.error("API-Fehler:", error);
        alert("Fehler beim Abrufen der Daten.");
    });
});
